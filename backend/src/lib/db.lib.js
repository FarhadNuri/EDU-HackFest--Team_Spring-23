import mongoose from "mongoose";

export async function connectDB() {
    try {
        const cnct = await mongoose.connect(process.env.MONGO_URL)
        console.log(`✓ MongoDB connected: ${cnct.connection.host}`)
    } catch(error) {
        console.log("Connection to database failed", error.message)
    }
}