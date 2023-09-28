const mongoose = require("mongoose")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type:  Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
})

//function 4 sendin mail
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Verification Email from Studynotion", otp)
        console.log("Email sent successfully", mailResponse)
    } catch (error) {
        console.log("error occured while sending mails",error)
        throw error;
    }
}

OTPSchema.pre("save", async function(next) { //this pre function will run everytime the "create" command is called on this model
    await sendVerificationEmail(this.email, this.otp)
    next()
})

module.exports = mongoose.model("OTP", OTPSchema)