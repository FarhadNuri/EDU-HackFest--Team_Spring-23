import User from "../models/user.model.js"
import Crop from "../models/crop.model.js"
import { predictCropRisk } from "../lib/prediction.lib.js"

/**
 * REAL IMPLEMENTATION: Get actual neighbor farm risk data
 * 
 * This function queries real crops from nearby farmers and calculates
 * actual risk levels based on ML predictions
 */
export async function getRealRiskMapData(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        const userDistrict = req.user.district
        const userUpazilla = req.user.upazilla
        
        // Get user's coordinates (you'd need to add these fields to user model)
        const userLat = req.user.latitude || 23.8103
        const userLng = req.user.longitude || 90.4125

        // Find nearby farmers in same district/upazilla
        const nearbyFarmers = await User.find({
            district: userDistrict,
            upazilla: userUpazilla,
            _id: { $ne: req.user._id }, // Exclude current user
            userType: 'farmer'
        }).limit(20)

        if (nearbyFarmers.length === 0) {
            // No nearby farmers, return empty data
            return res.json({
                success: true,
                data: {
                    userLocation: {
                        lat: userLat,
                        lng: userLng,
                        name: userDistrict
                    },
                    neighborFarms: []
                }
            })
        }

        // Get crops from nearby farmers
        const crops = await Crop.find({
            farmerId: { $in: nearbyFarmers.map(f => f._id) }
        }).populate('farmerId', 'latitude longitude')

        // Calculate risk for each crop and anonymize location
        const neighborFarms = []
        
        for (const crop of crops) {
            try {
                // Get ML prediction for this crop
                const prediction = await predictCropRisk(crop)
                
                // Map prediction risk level to our format
                const riskLevel = mapRiskLevel(prediction.riskLevel)
                
                // Anonymize location: add random offset (±2km)
                const latOffset = (Math.random() - 0.5) * 0.02
                const lngOffset = (Math.random() - 0.5) * 0.02
                
                const farmerLat = crop.farmerId?.latitude || userLat
                const farmerLng = crop.farmerId?.longitude || userLng
                
                // Calculate distance from user
                const distance = calculateDistance(
                    userLat, userLng,
                    farmerLat, farmerLng
                )
                
                neighborFarms.push({
                    id: crop._id.toString(),
                    lat: farmerLat + latOffset,
                    lng: farmerLng + lngOffset,
                    riskLevel: riskLevel,
                    cropType: crop.cropType,
                    distance: `${distance.toFixed(1)} কিমি`
                })
            } catch (error) {
                console.error(`Error processing crop ${crop._id}:`, error)
                // Skip this crop if prediction fails
            }
        }

        res.json({
            success: true,
            data: {
                userLocation: {
                    lat: userLat,
                    lng: userLng,
                    name: userDistrict
                },
                neighborFarms: neighborFarms
            }
        })
    } catch (error) {
        console.error("Error generating risk map data:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

/**
 * Map ML prediction risk level to map risk level
 */
function mapRiskLevel(predictionRisk) {
    // Your ML model returns: Critical, High, Medium, Low
    // Map to: high, medium, low
    switch (predictionRisk) {
        case 'Critical':
        case 'High':
            return 'high'
        case 'Medium':
            return 'medium'
        case 'Low':
        default:
            return 'low'
    }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

function toRad(degrees) {
    return degrees * (Math.PI / 180)
}
