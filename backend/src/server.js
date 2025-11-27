import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.lib.js"
import langRoutes from "./routes/lang.route.js"
import authRoutes from "./routes/auth.route.js"
import profileRoutes from  "./routes/profile.route.js"
import { langMiddleware } from "./middlewares/lang.middleware.js"
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(langMiddleware)
app.use("/api/lang",langRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)

app.listen(5000,()=> {
    console.log("Server running on 5000")
    connectDB()
})