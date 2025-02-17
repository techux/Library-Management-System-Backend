const User = require("../models/user.model");

// my profile
const myProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.status(200).json({
            status: "ok",
            data: user
        })
    } catch (error) {
        console.error(`Error in myProfileController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

// update my profile
const updateProfileController = async (req, res) => {
    try {
        const {name, username} = req.body;

        if (!name && !username) {
            return res.status(400).json({
                status: "error",
                message: "Please change some values to update"
            })
        }
        let query = {};
        if (name) query.name = name;
        if (username) query.username = username;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: query
            },
            {
                new: true
            }
        ).select("-password")

        return res.status(200).json({
            status: "ok",
            message: "Profile Updated Successfully",
            data: user
        })

    } catch (error) {
        console.error(`Error in updateProfileController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

// delete my account
const deleteAccountController = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id)
        res.cookie("token","",{maxAge:0})
        return res.status(200).json({
            status: "ok",
            message: "Account deleted successfully"
        })
    } catch (error) {
        console.error(`Error in deleteAccountController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

module.exports = {
    myProfileController,
    updateProfileController,
    deleteAccountController
}