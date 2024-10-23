import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadFile } from '../utils/uploadOnS3.js';
import { Organizer } from '../models/organizer.model.js';
import { Event } from '../models/event.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { options } from '../constants.js';
import fs from 'fs';

const generateAcessAndRefreshTokens = async (organizerId) => {
    try {
        const organizer = await Organizer.findById(organizerId);
        const accessToken = organizer.generateAccessToken();
        const refreshToken = organizer.generateRefreshToken();
        organizer.refreshToken = refreshToken;
        await organizer.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerOrganizer = asyncHandler(async (req, res) => {
    
    // get the data from the request body
    const { name, email, mobile, password, address } = req.body;

    if( 
        [name, email, mobile, password].some(field => field?.trim() === undefined || field?.trim() === null || field === "" )
    ){
        fs.unlinkSync(req.file?.path);
        throw new ApiError(400, "Please provide all the required fields");
    }

    const existedUser = await Organizer.findOne({
        $or: [{ email }, { mobile }]
    })

    if(existedUser){
        fs.unlinkSync(req.file?.path);
        throw new ApiError(409, "User with this email or mobile already exists");
    }

    const profilePicturePath = req.file?.path;

    if(!profilePicturePath){
        throw new ApiError(400, "Profile picture is required");
    }

    const profilePicture = await uploadFile(profilePicturePath);

    const organizer = await Organizer.create({
        name,
        email,
        mobile,
        profilePicture,
        password,
        address : address || ""
    });
    
    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(organizer._id);
    
    organizer.refreshToken = refreshToken;
    organizer.accessToken = accessToken;
    await organizer.save({ validateBeforeSave: false });

    const createdOrganizer = await Organizer.findById(organizer._id).select(
        "-password -refreshToken"
    )

    if(!createdOrganizer){
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    return res
    .cookie("accessToken", accessToken, {options})
    .cookie("refreshToken", refreshToken, {options})
    .status(201).json(
        new ApiResponse(201, createdOrganizer, "Organizer registered successfully")
    )
});

const loginOrganizer = asyncHandler(async (req, res) => {

    // get organizer details from frontend
    const { email, mobile, password } = req.body;

    // check if email or mobile is provided
    if (!email && !mobile) {
        throw new ApiError(400, "Email or mobile is required");
    }

    // find the organizer with email or mobile
    const organizer = await Organizer.findOne({
        $or: [{ email }, { mobile }]
    });

    // check if organizer exists 
    if (!organizer) {
        throw new ApiError(404, "Organizer not found");
    }

    // check if password is correct
    const isPasswordCorrect = await organizer.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid organizer credentials");
    }

    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(organizer._id);

    // send cookie
    const loggedInOrganizer = await Organizer.findById(organizer._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, { options })
        .cookie("refreshToken", refreshToken, { options })
        .json(
            new ApiResponse(200,
                { organizer: loggedInOrganizer, accessToken, refreshToken },
                "Organizer logged in successfully")
        );
});

const logoutOrganizer = asyncHandler(async (req, res) => {
    await Organizer.findByIdAndUpdate(req.organizer?._id, 
        { 
            $unset: { refreshToken: 1 }
        },
        { new: true }
    );

    return res
    .status(200)
    .clearCookie("accessToken", {options})
    .clearCookie("refreshToken", {options})
    .json(
        new ApiResponse(200, {}, "Organizer logged out successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.headers["x-refresh-token"];

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const organizer = await Organizer.findById(decodedToken._id);

    if(!organizer){
        throw new ApiError(404, "Organizer not found");
    }

    if(incomingRefreshToken !== organizer?.refreshToken){
        throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAcessAndRefreshTokens(organizer._id);

    return res
    .status(200)
    .cookie("accessToken", accessToken, {options})
    .cookie("refreshToken", refreshToken, {options})
    .json(
        new ApiResponse(200, { accessToken, refreshToken }, "Token refreshed successfully")
    )
})

const updateOrganizerPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        throw new ApiError(400, "Old password and new password are required");
    }

    const organizer = await Organizer.findById(req.organizer?._id);
    if(!organizer){
        throw new ApiError(404, "Organizer not found");
    }

    const isPasswordCorrect = await organizer.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid old password");
    }
    
    organizer.password = newPassword;
    await organizer.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password updated successfully")
    )

});

const getCurrentOrganizer = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.organizer, "Current Organizer found successfully")
    )
});

const updateOrganizerDetails = asyncHandler(async (req, res) => {
    const { name, email, mobile, address } = req.body;
    if(!name || !email || !mobile || !address){
        throw new ApiError(400, "Name, Email, Mobile and Address are required");
    }

    const organizer = await Organizer.findByIdAndUpdate(req.organizer?._id, 
        {
            $set: { 
                name, 
                email,
                mobile 
            }
        },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, organizer, "Organizer details updated successfully")
    )
});

const updateProfilePicture = asyncHandler(async (req, res) => {
    const profilePicturePath = req.file?.path;
    if(!profilePicturePath){
        throw new ApiError(400, "Profile picture is required");
    }

    const profilePicture = await uploadFile(profilePicturePath);

    if(!profilePicture){
        throw new ApiError(500, "Something went wrong while uploading the profile picture");
    }

    const organizer = await Organizer.findByIdAndUpdate(req.organizer?._id,
        {
            $set: { profilePicture }
        },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, organizer, "Profile picture updated successfully")
    )
})

export { 
    registerOrganizer, 
    loginOrganizer,
    logoutOrganizer,
    refreshAccessToken,
    updateOrganizerPassword,
    getCurrentOrganizer,
    updateOrganizerDetails,
    updateProfilePicture,
}