import { getAllDistricts } from "../lib/districts.lib.js"

export async function searchDistricts(req, res) {
    try {
        const { query } = req.query
        
        if (!query || query.length < 1) {
            return res.json({ success: true, districts: [] })
        }

        const allDistricts = getAllDistricts()
        const searchTerm = query.toLowerCase()

        // Filter districts that match the search term (English or Bangla)
        const filteredDistricts = allDistricts
            .filter(district => 
                district.nameEn.toLowerCase().includes(searchTerm) || 
                district.nameBn.includes(query)
            )
            .slice(0, 10) // Limit to 10 suggestions
            .map(district => ({
                nameEn: district.nameEn,
                nameBn: district.nameBn
            }))

        res.json({ success: true, districts: filteredDistricts })
    } catch (error) {
        console.error("Error searching districts:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export async function getAllDistrictsAPI(req, res) {
    try {
        const districts = getAllDistricts()
        res.json({ success: true, districts })
    } catch (error) {
        console.error("Error getting districts:", error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}
