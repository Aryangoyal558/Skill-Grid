const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    studentName: {
        type: String,
        required: true,
        trim: true
    },
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assessment'
    },
    assessmentTitle: {
        type: String,
        required: true,
        trim: true
    },
    skillCategory: {
        type: String,
        default: 'General Skill Assessment'
    },
    attemptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
        unique: true
    },
    certificateNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    },
    scoreObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        default: 'Pass'
    },
    status: {
        type: String,
        enum: ['active', 'revoked'],
        default: 'active'
    }
}, { timestamps: true });

// Dynamic percentage calculation on-the-fly
certificateSchema.virtual('percentage').get(function() {
    if (!this.totalMarks || this.totalMarks === 0) return 0;
    return Math.round((this.scoreObtained / this.totalMarks) * 100 * 100) / 100;
});

certificateSchema.set('toJSON', { virtuals: true });
certificateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
