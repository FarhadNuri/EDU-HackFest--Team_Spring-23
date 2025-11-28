import User from "../models/auth.model.js"
import mongoose from "mongoose"

export async function getProfileData (req,res) {
    const {id} = req.params
        if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false,message:"User not found"})
    }
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({success:false, message: "User not found"})
        }
        res.status(200).json({success:true, user: {
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                mobile:user.mobile,
                district:user.district,
                language:user.language
        },message: "Profile data fetched successfully"})
    } catch (error) {
        res.status(500).json({success:false, message: "Internal server error"})
        console.log(error.message)
    }
}

export async function updateProfileData (req,res) {
    const {id} = req.params
    const {fullname, mobile, district, language} = req.body
    
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false,message:"User not found"})
    }
    
    try {
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({success:false, message: "User not found"})
        }

        // Update only provided fields
        if (fullname) user.fullname = fullname
        if (mobile) user.mobile = mobile
        if (district) user.district = district
        if (language) user.language = language

        await user.save()

        res.status(200).json({
            success:true, 
            user: {
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                mobile:user.mobile,
                district:user.district,
                language:user.language
            },
            message: "Profile updated successfully"
        })
    } catch (error) {
        res.status(500).json({success:false, message: "Internal server error"})
        console.log(error.message)
    }
}