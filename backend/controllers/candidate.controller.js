const dashboard = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "Candidate Dashboard",

        user: req.user,

    });

};

module.exports = {
    dashboard,
};