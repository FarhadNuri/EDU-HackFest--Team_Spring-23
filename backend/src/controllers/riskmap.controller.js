/**
 * Generate mock neighbor farm data for risk map
 * 
 * CURRENT IMPLEMENTATION: Random risk generation for demonstration
 * 
 * REAL IMPLEMENTATION WOULD:
 * 1. Query actual crops from nearby farmers in the same district/upazilla
 * 2. Get their latest prediction data from the ML model
 * 3. Calculate risk based on:
 *    - Temperature deviation from optimal range
 *    - Humidity levels (too high = fungal risk, too low = stress)
 *    - Storage duration (longer = higher risk)
 *    - Historical spoilage patterns
 * 4. Anonymize location (add random offset for privacy)
 * 
 * Example query for real data:
 * const nearbyFarmers = await User.find({
 *   district: req.user.district,
 *   upazilla: req.user.upazilla,
 *   _id: { $ne: req.user._id }
 * }).limit(15)
 * 
 * const crops = await Crop.find({ 
 *   farmerId: { $in: nearbyFarmers.map(f => f._id) } 
 * })
 * 
 * Then use prediction model to calculate risk for each crop
 */
export async function getMockRiskMapData(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        // Use query params or default to Dhaka coordinates
        const latitude = parseFloat(req.query.latitude) || 23.8103
        const longitude = parseFloat(req.query.longitude) || 90.4125
        const district = req.query.district || req.user.district || 'Dhaka'

        // Generate 10-15 mock neighbor farms within district
        const mockNeighbors = generateMockNeighbors(
            latitude, 
            longitude, 
            district,
            12 // number of neighbors
        )

        res.json({
            success: true,
            data: {
                userLocation: {
                    lat: latitude,
                    lng: longitude,
                    name: district
                },
                neighborFarms: mockNeighbors
            }
        })
    } catch (error) {
        console.error("Error generating risk map data:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

/**
 * Generate mock neighbor data points
 * 
 * MOCK RISK CALCULATION:
 * Currently using random assignment for demonstration
 * 
 * REAL RISK CALCULATION LOGIC:
 * Risk Level = f(temperature, humidity, storage_duration, crop_type)
 * 
 * Example calculation:
 * - Low Risk: Optimal conditions (temp 15-20°C, humidity 60-70%, fresh crop)
 * - Medium Risk: Slight deviation (temp 20-25°C or 10-15°C, humidity 50-60% or 70-80%)
 * - High Risk: Poor conditions (temp >25°C or <10°C, humidity >80% or <50%, old crop)
 * 
 * Additional factors:
 * - Crop type sensitivity (rice vs potato have different thresholds)
 * - Weather patterns (monsoon season = higher fungal risk)
 * - Storage type (warehouse vs open storage)
 */
function generateMockNeighbors(centerLat, centerLng, district, count) {
    const neighbors = []
    const cropTypes = ['ধান', 'আলু', 'গম', 'ভুট্টা', 'সবজি']
    const riskLevels = ['low', 'medium', 'high']

    for (let i = 0; i < count; i++) {
        // Generate random offset within ~10km radius
        const latOffset = (Math.random() - 0.5) * 0.1 // ~11km
        const lngOffset = (Math.random() - 0.5) * 0.1

        // MOCK: Random risk assignment
        // REAL: Would calculate based on actual sensor data and ML predictions
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]
        const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)]
        
        // Calculate distance from center
        const distance = Math.sqrt(latOffset * latOffset + lngOffset * lngOffset) * 111 // rough km conversion
        const distanceText = `${distance.toFixed(1)} কিমি`

        neighbors.push({
            id: `neighbor-${i}`,
            lat: centerLat + latOffset,
            lng: centerLng + lngOffset,
            riskLevel: riskLevel,
            cropType: cropType,
            distance: distanceText
        })
    }

    return neighbors
}


