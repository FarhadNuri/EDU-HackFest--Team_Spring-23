import mongoose from "mongoose";

const cropHistorySchema = new mongoose.Schema({
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop",
        required: true
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    updateType: {
        type: String,
        required: true,
        enum: ["partial", "complete"]
    },
    soldAmount: {
        type: Number,
        required: true
    },
    remainingAmount: {
        type: Number,
        required: true
    },
    buyerName: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const CropHistory = mongoose.model("CropHistory", cropHistorySchema);

export default CropHistory;
