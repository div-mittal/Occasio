import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { options } from "../constants.js"
import jwt from 'jsonwebtoken';

// compare this snippet from Backend/src/controllers/organizer.controller.js:

const generateAcessAndRefreshTokens = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


const registerUser = asyncHandler(async (req, res, next) => {
    const { email, name, mobile, password } = req.body;

    if(
        [name, email, password].some(field => field?.trim() === undefined || field?.trim() === null || field === "" )
    ){
        throw new ApiError(400, "Please provide all the required fields");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { mobile }]
    })

    if(existedUser){
        throw new ApiError(409, "User with this email or mobile already exists");
    }

    const user = await User.create({ 
        email, 
        name, 
        mobile, 
        password 
    });

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id);

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;

    await user.save({ validateBeforeSave: false });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }

    return res
    .cookie("accessToken", accessToken, { options })
    .cookie("refreshToken", refreshToken, { options })
    .status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );
})


const loginUser = asyncHandler(async (req, res, next) => {
    const { email, mobile, password } = req.body;

    if((!email && !mobile) || !password){
        throw new ApiError(400, "Please provide email/mobile and password");
    }

    const user = await User.findOne({
        $or: [{ email }, { mobile }]
    }); 

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid email/mobile or password");
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if(!loggedInUser){
        throw new ApiError(500, "Failed to login user");
    }

    return res
    .cookie("accessToken", accessToken, { options })
    .cookie("refreshToken", refreshToken, { options })
    .status(200).json(
        new ApiResponse(200, loggedInUser, "User logged in successfully")
    );
})

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user?._id, 
        { 
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );


    return res
    .clearCookie("accessToken", { options })
    .clearCookie("refreshToken", { options })
    .status(200).json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
})

const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers["x-refresh-token"];

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(incomingRefreshToken !== user.refreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
    .cookie("accessToken", accessToken, { options })
    .cookie("refreshToken", refreshToken, { options })
    .status(200).json(
        new ApiResponse(200, { accessToken }, "Access token refreshed successfully")
    );
})

const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400, "Please provide old password and new password");
    }

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
    .status(200).json(
        new ApiResponse(200, {}, "Password updated successfully")
    );
})

const updateUserDetails = asyncHandler(async (req, res, next) => {
    const { name, email, mobile } = req.body;

    if(
        [name, email, mobile].some(field => field?.trim() === undefined || field?.trim() === null || field === "" )
    ){
        throw new ApiError(400, "Please provide all the required fields");
    }

    const user = await User.findByIdAndUpdate(req.user._id, 
        {
            $set: { 
                name, 
                email,
                mobile
            }
        },
        { new: true }
    );

    if(!user){
        throw new ApiError(500, "Failed to update user details");
    }

    return res
    .status(200).json(
        new ApiResponse(200, user, "User details updated successfully")
    );
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    updateUserPassword,
    updateUserDetails
}