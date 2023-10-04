const express = require("express")
const app = express()

const userRoutes = require("./routes/User")
const profileRoutes = require("./routes/Profile")
const paymentRoutes = require("./routes/Payments")
const courseRoutes = require("./routes/Course")

const database = require("./config/database")
const cookieParser = require("cookie-parser")

const cors = require("cors") //as backend needs to entertain frontend's req cors is required
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload = require("express-fileupload")
const dotenv = require("dotenv")
dotenv.config()

const PORT = process.env.PORT || 4000

//database connect
database.connect()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp"
    })
)

//cloudinary connect
cloudinaryConnect()

//routes
app.use("/api/v1/auth", userRoutes)
app.use("/api/v1/profile", profileRoutes)
app.use("/api/v1/course", courseRoutes)
app.use("/api/v1/payment", paymentRoutes)

//default route
app.get("/", (req, res) => {
    return res.json({
        success:true,
        message: "your serve is up and running"
    })
})

app.listen(PORT, () => {
    console.log(`app is running at ${PORT}`)
})
















