const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    startTime: { type: Date, default: Date.now },
    submissionTime: { type: Date },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'completed' },
    scoreObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    isPassed: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
