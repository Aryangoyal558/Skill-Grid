const mongoose = require('mongoose');

const certificateVerificationSchema = new mongoose.Schema({
    certificateNumber: {
        type: String,
        required: true,
        index: true
    },
    isValid: {
        type: Boolean,
        required: true
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    },
    verifiedBy: {
        type: String,
        default: 'Public Verifier'
    },
    metadata: {
        ip: String,
        userAgent: String,
        referrer: String
    }
}, { timestamps: true });

module.exports = mongoose.models.CertificateVerification || mongoose.model('CertificateVerification', certificateVerificationSchema);
