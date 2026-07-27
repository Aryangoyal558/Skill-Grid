const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Generates a PDF Certificate buffer using PDFKit and embeds a QR code.
 * @param {Object} cert - Certificate metadata object
 * @returns {Promise<Buffer>} PDF file buffer
 */
async function generateCertificatePDF(cert) {
    return new Promise(async (resolve, reject) => {
        try {
            // A4 Landscape dimensions: 841.89 x 595.28 points
            const doc = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 0
            });

            const buffers = [];
            doc.on('data', chunk => buffers.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(buffers)));
            doc.on('error', err => reject(err));

            const width = 841.89;
            const height = 595.28;

            // Background & Border Styling
            // Outer navy fill border
            doc.rect(0, 0, width, height).fill('#0f172a');
            
            // Inner white canvas
            doc.rect(16, 16, width - 32, height - 32).fill('#ffffff');

            // Decorative inner border lines (Gold accent & Navy framing)
            doc.rect(26, 26, width - 52, height - 52).lineWidth(2).stroke('#0284c7');
            doc.rect(30, 30, width - 60, height - 60).lineWidth(1).stroke('#e2e8f0');

            // Corner Gold Ornaments
            const drawCorner = (x, y) => {
                doc.save();
                doc.rect(x, y, 12, 12).fill('#0284c7');
                doc.restore();
            };
            drawCorner(32, 32);
            drawCorner(width - 44, 32);
            drawCorner(32, height - 44);
            drawCorner(width - 44, height - 44);

            // Header Section
            doc.fillColor('#0369a1')
               .fontSize(15)
               .font('Helvetica-Bold')
               .text('UJWAL RADIANT VISION', 0, 55, { align: 'center' });

            doc.fillColor('#475569')
               .fontSize(10)
               .font('Helvetica')
               .text('ONLINE SKILL ASSESSMENT & DIGITAL CERTIFICATION PLATFORM', 0, 74, { align: 'center' });

            // Horizontal Divider
            doc.moveTo(220, 92).lineTo(width - 220, 92).lineWidth(1).stroke('#cbd5e1');

            // Certificate Main Title
            doc.fillColor('#0f172a')
               .fontSize(26)
               .font('Helvetica-Bold')
               .text('CERTIFICATE OF ACHIEVEMENT', 0, 110, { align: 'center' });

            doc.fillColor('#64748b')
               .fontSize(11)
               .font('Helvetica-Oblique')
               .text('This is to certify that', 0, 148, { align: 'center' });

            // Candidate Name
            const name = (cert.studentName || 'Valued Candidate').toUpperCase();
            doc.fillColor('#0284c7')
               .fontSize(28)
               .font('Helvetica-Bold')
               .text(name, 0, 172, { align: 'center' });

            doc.moveTo(250, 208).lineTo(width - 250, 208).lineWidth(1.5).stroke('#0284c7');

            // Course / Assessment Details
            doc.fillColor('#475569')
               .fontSize(12)
               .font('Helvetica')
               .text('has successfully completed the online skill assessment for', 0, 222, { align: 'center' });

            const courseTitle = cert.assessmentTitle || 'Advanced Skill Assessment';
            doc.fillColor('#0f172a')
               .fontSize(20)
               .font('Helvetica-Bold')
               .text(courseTitle, 0, 245, { align: 'center' });

            if (cert.skillCategory) {
                doc.fillColor('#64748b')
                   .fontSize(11)
                   .font('Helvetica')
                   .text(`Category: ${cert.skillCategory}`, 0, 275, { align: 'center' });
            }

            // Score & Grade Pill
            const percentage = cert.percentage !== undefined 
                ? cert.percentage 
                : Math.round((cert.scoreObtained / cert.totalMarks) * 100);
            
            const gradeText = `Grade: ${cert.grade || 'Pass'}   |   Score: ${cert.scoreObtained}/${cert.totalMarks} (${percentage}%)`;
            
            // Draw Score Badge Box
            doc.roundedRect(width / 2 - 170, 305, 340, 32, 6).fill('#f0f9ff');
            doc.roundedRect(width / 2 - 170, 305, 340, 32, 6).lineWidth(1).stroke('#bae6fd');

            doc.fillColor('#0369a1')
               .fontSize(12)
               .font('Helvetica-Bold')
               .text(gradeText, 0, 314, { align: 'center' });

            // Generate QR Code Buffer
            const verifyUrl = cert.verifyUrl || `http://localhost:5173/verify/${cert.certificateNumber}`;
            const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
                margin: 1,
                width: 95,
                color: {
                    dark: '#0f172a',
                    light: '#ffffff'
                }
            });
            const qrImageBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');

            // Bottom Section Layout (3 Columns: Metadata Left, Signature Center, QR Code Right)
            
            // 1. Metadata Left
            const issueDateStr = cert.issueDate 
                ? new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

            doc.fillColor('#475569')
               .fontSize(9)
               .font('Helvetica-Bold')
               .text('Date of Issue:', 55, 385);
            doc.font('Helvetica')
               .text(issueDateStr, 130, 385);

            doc.font('Helvetica-Bold')
               .text('Certificate ID:', 55, 405);
            doc.font('Helvetica')
               .fillColor('#0f172a')
               .text(cert.certificateNumber, 130, 405);

            doc.font('Helvetica-Bold')
               .fillColor('#475569')
               .text('Status:', 55, 425);
            doc.font('Helvetica')
               .fillColor('#16a34a')
               .text((cert.status || 'Active').toUpperCase(), 130, 425);

            // 2. Signatures Center
            doc.moveTo(width / 2 - 80, 435).lineTo(width / 2 + 80, 435).lineWidth(1).stroke('#cbd5e1');
            doc.fillColor('#0f172a')
               .fontSize(11)
               .font('Helvetica-Bold')
               .text('Divyansh Verma', 0, 442, { align: 'center' });
            doc.fillColor('#64748b')
               .fontSize(9)
               .font('Helvetica')
               .text('Platform Director / Ujwal Radiant Vision', 0, 456, { align: 'center' });

            // 3. QR Code Right
            const qrX = width - 150;
            const qrY = 370;
            doc.image(qrImageBuffer, qrX, qrY, { width: 85, height: 85 });
            doc.fillColor('#64748b')
               .fontSize(8)
               .font('Helvetica')
               .text('Scan to Verify', qrX - 5, qrY + 88, { width: 95, align: 'center' });

            // Footer note
            doc.fillColor('#94a3b8')
               .fontSize(8)
               .text('This is a tamper-proof digitally generated certificate by Ujwal Radiant Vision. Authenticity can be verified at any time using the Certificate ID or QR code.', 0, height - 30, { align: 'center' });

            doc.end();

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generateCertificatePDF
};
