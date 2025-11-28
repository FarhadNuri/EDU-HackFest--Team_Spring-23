import User from "../models/auth.model.js"
import bcrypt from "bcryptjs"
import { redis } from "../lib/redis.lib.js";
import jwt from "jsonwebtoken";
import {generateToken,storeRefreshToken, setAuthCookies } from "../middlewares/auth.middleware.js";
import { getDistrictByName } from "../lib/districts.lib.js";


export async function signUp(req,res) {

    const{email,password,fullname,mobile,district} = req.body

    if(!email || !password || !fullname || !mobile || !district) {
        return res.status(400).json({success:false,message: "Provide all fields including district"})
    }

    try {
        if(password.length<6) {
            return res.status(400).json({success:false, message:"Password length should be atleast 6"})
        }

        if(mobile.length<11) {
            return res.status(400).json({success:false, message:"Enter valid mobile number"})
        }

        const existingUser = await User.findOne({
            $or: [{email}, {mobile}]
        });


        if(existingUser) {
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const districtData = getDistrictByName(district);
        if(!districtData) {
            return res.status(400).json({success:false, message: "Invalid district name"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname: fullname,
            email: email,
            mobile: mobile,
            password: hashedPassword,
            district: districtData.nameEn,
            latitude: districtData.latitude,
            longitude: districtData.longitude
        })

        if(newUser) {
            await newUser.save()
            res.status(201).json({user: {
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                district:newUser.district,
                latitude:newUser.latitude,
                longitude:newUser.longitude
            },message:"User created successfully"
            })

        const {accessToken,refreshToken}= generateToken(newUser._id)
        await storeRefreshToken(newUser._id,refreshToken)
        setAuthCookies(res,accessToken,refreshToken)

        } else {
            return res.status(400).json({success:false, message: "Invalid credentials"})
        }

    } catch (error) {
        res.status(500).json({success:false,message: "internal server error"})
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

        const {accessToken, refreshToken} = generateToken(currUser._id)
        await storeRefreshToken(currUser._id,refreshToken)
        setAuthCookies(res,accessToken,refreshToken)

        return res.status(200).json({user: {
            _id: currUser._id,
            fullname:currUser.fullname,
            email: currUser.email,
            district: currUser.district,
            latitude: currUser.latitude,
            longitude: currUser.longitude
        },message: "login successfull"
        })

    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export async function logOut(req,res) {
    try {
        const refreshToken= req.cookies.refreshToken
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}

export async function refreshToken(req,res) {
    try {
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken) {
            return res.status(401).json({message: "No token found"})
        }

        const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

        if(storedToken !== refreshToken) {
            return res.status(401).json({message: "Invalid token"})
        }
        const accessToken = jwt.sign(
            {userId:decoded.userId},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: "15m"})

        res.cookie("accessToken",accessToken, {
            httpOnly:true, //prevents XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite:  "strict", //prevents CSRF attacks
            maxAge: 15*60*1000
        })
        res.json({message: "Token refreshed successfully"})
    } catch(error) {
        console.log("Error in refresh token controller ", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}