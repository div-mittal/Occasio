import { User } from "../../models/user.model.js";
import { Organizer } from "../../models/organizer.model.js";
import { ApiResponse } from "../ApiResponse.js";
import { ApiError } from "../ApiError.js";


const verifyMail = (model) => async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await model.findById(id);
        if (!user) {
            return res.status(400).json({ message: "Invalid Verification Link" });
        }
        user.verified = true;
        await user.save({ validateBeforeSave: false });
        return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Email verified successfully")
        );
    }
    catch (error) {
        throw new ApiError(500, "Error verifying email");
    }
}

// Usage
export const verifyUserMail = verifyMail(User);
export const verifyOrganizerMail = verifyMail(Organizer);