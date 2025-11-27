import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.lib.js";

export const generateToken = (userId) => {
    const accessToken = jwt.sign(
        { userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};


export const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(
        `refresh_token:${userId}`,
        refreshToken,
        "EX",7 * 24 * 60 * 60
    );
};


export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};

export const protectRoute = async (req, res, next) => {
    try {
        let accessToken = null;
        if (req && req.cookies && req.cookies.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        if (!accessToken) {
            return res.status(401).json({ success: false, message: "User not logged in - no token provided" });
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = { userId: decoded.userId };
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Access token expired" });
            }
            return res.status(401).json({ success: false, message: "Invalid access token" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
