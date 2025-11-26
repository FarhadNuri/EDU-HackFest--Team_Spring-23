import User from "../models/auth.model.js"
import bcrypt from "bcryptjs"

export async function signUp(req,res) {

    const{email,password,fullname,mobile} = req.body

    if(!email || !password || !fullname || !mobile) {
        return res.status(400).json({success:false,message: "Provide all fields"})
    }

    try {
        if(password.length<6) {
            return res.status(400).json({success:false, message:"Password length should be atleast 6"})
        }

        if(mobile.length<=11) {
            return res.status(400).json({success:false, message:"Enter valid mobile number"})
        }

        const existingUser = await User.findOne({
            $or: [{email}, {mobile}]
        });


        if(existingUser) {
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedPassword
        })

        if(newUser) {
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email
            })
        } else {
            res.status(400).json({success:false, message: "Invalid credentials"})
        }

    } catch (error) {
        res.status(500).json({success:false,messag: "internal server error"})
    }
}

export async function logIn(req,res) {

    const {email,password} = req.body

    if(!email || !password) {
        return res.status(400).json({success:false,message:"Provide all fields"})
    }

    try {
        const currUser = await User.findOne({email})
        if(!currUser) {
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        const correctPassword = await bcrypt.compare(password,currUser.password)

        if(!correctPassword) {
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        res.status(200).json({
            _id: currUser._id,
            fullname:currUser.fullname,
            email: currUser.email,
            profilePic: currUser.profilePic,
            message: "login successfull"
        })

    } catch (error) {
        res.status(500).json({success:false,message:"internal server error"})
    }
}

export async function logOut(req,res) {
    try {
        res.status(200).json({success:true,message:"Logged out successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}