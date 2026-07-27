const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
require('dotenv').config();

const User = require('../models/user');
const Assessment = require('../models/Assessment');
const Attempt = require('../models/Attempt');
const Certificate = require('../models/Certificate');
const CertificateVerification = require('../models/CertificateVerification');
const { generateCertificatePDF } = require('../services/pdfService');
const certificateRoutes = require('../routes/certificateRoutes');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillgrid_test';

// Helper function to make HTTP GET request
function makeGetRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({ status: res.statusCode, headers: res.headers, body: parsed });
            });
        }).on('error', err => reject(err));
    });
}

async function runTestSuite() {
    console.log('\n======================================================');
    console.log('   RUNNING CERTIFICATE MODULE TEST SUITE              ');
    console.log('======================================================\n');

    let server = null;
    let port = 5099;

    try {
        // 1. Connect to DB
        await mongoose.connect(mongoUri);
        console.log('✓ Connected to MongoDB Test Database.');

        // 2. Setup Express test server
        const app = express();
        app.use(express.json());
        app.use('/api', certificateRoutes);

        await new Promise((resolve) => {
            server = app.listen(port, () => {
                console.log(`✓ Test Express server running on port ${port}.`);
                resolve();
            });
        });

        // 3. Clear database for clean test state
        await User.deleteMany({});
        await Assessment.deleteMany({});
        await Attempt.deleteMany({});
        await Certificate.deleteMany({});
        await CertificateVerification.deleteMany({});
        console.log('✓ Cleared test collections.');

        // 4. Test Case 1: Seed data creation
        console.log('\n[TEST 1] Testing Data Creation (User, Assessment, Attempt)...');
        const user = await User.create({
            name: 'Aryan Goyal',
            email: 'aryan@ujwalradiant.com',
            password: 'password123',
            role: 'candidate'
        });

        const assessment = await Assessment.create({
            title: 'Cloud Native Architecture',
            skillCategory: 'Cloud',
            totalMarks: 100,
            passingMark: 50
        });

        const passAttempt = await Attempt.create({
            studentId: user._id,
            assessmentId: assessment._id,
            scoreObtained: 90,
            totalMarks: 100,
            status: 'completed',
            isPassed: true
        });

        const failAttempt = await Attempt.create({
            studentId: user._id,
            assessmentId: assessment._id,
            scoreObtained: 35,
            totalMarks: 100,
            status: 'completed',
            isPassed: false
        });

        console.log('✓ Test 1 Passed: Users, Assessments, and Attempts created successfully.');

        // 5. Test Case 2: Lazy Certificate Generation on First Request
        console.log('\n[TEST 2] Testing Lazy Certificate Generation Endpoint...');
        const lazyRes = await makeGetRequest(`http://localhost:${port}/api/certificates/attempt/${passAttempt._id}`);

        if (lazyRes.status !== 201) {
            throw new Error(`Expected HTTP 201 for lazy creation, got ${lazyRes.status}`);
        }
        if (!lazyRes.body.success || !lazyRes.body.certificate) {
            throw new Error('Lazy generation response body is missing certificate object.');
        }

        const generatedCert = lazyRes.body.certificate;
        console.log(`✓ Test 2 Passed: Certificate lazily generated with ID "${generatedCert.certificateNumber}".`);

        // 6. Test Case 3: On-the-Fly Percentage Calculation
        console.log('\n[TEST 3] Testing On-the-Fly Percentage Calculation...');
        const fetchedCertDoc = await Certificate.findById(generatedCert._id);
        if (fetchedCertDoc.percentage !== 90) {
            throw new Error(`Expected percentage 90%, got ${fetchedCertDoc.percentage}%`);
        }
        console.log(`✓ Test 3 Passed: Percentage computed dynamically as ${fetchedCertDoc.percentage}%.`);

        // 7. Test Case 4: Idempotency (Requesting same attempt again returns existing certificate)
        console.log('\n[TEST 4] Testing Idempotency of Certificate Request...');
        const retryRes = await makeGetRequest(`http://localhost:${port}/api/certificates/attempt/${passAttempt._id}`);
        if (retryRes.status !== 200) {
            throw new Error(`Expected HTTP 200 for existing certificate fetch, got ${retryRes.status}`);
        }
        if (retryRes.body.certificate.certificateNumber !== generatedCert.certificateNumber) {
            throw new Error('Idempotency failure: duplicate certificate created instead of returning existing one.');
        }
        console.log('✓ Test 4 Passed: Duplicate generation prevented, returned existing certificate.');

        // 8. Test Case 5: Reject Certificate Generation for Failed Attempt
        console.log('\n[TEST 5] Testing Failed Attempt Certificate Rejection...');
        const failRes = await makeGetRequest(`http://localhost:${port}/api/certificates/attempt/${failAttempt._id}`);
        if (failRes.status !== 400) {
            throw new Error(`Expected HTTP 400 for failed attempt, got ${failRes.status}`);
        }
        console.log('✓ Test 5 Passed: System correctly refused certificate generation for failed attempt.');

        // 9. Test Case 6: Public Certificate Verification API
        console.log('\n[TEST 6] Testing Public Certificate Verification Endpoint...');
        const verifyRes = await makeGetRequest(`http://localhost:${port}/api/verify/${generatedCert.certificateNumber}`);
        if (verifyRes.status !== 200 || !verifyRes.body.isValid) {
            throw new Error('Verification failed for valid certificate.');
        }
        if (verifyRes.body.studentName !== 'Aryan Goyal' || verifyRes.body.percentage !== 90) {
            throw new Error('Verification response returned mismatched metadata.');
        }
        console.log('✓ Test 6 Passed: Public verification returned authentic candidate details.');

        // 10. Test Case 7: Verification Audit Logging
        console.log('\n[TEST 7] Testing Verification Audit Logging in Database...');
        const auditLog = await CertificateVerification.findOne({ certificateNumber: generatedCert.certificateNumber });
        if (!auditLog || !auditLog.isValid) {
            throw new Error('Verification audit log entry was not saved to CertificateVerification collection.');
        }
        console.log('✓ Test 7 Passed: Verification query logged to CertificateVerification collection.');

        // 11. Test Case 8: Invalid Certificate Search
        console.log('\n[TEST 8] Testing Invalid Certificate Verification...');
        const invalidVerifyRes = await makeGetRequest(`http://localhost:${port}/api/verify/INVALID-CERT-9999`);
        if (invalidVerifyRes.status !== 404 || invalidVerifyRes.body.isValid !== false) {
            throw new Error(`Expected HTTP 404 for invalid certificate, got ${invalidVerifyRes.status}`);
        }
        console.log('✓ Test 8 Passed: Invalid certificate correctly returned HTTP 404.');

        // 12. Test Case 9: PDF Rendering Service
        console.log('\n[TEST 9] Testing Server-side PDF & QR Code Generator...');
        const pdfBuffer = await generateCertificatePDF({
            studentName: fetchedCertDoc.studentName,
            assessmentTitle: fetchedCertDoc.assessmentTitle,
            skillCategory: fetchedCertDoc.skillCategory,
            scoreObtained: fetchedCertDoc.scoreObtained,
            totalMarks: fetchedCertDoc.totalMarks,
            percentage: fetchedCertDoc.percentage,
            grade: fetchedCertDoc.grade,
            issueDate: fetchedCertDoc.issueDate,
            certificateNumber: fetchedCertDoc.certificateNumber,
            status: fetchedCertDoc.status,
            verifyUrl: `http://localhost:5173/verify/${fetchedCertDoc.certificateNumber}`
        });

        if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length < 2000) {
            throw new Error('PDF service did not return a valid PDF Buffer.');
        }
        console.log(`✓ Test 9 Passed: PDF generated cleanly (${pdfBuffer.length} bytes).`);

        console.log('\n======================================================');
        console.log('   ALL 9 TEST CASES PASSED SUCCESSFULLY!              ');
        console.log('======================================================\n');

    } catch (err) {
        console.error('\n❌ TEST SUITE FAILED:', err);
        process.exitCode = 1;
    } finally {
        if (server) {
            server.close();
        }
        await mongoose.disconnect();
        console.log('Disconnected from Test Database.');
    }
}

runTestSuite();
