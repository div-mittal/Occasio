import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        mobile: {
            type: String,
            unique: true,
            trim: true,
            default: null
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

organizerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

organizerSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

organizerSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        mobile: this.mobile,
        name: this.name,
    }, 
    process.env.ACCESS_TOKEN_SECRET, {
        
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

organizerSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, 
    process.env.REFRESH_TOKEN_SECRET, {
        
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
};

export const User = mongoose.model("User", userSchema)