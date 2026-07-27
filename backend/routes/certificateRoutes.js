const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const Certificate = require('../models/Certificate');
const CertificateVerification = require('../models/CertificateVerification');
const Attempt = require('../models/Attempt');
const Assessment = require('../models/Assessment');
const User = require('../models/user');

const { generateCertificatePDF } = require('../services/pdfService');

/**
 * Helper to calculate grade based on percentage
 */
function calculateGrade(percentage) {
    if (percentage >= 90) return 'S (Outstanding)';
    if (percentage >= 80) return 'A (Excellent)';
    if (percentage >= 70) return 'B (Good)';
    if (percentage >= 60) return 'C (Satisfactory)';
    return 'Pass';
}

/**
 * Helper to generate human-readable unique certificate number
 */
function generateCertificateNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = uuidv4().split('-')[0].toUpperCase().substring(0, 4);
    return `SG-CERT-${timestamp}-${randomHex}`;
}

// ==========================================
// 1. GET /api/certificates/attempt/:attemptId
// Fetch or lazily generate certificate record for an attempt
// ==========================================
router.get('/certificates/attempt/:attemptId', async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Check if certificate already exists for this attempt
        let certificate = await Certificate.findOne({ attemptId });

        if (certificate) {
            const host = req.get('host') || 'localhost:5000';
            const protocol = req.protocol || 'http';
            const baseUrl = `${protocol}://${host}`;

            return res.status(200).json({
                success: true,
                message: 'Certificate fetched successfully',
                certificate: {
                    ...certificate.toObject(),
                    percentage: certificate.percentage
                },
                downloadUrl: `${baseUrl}/api/certificates/download/${certificate.certificateNumber}`,
                verifyUrl: `${protocol}://${req.hostname || 'localhost'}:5173/verify/${certificate.certificateNumber}`
            });
        }

        // Look up Attempt details for lazy creation
        const attempt = await Attempt.findById(attemptId);
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: 'Assessment attempt not found'
            });
        }

        // Fetch Assessment to verify passing mark
        let assessment = null;
        if (attempt.assessmentId) {
            assessment = await Assessment.findById(attempt.assessmentId);
        }

        const totalMarks = attempt.totalMarks || (assessment ? assessment.totalMarks : 100);
        const scoreObtained = attempt.scoreObtained !== undefined ? attempt.scoreObtained : 0;
        const passingMark = assessment ? assessment.passingMark : (totalMarks * 0.5);

        const isPassed = attempt.isPassed !== undefined 
            ? attempt.isPassed 
            : scoreObtained >= passingMark;

        if (!isPassed) {
            return res.status(400).json({
                success: false,
                message: 'Assessment not passed. Digital certificates are only awarded for passing results.'
            });
        }

        // Fetch Student details
        let studentName = 'Candidate';
        if (attempt.studentId) {
            const student = await User.findById(attempt.studentId);
            if (student) {
                studentName = student.name || student.fullName || studentName;
            }
        }

        const assessmentTitle = assessment ? assessment.title : 'Skill Assessment';
        const skillCategory = assessment ? (assessment.skillCategory || 'General') : 'General';
        const percentage = Math.round((scoreObtained / totalMarks) * 100 * 100) / 100;
        const grade = calculateGrade(percentage);

        // Lazily create certificate record
        certificate = new Certificate({
            studentId: attempt.studentId,
            studentName: studentName,
            assessmentId: attempt.assessmentId,
            assessmentTitle: assessmentTitle,
            skillCategory: skillCategory,
            attemptId: attempt._id,
            certificateNumber: generateCertificateNumber(),
            scoreObtained: scoreObtained,
            totalMarks: totalMarks,
            grade: grade,
            issueDate: new Date(),
            status: 'active'
        });

        await certificate.save();

        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol || 'http';
        const baseUrl = `${protocol}://${host}`;

        return res.status(201).json({
            success: true,
            message: 'Certificate generated successfully',
            certificate: {
                ...certificate.toObject(),
                percentage: certificate.percentage
            },
            downloadUrl: `${baseUrl}/api/certificates/download/${certificate.certificateNumber}`,
            verifyUrl: `${protocol}://${req.hostname || 'localhost'}:5173/verify/${certificate.certificateNumber}`
        });

    } catch (error) {
        console.error('Error fetching/generating certificate:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while processing certificate',
            error: error.message
        });
    }
});

