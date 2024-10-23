import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Organizer } from "../models/organizer.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization").replace("Bearer ", "");
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const organizer = await Organizer.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!organizer) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.organizer = organizer;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token");
    }
});