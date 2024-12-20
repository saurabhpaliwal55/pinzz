import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv"
import { User } from "../models/user.model.js";
dotenv.config();

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken;
        if(!token){
            return res.status(401).json({message:"UnAuthorized request"})
        }
        const decodedToken = jwt.decode(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -__v");
    
        if(!user){
            return res.status(402).json({message:"Invalid access Token"})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Errors at verifying token",error);
    }
})