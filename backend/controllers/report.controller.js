const Assessment = require("../models/assessment");
const User = require("../models/user");
const Attempt = require("../models/result"); // Assuming your results are stored in an Attempt or Result model
const Certificate = require("../models/certificate");

exports.getAnalyticsDashboard = async (req, res) => {
    try {
        const examinerId = req.user._id;
        const { startDate, endDate, skillId, assessmentId } = req.query;

        // --- 1. FILTERING LOGIC ---
        // Build a query object for attempts based on the frontend filters
        let attemptQuery = { status: "Completed" }; 
        
        if (startDate && endDate) {
            attemptQuery.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (assessmentId) {
            attemptQuery.assessment = assessmentId;
        }

        // --- 2. KPI CALCULATIONS (SRS AC) ---
        // 1. Total Assessments
        const totalAssessments = await Assessment.countDocuments();
        
        // 2. Total Candidates
        const totalCandidates = await User.countDocuments({ role: "candidate" });
        
        // 3. Certificates Issued
        const certificatesIssued = await Certificate.countDocuments();

        // 4. Pass/Fail Ratio & Performance Data
        // Fetch attempts and populate necessary fields
        const allAttempts = await Attempt.find(attemptQuery)
            .populate("candidate", "name")
            .populate({
                path: "assessment",
                select: "title passingMarks skillId",
                populate: { path: "skillId", select: "name" }
            })
            .sort({ createdAt: -1 });

        let passedCount = 0;
        let performanceData = [];

        // Process data for the table and pass rate
        allAttempts.forEach(attempt => {
            // Apply skill category filter manually if requested
            if (skillId && attempt.assessment.skillId?._id.toString() !== skillId) {
                return; // Skip this record
            }

            const isPass = attempt.score >= attempt.assessment.passingMarks;
            if (isPass) passedCount++;

            performanceData.push({
                candidateName: attempt.candidate?.name || "Unknown Candidate",
                assessmentTitle: attempt.assessment?.title || "Deleted Assessment",
                category: attempt.assessment?.skillId?.name || "Uncategorized",
                score: attempt.score,
                result: isPass ? "Pass" : "Fail",
                date: attempt.createdAt
            });
        });

        // Calculate Average Pass Rate (%)
        const passRate = performanceData.length > 0 
            ? Math.round((passedCount / performanceData.length) * 100) 
            : 0;

        // --- 3. SEND RESPONSE ---
        res.status(200).json({
            stats: {
                totalAssessments,
                totalCandidates,
                passRate,
                certificatesIssued
            },
            performanceData // This populates the summary table
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to load analytics data." });
    }
};