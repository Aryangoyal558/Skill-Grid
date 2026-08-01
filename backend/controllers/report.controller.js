const Assessment = require("../models/assessment");
const User = require("../models/user");
const Attempt = require("../models/result"); // Assuming your results are stored in an Attempt or Result model
const Certificate = require("../models/certificate");
const PDFDocument = require("pdfkit"); // npm install pdfkit

// --- Shared builder used by both the JSON dashboard endpoint and the PDF export ---
async function buildAnalyticsData(query) {
    const { startDate, endDate, skillId, assessmentId } = query;

    // --- 1. FILTERING LOGIC ---
    let attemptQuery = { status: "Completed" };

    if (startDate || endDate) {
        attemptQuery.createdAt = {};
        if (startDate) attemptQuery.createdAt.$gte = new Date(startDate);
        if (endDate) {
            let end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            attemptQuery.createdAt.$lte = end;
        }
    }

    if (assessmentId) {
        attemptQuery.assessment = assessmentId;
    }

    // --- 2. KPI CALCULATIONS ---
    const totalAssessments = await Assessment.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const certificatesIssued = await Certificate.countDocuments();

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

    allAttempts.forEach(attempt => {
        // BUGFIX: attempt.assessment can be null if the assessment was deleted.
        // Skip those rows entirely instead of crashing on attempt.assessment.skillId
        if (!attempt.assessment) return;

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

    const passRate = performanceData.length > 0
        ? Math.round((passedCount / performanceData.length) * 100)
        : 0;

    return {
        stats: { totalAssessments, totalCandidates, passRate, certificatesIssued },
        performanceData
    };
}

exports.getAnalyticsDashboard = async (req, res) => {
    try {
        const data = await buildAnalyticsData(req.query);
        res.status(200).json(data);
    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to load analytics data." });
    }
};

// New: PDF export (AC 45 requires this; CSV export stays client-side)
exports.exportAnalyticsPDF = async (req, res) => {
    try {
        const { stats, performanceData } = await buildAnalyticsData(req.query);

        const doc = new PDFDocument({ margin: 40 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=Assessment_Analytics_Report.pdf");
        doc.pipe(res);

        doc.fontSize(18).text("Assessment Analytics Report", { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`Total Assessments: ${stats.totalAssessments}`);
        doc.text(`Total Candidates: ${stats.totalCandidates}`);
        doc.text(`Average Pass Rate: ${stats.passRate}%`);
        doc.text(`Certificates Issued: ${stats.certificatesIssued}`);
        doc.moveDown();

        doc.fontSize(14).text("Performance Summary", { underline: true });
        doc.moveDown(0.5);

        if (performanceData.length === 0) {
            doc.fontSize(10).text("No records match the selected filters.");
        } else {
            performanceData.forEach(row => {
                doc.fontSize(10).text(
                    `${row.candidateName} | ${row.assessmentTitle} | ${row.category} | Score: ${row.score} | ${row.result} | ${new Date(row.date).toLocaleDateString()}`
                );
            });
        }

        doc.end();
    } catch (error) {
        console.error("PDF Export Error:", error);
        // NOTE: if headers were already sent (streaming had started), res.status() here would throw.
        // Since we only start doc.pipe(res) after buildAnalyticsData succeeds, this is safe.
        res.status(500).json({ message: "Failed to generate PDF report." });
    }
};