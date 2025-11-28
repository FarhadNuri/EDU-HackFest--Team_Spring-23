import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./lib/db.lib.js"
import langRoutes from "./routes/lang.route.js"
import authRoutes from "./routes/auth.route.js"
import profileRoutes from  "./routes/profile.route.js"
import { langMiddleware } from "./middlewares/lang.middleware.js"
import cropRoutes from "./routes/crop.route.js"
import exportRoutes from "./routes/export.route.js"
import syncRoutes from "./routes/sync.route.js"
import weatherRoutes from "./routes/weather.route.js"
import predictionRoutes from "./routes/prediction.route.js"
import districtRoutes from "./routes/district.route.js"
dotenv.config()

const app = express()

// CORS configuration - allow frontend to access backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(cookieParser())
app.use(langMiddleware)
app.use("/api/lang",langRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/profile",profileRoutes)
app.use("/api/crop",cropRoutes)
app.use("/api/export",exportRoutes)
app.use("/api/sync",syncRoutes)
app.use("/api/weather",weatherRoutes)
app.use("/api/prediction",predictionRoutes)
app.use("/api/districts",districtRoutes)

app.listen(5000,()=> {
    console.log("✓ Server running on 5000")
    console.log("✓ OpenWeather API Key:", process.env.OPENWEATHER_API_KEY ? "Loaded" : "✗ Missing")
    connectDB()
})