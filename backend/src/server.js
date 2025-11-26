import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./lib/db.lib.js"
import authRoutes from "./routes/auth.route.js"
dotenv.config()

const app = express()

app.use("/api/auth",authRoutes)

app.listen(5000,()=> {
    console.log("Server running on 5000")
    connectDB()
})