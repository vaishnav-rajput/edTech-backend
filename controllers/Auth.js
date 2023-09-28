const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")

//sendOTP
exports.sendOTP = async(req, res) => {
    try {   
            //fetch email from body
            const {email} = req.body

            //check if user already exist
            const checkUserPresent = await User.findOne({email})

            //if user already exist, then return a response
            if(checkUserPresent){
                return res.status(401).json({
                    success: false,
                    message: "User already present"
                })
            }

            //generate OTP
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            console.log("OTP generated", otp)

            //check unique or not
            let result = await OTP.findOne({otp: otp})

            while(result){
                otp = otpGenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false,
                });  
                result = await OTP.findOne({otp: otp})
            }

            const otpPayload = {email, otp}

            //create an entry for OTP
            const otpBody = await OTP.create(otpPayload)
            console.log("otp body", otpBody)

            //return response successful
            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                otp,
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//signup

//login

//change password