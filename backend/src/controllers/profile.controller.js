import User from "../models/auth.model.js"
import mongoose from "mongoose"

export async function getProfileData (req,res) {
    const {id} = req.params
        if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success:false,message:"User not found"})
    }
    try {
        const user = await User.findById(id)
        res.status(200).json({success:true, user: {
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                mobile:user.mobile,
                language:user.language
        },message: "Profile data fetched successfully"})
    } catch (error) {
        res.status(500).json({success:false, message: "Internal server error"})
        console.log(error.message)
    }
}