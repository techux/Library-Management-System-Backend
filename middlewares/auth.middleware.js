const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
    const authHeader = req.header('authorization');
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) {
        return res.status(401).json({
            status:"error", 
            message:"Access Denied ! No token Provided"
        }) ;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY) ;
        req.user = user ;
        next() ;
    } catch (error) {
        if (error.name === "JsonWebTokenError"){
            return res.status(401).json({
                status:"error",
                message:"Access Denied ! Invalid token Provided"
            })
        }
        if (error.name === "TokenExpiredError"){
            return res.status(401).json({
                status:"error",
                message:"Access Denied ! Token Expired"
            });
        }
        console.error(`[ERROR] in authMiddleware : ${error.stack || error.message}`);
        return res.status(500).json({
            status:"error",
            message:"Internal Server Error"
        })
    }
}

const restrictTo = (roles) => {
    return function(req, res, next) {        
        if (!req.user) return res.status(403).json({
            status:"error", 
            message:"Access Denied ! Login first"
        }); 
        if (roles.includes(req.user.role)){
            return next() ;
        }
        return res.status(403).json({
            status:"error", 
            message:"Access Denied ! Unauthorized"
        }) ;
    }
}

module.exports = {
    auth,
    restrictTo
}