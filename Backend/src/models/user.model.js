import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        eventHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Event"
            }
        ],
        refreshToken: {
            type: String,
        },  
    },
    {
        timestamps: true
    } 
)

export const User = mongoose.model("User", userSchema)