// ==========================================
// 2. GET /api/certificates/download/:certificateNumber
// Stream/download certificate PDF on-the-fly
// ==========================================
router.get('/certificates/download/:certificateNumber', async (req, res) => {
    try {
        const { certificateNumber } = req.params;

        const certificate = await Certificate.findOne({ certificateNumber });
        if (!certificate) {
            return res.status(404).send('Certificate not found');
        }

        if (certificate.status === 'revoked') {
            return res.status(403).send('This certificate has been revoked');
        }

        const host = req.hostname || 'localhost';
        const verifyUrl = `http://${host}:5173/verify/${certificate.certificateNumber}`;

        const certData = {
            studentName: certificate.studentName,
            assessmentTitle: certificate.assessmentTitle,
            skillCategory: certificate.skillCategory,
            scoreObtained: certificate.scoreObtained,
            totalMarks: certificate.totalMarks,
            percentage: certificate.percentage,
            grade: certificate.grade,
            issueDate: certificate.issueDate,
            certificateNumber: certificate.certificateNumber,
            status: certificate.status,
            verifyUrl: verifyUrl
        };

        const pdfBuffer = await generateCertificatePDF(certData);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Certificate-${certificate.certificateNumber}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        return res.end(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        return res.status(500).send('Error generating certificate PDF');
    }
});

// ==========================================
// 3. GET /api/verify/:certificateNumber
// Public certificate verification endpoint
// ==========================================
router.get('/verify/:certificateNumber', async (req, res) => {
    const { certificateNumber } = req.params;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    try {
        const certificate = await Certificate.findOne({ certificateNumber });

        if (!certificate) {
            // Log failed verification attempt
            await CertificateVerification.create({
                certificateNumber,
                isValid: false,
                verifiedBy: 'Public Verifier',
                metadata: { ip: clientIp, userAgent }
            }).catch(err => console.error('Verification log error:', err));

            return res.status(404).json({
                isValid: false,
                message: 'Certificate not found. Please check the Certificate ID and try again.'
            });
        }

        // Log successful verification attempt
        await CertificateVerification.create({
            certificateNumber,
            isValid: certificate.status === 'active',
            verifiedBy: 'Public Verifier',
            metadata: { ip: clientIp, userAgent }
        }).catch(err => console.error('Verification log error:', err));

        const percentage = certificate.percentage;

        return res.status(200).json({
            isValid: true,
            status: certificate.status,
            certificateNumber: certificate.certificateNumber,
            studentName: certificate.studentName,
            assessmentTitle: certificate.assessmentTitle,
            skillCategory: certificate.skillCategory,
            scoreObtained: certificate.scoreObtained,
            totalMarks: certificate.totalMarks,
            percentage: percentage,
            grade: certificate.grade,
            issueDate: certificate.issueDate
        });

    } catch (error) {
        console.error('Verification API error:', error);
        return res.status(500).json({
            isValid: false,
            message: 'Server error while verifying certificate'
        });
    }
});

// ==========================================
// 4. POST /api/certificates/mock-seed (For Dev/Testing)
// Creates a mock attempt & generates certificate easily
// ==========================================
router.post('/certificates/mock-seed', async (req, res) => {
    try {
        const { studentName, assessmentTitle, scoreObtained, totalMarks, skillCategory } = req.body;

        const total = totalMarks || 100;
        const score = scoreObtained !== undefined ? scoreObtained : 85;
        const sName = studentName || 'Aryan Goyal';
        const aTitle = assessmentTitle || 'Full Stack Web Development Assessment';

        // Find or create dummy user
        let user = await User.findOne({ name: sName });
        if (!user) {
            user = new User({
                name: sName,
                email: `student_${Date.now()}@ujwalradiant.com`,
                password: 'password123',
                role: 'candidate'
            });
            await user.save();
        }

        // Create dummy assessment
        const assessment = new Assessment({
            title: aTitle,
            skillCategory: skillCategory || 'Web Development',
            totalMarks: total,
            passingMark: total * 0.5
        });
        await assessment.save();

        // Create dummy attempt
        const attempt = new Attempt({
            studentId: user._id,
            assessmentId: assessment._id,
            scoreObtained: score,
            totalMarks: total,
            status: 'completed',
            isPassed: score >= (total * 0.5)
        });
        await attempt.save();

        const host = req.get('host') || 'localhost:5000';
        const protocol = req.protocol || 'http';
        const baseUrl = `${protocol}://${host}`;

        return res.status(201).json({
            success: true,
            message: 'Mock attempt created successfully',
            attemptId: attempt._id,
            certificateApi: `${baseUrl}/api/certificates/attempt/${attempt._id}`
        });

    } catch (error) {
        console.error('Error in mock seed:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
