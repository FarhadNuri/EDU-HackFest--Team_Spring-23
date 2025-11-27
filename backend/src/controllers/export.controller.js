import Crop from "../models/crop.model.js";
import User from "../models/auth.model.js";

export async function exportCropsJSON(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const crops = await Crop.find({ farmerId: req.user.userId })
            .select('-__v')
            .lean();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="crops-${Date.now()}.json"`);
        
        return res.status(200).json({
            success: true,
            exportDate: new Date().toISOString(),
            farmerId: req.user.userId,
            totalRecords: crops.length,
            data: crops
        });
    } catch (error) {
        console.error("exportCropsJSON error:", error && error.message ? error.message : error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function exportCropsCSV(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const crops = await Crop.find({ farmerId: req.user.userId })
            .select('-__v')
            .lean();

        if (crops.length === 0) {
            return res.status(404).json({ success: false, message: "No crop data found" });
        }

        // CSV headers
        const headers = ['ID', 'Crop Type', 'Weight (kg)', 'Harvest Date', 'Storage Location', 'Storage Type', 'Registered Date'];
        
        // CSV rows
        const rows = crops.map(crop => [
            crop._id.toString(),
            crop.cropType,
            crop.weight,
            new Date(crop.harvestDate).toLocaleDateString(),
            crop.storageLocation,
            crop.storageType,
            new Date(crop.createdAt).toLocaleDateString()
        ]);

        // Build CSV content
        let csvContent = headers.join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(field => `"${field}"`).join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="crops-${Date.now()}.csv"`);
        
        return res.status(200).send(csvContent);
    } catch (error) {
        console.error("exportCropsCSV error:", error && error.message ? error.message : error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function exportProfileJSON(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId)
            .select('-password -__v')
            .lean();

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const crops = await Crop.find({ farmerId: req.user.userId })
            .select('-__v')
            .lean();

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="profile-${Date.now()}.json"`);
        
        return res.status(200).json({
            success: true,
            exportDate: new Date().toISOString(),
            profile: user,
            crops: crops,
            statistics: {
                totalBatches: crops.length,
                totalWeight: crops.reduce((sum, c) => sum + parseFloat(c.weight || 0), 0)
            }
        });
    } catch (error) {
        console.error("exportProfileJSON error:", error && error.message ? error.message : error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
