const User = require("../models/User")
const mailSender = require("../utils/mailSender")

//reset password token
exports.resetPasswordToken = async (req, res) => {
    //get email from req body
    //check user for this email, email validation
    //generate token
    //
    
    const url = `http://localhost:3000/update-password/${token}`
}

//reset password