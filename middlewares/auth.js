const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")


//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "")

        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        //verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log("decode", decode)
            req.user = decode //adding this to the req.user will help in the authorization process by further middleware
        } catch(error) {
            //verification - issue
            return res.status(401).json({
                success: false,
                message: "TOken is invalid"
            })
        }
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "something went wrong while validating the token"
        })        
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
         if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Instructors only"
            }) 
         }
         next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}

//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
         if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Admin only"
            }) 
         }
         next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}