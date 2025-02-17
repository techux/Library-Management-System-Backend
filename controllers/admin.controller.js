// I can add, update, view, and remove Member from the system
const Book = require("../models/book.model");
const User = require("../models/user.model");

const bcrypt = require('bcrypt');

// add new member
const addMemberController = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please fill in all fields"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newMember = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        }).select("-password")
        return res.status(201).json({
            status: "ok",
            message: "Member Added Successfully",
            data: newMember
        })
    } catch (error) {
        console.error(`Error in addMemberController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

// update member details
const updateMemberController = async (req, res) => {
    try {
        const {name, email, username, password} = req.body;
        const userId = req.params.id;

        if (!name && !email && !username && !password){
            return res.status(400).json({
                status: "error",
                message: "Please update at least one field"
            });
        }

        let query = {};
        if (name) query.name = name;
        if (email) query.email = email;
        if (username) query.username = username;
        if (password) query.password = (await bcrypt.hash(password, 10));        

        const member = await User.findByIdAndUpdate(
            userId,
            {
                $set: query
            },
            {
                new: true
            }
        ).select("-password")

        return res.status(200).json({
            status: "ok",
            message: "Member Updated Successfully",
            data: member
        })
        
    } catch (error) {
        console.error(`Error in updateMemberController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


// view member details
const viewMemberController = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Please provide user id"
            });
        }
        const member = await User.findById(userId).select("-password");
        if (!member) {
            return res.status(404).json({
                status: "error",
                message: "No member found"
            });
        }
        return res.status(200).json({
            status: "ok",
            data: member
        })
    } catch (error) {
        console.error(`Error in viewMemberController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

//  view all members
const viewAllMembersController = async (req, res) => {
    try {
        const members = await User.find({}).select("-password");
        return res.status(200).json({
            status: "ok",
            data: members
        })
    } catch (error) {
        console.error(`Error in viewAllMembersController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

// remove a member from database
const removeMemberCotroller = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Please provide user id"
            });
        }
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            status: "ok",
            message: "Member removed successfully"
        });
    } catch (error) {
        console.error(`Error in removeMemberCotroller : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}

// search a member
const searchMemberController = async (req, res) => {
    try {
        const keyword = req.query.q ;
        if (!keyword) {
            return res.status(400).json({
                status: "error",
                message: "Please provide search keyword"
            });
        }
        const members = await User.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { username: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } }
            ]
        }).select("-password");

        return res.status(200).json({
            status: "ok",
            data: members
        });
    } catch (error) {
        console.error(`Error in searchMemberController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


module.exports = {
    addMemberController,
    updateMemberController,
    viewMemberController,
    viewAllMembersController,
    removeMemberCotroller,
    searchMemberController
}