const User = require("../models/user.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validate } = require("email-validator")

const loginController = async (req, res) => {
    try {
        const {email, username, password} = req.body ;
        if ((!email && !username) || !password){
            return res.status(400).json({
                status: "error",
                message: "Please enter all fields"
            })
        }
        if (email && !validate(email)){
            return res.status(400).json({
                status: "error",
                message: "Invalid email address"
            })
        }
        const user = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        });

        if (!user){
            return res.status(400).json({
                status: "error",
                message: "Invalid login credentials"
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword){
            return res.status(400).json({
                status: "error",
                message: "Invalid login credentials"
            })
        }

        const accessToken = jwt.sign(
            { 
                id: user._id ,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        )

        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        })

        return res.status(200).json({
            status:"ok", 
            message:"Logged in Successfully", 
            accessToken,
        })
    } catch (error) {
        console.error(`Error on loginController ${error.stack || error.message}`)
        res.status(500).json({
            status:"error",
            message: "Internal Server Error"
        });
    }
}


const registerController = async (req, res) => {
    try {
        const {name, email, username, password} = req.body ;
        let role = req.body.role ;
        if (!name || !email || !username || !password || !role) {
            return res.status(400).json({
                status:"error",
                message: "Please fill all the fields"
            })
        }

        if (!validate(email)){
            return res.status(400).json({
                status: "error",
                message: "Invalid email address"
            })
        }
        
        if (role !== "member" && role !== "librarian") {
            role = "member"
        }

        const userExist = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        }) ;
        if (userExist) {
            if (userExist.email === email) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exists"
                });
            }
            if (userExist.username === username) {
                return res.status(400).json({
                    status: "error",
                    message: "Username already exists"
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10) ;

        const result = await User.create({name, email, username, password:hashedPassword, role}) ;

        return res.status(201).json({
            status: "ok",
            message: "User registered successfull, You may login now",
            userId: result._id
        })
        
    } catch (error) {
        console.error(`Error in registerController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const changePasswordController = async (req, res) => {    
    try {
        const {newPassword, oldPassword} = req.body ;
        if (!newPassword || !oldPassword){
            return res.status(400).json({
                status:"error",
                message: "Please fill all the fields"
            })
        }

        const user = await User.findById(req.user.id) ;

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password) ;
        
        if (!isOldPasswordValid) {
            return res.status(401).json({
                status: "error",
                message: "Old password didn't match. Please recheck the password"
            })
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(
            req.user.id,
            {
                password: newHashedPassword
            }
        )

        return res.status(200).json({
            status: "ok",
            message: "Password Changed Successfully"
        })

    } catch (error) {
        console.error(`Error in changePasswordController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}


const logoutController = async (req, res) => {
    try {
        res.cookie('token', '', {
            maxAge: 0, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        
        res.cookie('refreshToken', '', {
            maxAge: 0,  
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production',  
            path: '/' 
        });

        const { refreshToken } = req.cookies;

        if (refreshToken) {
            await RefreshToken.findOneAndDelete({ token: refreshToken });
            return res.status(200).json({
                status: "ok",
                message: "Logged out successfully"
            });
        } else {
            return res.status(400).json({
                status: "error",
                message: "Action Failed! Please try again"
            });
        }
    } catch (error) {
        console.error(`Error in logoutController: ${error.stack || error.message}`);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};


const checkAuthController = async (req, res) => {
    try {
        return res.status(200).json({
            status: "ok",
            data: req.user
        })
    } catch (error) {
        console.error(`Error in authCheckController : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error", 
            message: "Internal Server Error" 
        });
    }
}





module.exports = {
    loginController,
    registerController,
    changePasswordController,
    logoutController,
    checkAuthController
}