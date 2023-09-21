const mongoose = require ("mongoose")


const courseSchema =   new Mongoose.Schema({
    courseName: {
        type: String,
    },
    courseDescription:  {
        type: String,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    
})