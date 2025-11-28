import Crop from "../models/crop.model.js";

export async function cropBatchRegister(req,res) {
    try {
         if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }
        
        const {cropType, variety, weight, harvestDate, storageLocation, storageType, expectedStorageDuration}=req.body


        if(!cropType || !weight || !harvestDate || !storageLocation || !storageType || !expectedStorageDuration) {
            return res.status(400).json({success: false, message: "Please provide all required fields"})
        }
        const newCrop = new Crop({
            cropType:cropType,
            variety: variety || undefined,
            weight:weight,
            harvestDate:harvestDate,
            storageLocation:storageLocation,
            storageType:storageType,
            expectedStorageDuration: expectedStorageDuration,
            farmerId: req.user.userId
        })
        if(newCrop) {
            await newCrop.save()
            res.status(201).json({success: true, crop: {
                _id:newCrop._id,
                cropType:newCrop.cropType,
                variety:newCrop.variety,
                weight:newCrop.weight,
                harvestDate:newCrop.harvestDate,
                storageLocation:newCrop.storageLocation,
                storageType:newCrop.storageType,
                expectedStorageDuration:newCrop.expectedStorageDuration,
                farmerId:newCrop.farmerId
            },message:"Crop batch registered successfully"
            })
        }
    } catch(error) {
        console.error("cropBatchRegister error:", error && error.message ? error.message : error);
        res.status(500).json({success:false,message: "Internal server error"})
    }
}

export async function getCropCount(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        const count = await Crop.countDocuments({ farmerId: req.user.userId });
        
        res.status(200).json({
            success: true, 
            count: count,
            message: "Crop count retrieved successfully"
        });
    } catch(error) {
        console.error("getCropCount error:", error && error.message ? error.message : error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function getAllCrops(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        const crops = await Crop.find({ farmerId: req.user.userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true, 
            crops: crops,
            message: "Crops retrieved successfully"
        });
    } catch(error) {
        console.error("getAllCrops error:", error && error.message ? error.message : error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function getCropById(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        const { id } = req.params;
        const crop = await Crop.findOne({ _id: id, farmerId: req.user.userId });
        
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }
        
        res.status(200).json({
            success: true, 
            crop: crop,
            message: "Crop retrieved successfully"
        });
    } catch(error) {
        console.error("getCropById error:", error && error.message ? error.message : error);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}