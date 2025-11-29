import User from "../models/auth.model.js"
import Crop from "../models/crop.model.js"

export async function searchFarmers(req, res) {
    try {
        const { upazilla, district, cropType } = req.query
        
        let farmerIds = null
        
        // If cropType is specified, first find farmers who have that crop
        if (cropType) {
            const crops = await Crop.find({ cropType: cropType }).distinct('farmerId')
            farmerIds = crops
        }
        
        const query = { userType: 'farmer' }
        
        // If we filtered by crop, only include those farmers
        if (farmerIds !== null) {
            query._id = { $in: farmerIds }
        }
        
        // If upazilla is provided, search in both upazilla and district fields
        if (upazilla) {
            query.$or = [
                { upazilla: { $regex: upazilla, $options: 'i' } },
                { district: { $regex: upazilla, $options: 'i' } }
            ]
        }
        
        if (district) {
            query.district = { $regex: district, $options: 'i' }
        }

        const farmers = await User.find(query)
            .select('-password')
            .lean()

        // Get crop counts for each farmer
        const farmersWithCrops = await Promise.all(
            farmers.map(async (farmer) => {
                const cropCount = await Crop.countDocuments({ farmerId: farmer._id })
                return {
                    ...farmer,
                    cropCount
                }
            })
        )

        res.json({ success: true, farmers: farmersWithCrops })
    } catch (error) {
        console.error("Error searching farmers:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function getFarmerDetails(req, res) {
    try {
        const { farmerId } = req.params

        const farmer = await User.findOne({ _id: farmerId, userType: 'farmer' })
            .select('-password')
            .lean()

        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer not found" })
        }

        const crops = await Crop.find({ farmerId: farmerId }).lean()

        res.json({ 
            success: true, 
            farmer: {
                ...farmer,
                crops
            }
        })
    } catch (error) {
        console.error("Error getting farmer details:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function getBuyerProfile(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "User not logged in" })
        }

        const buyer = await User.findOne({ _id: req.user.userId, userType: 'buyer' })
            .select('-password')
            .lean()

        if (!buyer) {
            return res.status(404).json({ success: false, message: "Buyer not found" })
        }

        res.json({ 
            success: true, 
            buyer: buyer
        })
    } catch (error) {
        console.error("Error getting buyer profile:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
