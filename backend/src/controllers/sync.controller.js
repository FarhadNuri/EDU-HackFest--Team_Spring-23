import Crop from "../models/crop.model.js";
import User from "../models/auth.model.js";

export async function syncOfflineData(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { crops, profileUpdates } = req.body;
        const results = { success: [], failed: [] };

        if (crops && Array.isArray(crops)) {
            for (const cropData of crops) {
                try {
                    const { localId, ...cropFields } = cropData;
                    
                    const newCrop = new Crop({
                        ...cropFields,
                        farmerId: req.user.userId
                    });
                    
                    await newCrop.save();
                    
                    results.success.push({ 
                        type: 'crop', 
                        localId: localId,
                        serverId: newCrop._id 
                    });
                } catch (error) {
                    results.failed.push({ 
                        type: 'crop', 
                        data: cropData, 
                        error: error.message 
                    });
                }
            }
        }

        // Sync profile updates
        if (profileUpdates) {
            try {
                const allowedUpdates = {};
                if (profileUpdates.fullname) allowedUpdates.fullname = profileUpdates.fullname;
                if (profileUpdates.language) allowedUpdates.language = profileUpdates.language;
                
                if (Object.keys(allowedUpdates).length > 0) {
                    await User.findByIdAndUpdate(req.user.userId, allowedUpdates);
                    results.success.push({ type: 'profile', fields: Object.keys(allowedUpdates) });
                }
            } catch (error) {
                results.failed.push({ 
                    type: 'profile', 
                    data: profileUpdates, 
                    error: error.message 
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "Sync completed",
            synced: results.success.length,
            failed: results.failed.length,
            results
        });
    } catch (error) {
        console.error("syncOfflineData error:", error && error.message ? error.message : error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
