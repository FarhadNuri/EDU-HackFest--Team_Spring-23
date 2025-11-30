import Crop from "../models/crop.model.js";
import CropHistory from "../models/cropHistory.model.js";

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
            initialWeight: weight,
            status: "active",
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

export async function updateCropStatus(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        const { id } = req.params;
        const { updateType, soldAmount, buyerName, notes, timestamp } = req.body;

        // Validate required fields
        if (!updateType || !soldAmount) {
            return res.status(400).json({ 
                success: false, 
                message: "Update type and sold amount are required" 
            });
        }

        // Find the crop
        const crop = await Crop.findOne({ _id: id, farmerId: req.user.userId });
        
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }

        // Parse current weight
        const currentWeight = parseFloat(crop.weight);
        const soldAmountNum = parseFloat(soldAmount);

        // Validate sold amount
        if (soldAmountNum <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Sold amount must be greater than 0" 
            });
        }

        if (soldAmountNum > currentWeight) {
            return res.status(400).json({ 
                success: false, 
                message: "Sold amount cannot exceed current stock" 
            });
        }

        // Calculate new weight
        const newWeight = currentWeight - soldAmountNum;
        
        // Store initial weight if not set
        if (!crop.initialWeight) {
            crop.initialWeight = crop.weight;
        }

        // Update crop weight
        crop.weight = newWeight.toString();
        
        // Mark as sold if weight is 0 or complete sale
        if (newWeight === 0 || updateType === 'complete') {
            crop.status = 'sold';
            crop.weight = '0';
        }

        await crop.save();

        // Create history record
        const historyEntry = new CropHistory({
            cropId: crop._id,
            farmerId: req.user.userId,
            updateType: updateType,
            soldAmount: soldAmountNum,
            remainingAmount: parseFloat(crop.weight),
            buyerName: buyerName || undefined,
            notes: notes || undefined,
            timestamp: timestamp || new Date()
        });

        await historyEntry.save();

        res.status(200).json({
            success: true,
            crop: crop,
            history: historyEntry,
            message: updateType === 'complete' 
                ? "Crop marked as completely sold" 
                : "Crop status updated successfully"
        });

    } catch(error) {
        console.error("updateCropStatus error:", error && error.message ? error.message : error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getCropHistory(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        const { id } = req.params;

        // Verify crop belongs to user
        const crop = await Crop.findOne({ _id: id, farmerId: req.user.userId });
        
        if (!crop) {
            return res.status(404).json({ success: false, message: "Crop not found" });
        }

        // Get all history entries for this crop
        const history = await CropHistory.find({ cropId: id })
            .sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            history: history,
            crop: {
                cropType: crop.cropType,
                initialWeight: crop.initialWeight || crop.weight,
                currentWeight: crop.weight,
                status: crop.status
            },
            message: "Crop history retrieved successfully"
        });

    } catch(error) {
        console.error("getCropHistory error:", error && error.message ? error.message : error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function getAllSales(req, res) {
    try {
        if(!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" });
        }

        // Get all sales history for the user, populate crop details
        const sales = await CropHistory.find({ farmerId: req.user.userId })
            .populate('cropId', 'cropType variety storageType')
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 sales

        // Calculate total sales amount and revenue
        const totalSold = sales.reduce((sum, sale) => sum + sale.soldAmount, 0);
        const salesCount = sales.length;

        res.status(200).json({
            success: true,
            sales: sales,
            summary: {
                totalSold: totalSold,
                salesCount: salesCount
            },
            message: "Sales history retrieved successfully"
        });

    } catch(error) {
        console.error("getAllSales error:", error && error.message ? error.message : error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
