// Check these 3 paths! Make sure they exactly match your actual model file names.
const Assessment = require("../models/assessment");
const Question = require("../models/question"); 
const User = require("../models/user"); 

exports.getAnalyticsDashboard = async (req, res) => {
    try {
        // req.user._id comes from your authentication middleware
        const examinerId = req.user._id;

        // 1. Fetch REAL counts from the database
        const totalAssessments = await Assessment.countDocuments({ createdBy: examinerId });
        const publishedAssessments = await Assessment.countDocuments({ createdBy: examinerId, isPublished: true });
        const totalQuestions = await Question.countDocuments(); 
        const totalCandidates = await User.countDocuments({ role: "candidate" });

        // 2. Fetch the 5 most recent real assessments
        const recentAssessments = await Assessment.find({ createdBy: examinerId })
            .sort({ createdAt: -1 }) // Sorts by newest first
            .limit(5)
            .populate("skillId", "name"); // Assumes your Assessment model has a skillId ref

        // 3. Send the real data back to React
        res.status(200).json({
            stats: {
                totalAssessments,
                publishedAssessments,
                totalQuestions,
                totalCandidates
            },
            recentAssessments
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to load real analytics data." });
    }
};