import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Organizer } from "../models/organizer.model.js";
import { User } from "../models/user.model.js";

export const verifyJWT = (model) => asyncHandler(async (req, res, next) => {
    try {
        // Extract token from cookies or Authorization header
        const token = req.cookies?.accessToken ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);

        if (!token) {
            console.log("Token not provided");
            throw new ApiError(401, "Unauthorized request: Token not provided");
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch the user
        const user = await model.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Unauthorized request: User not found");
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        throw new ApiError(401, error.message.includes("jwt") ? "Invalid or expired token" : "Unauthorized request");
    }
});

// Usage
export const verifyOrganizerJWT = verifyJWT(Organizer);
export const verifyUserJWT = verifyJWT(User);
