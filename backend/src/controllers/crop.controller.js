import Crop from "../models/crop.model.js";

export async function cropBatchRegister(req,res) {
    try {
         if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }
        
        const {cropType,weight,harvestDate,storageLocation,storageType}=req.body


        if(!cropType || !weight || !harvestDate || !storageLocation || !storageType) {
            return res.status(400).json({success: false, message: "Please provide all fields"})
        }
        const newCrop = new Crop({
            cropType:cropType,
            weight:weight,
            harvestDate:harvestDate,
            storageLocation:storageLocation,
            storageType:storageType,
            farmerId: req.user.userId
        })
        if(newCrop) {
            await newCrop.save()
            res.status(201).json({success: true, crop: {
                _id:newCrop._id,
                cropType:newCrop.cropType,
                weight:newCrop.weight,
                harvestDate:newCrop.harvestDate,
                storageLocation:newCrop.storageLocation,
                storageType:newCrop.storageType,
                farmerId:newCrop.farmerId
            },message:"Crop batch registered successfully"
            })
        }
    } catch(error) {
        console.error("cropBatchRegister error:", error && error.message ? error.message : error);
        res.status(500).json({success:false,message: "Internal server error"})
    }
}