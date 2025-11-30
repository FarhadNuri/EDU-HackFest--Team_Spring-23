import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { connectDB } from "./lib/db.lib.js"
import langRoutes from "./routes/lang.route.js"
import authRoutes from "./routes/auth.route.js"
import profileRoutes from "./routes/profile.route.js"
import { langMiddleware } from "./middlewares/lang.middleware.js"
import cropRoutes from "./routes/crop.route.js"
import exportRoutes from "./routes/export.route.js"
import syncRoutes from "./routes/sync.route.js"
import weatherRoutes from "./routes/weather.route.js"
import predictionRoutes from "./routes/prediction.route.js"
import districtRoutes from "./routes/district.route.js"
import buyerRoutes from "./routes/buyer.route.js"
import riskmapRoutes from "./routes/riskmap.route.js"
import alertRoutes from "./routes/alert.route.js"
import pestRoutes from "./routes/pest.route.js"
import voiceRoutes from "./routes/voice.route.js"


dotenv.config()

const app = express()
const PORT = process.env.PORT

const __dirname = path.resolve()

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cookieParser())
app.use(langMiddleware)
app.use("/api/lang", langRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/profile", profileRoutes)
app.use("/api/crop", cropRoutes)
app.use("/api/export", exportRoutes)
app.use("/api/sync", syncRoutes)
app.use("/api/weather", weatherRoutes)
app.use("/api/prediction", predictionRoutes)
app.use("/api/districts", districtRoutes)
app.use("/api/buyer", buyerRoutes)
app.use("/api/riskmap", riskmapRoutes)
app.use("/api/alerts", alertRoutes)
app.use("/api/pest", pestRoutes)
app.use("/api/voice", voiceRoutes)



if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  })
}

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`)
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log("✓ OpenWeather API Key:", process.env.OPENWEATHER_API_KEY ? "Loaded" : "✗ Missing")
  console.log("✓ Redis URL:", process.env.UPSTASH_REDIS_URL ? "Loaded" : "✗ Missing")
  connectDB()
})