const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    skillCategory: { type: String, default: 'General' },
    durationMinutes: { type: Number, default: 60 },
    totalMarks: { type: Number, required: true, default: 100 },
    passingMark: { type: Number, required: true, default: 50 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
