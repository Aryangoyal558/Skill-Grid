const User = require("../models/user");

const dashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();

        const totalCandidates = await User.countDocuments({
            role: "candidate",
        });

        const totalExaminers = await User.countDocuments({
            role: "examiner",
        });

        const totalAdmins = await User.countDocuments({
            role: "admin",
        });

        res.status(200).json({
            success: true,
            message: "Admin Dashboard",
            admin: req.user,
            statistics: {
                totalUsers,
                totalCandidates,
                totalExaminers,
                totalAdmins,
            },
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

};

module.exports = {
    dashboard,
};