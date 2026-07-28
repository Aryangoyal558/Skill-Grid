const dashboard = async (req, res) => {

    res.status(200).json({

        success: true,

        message: "Examiner Dashboard",

        user: req.user,

    });

};

module.exports = {
    dashboard,
};