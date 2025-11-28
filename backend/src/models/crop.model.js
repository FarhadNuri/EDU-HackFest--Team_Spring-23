import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
    cropType:{
        type:String,
        required:true,
        enum: ["Paddy", "Rice", "Wheat", "Corn", "Potato", "Vegetables", "Fruits"]
    },
    variety: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required:true
    },
    harvestDate: {
        type:Date,
        required:true
    },
    storageLocation: {
        type:String,
        required:true
    },
    storageType: {
        type:String,
        required:true,
        enum: ["Jute Bag Stack", "Silo", "Open Area", "Warehouse", "Cold Storage", "Home Storage"]
    },
    expectedStorageDuration: {
        type: Number,
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps:true})

const Crop = mongoose.model("Crop",cropSchema)

export default Crop