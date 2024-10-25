import { Event } from "../models/event.model.js"
import { Organizer } from "../models/organizer.model.js"
import { Image } from "../models/image.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from "fs"
import mongoose from "mongoose"


const createEvent = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user?.id)
    if (!organizer) {
        throw new ApiError(404, "Organizer not found")
    }
    
    const { title, description, date, time, location, type, capacity, genre } = req.body

    if(
        [title, description, date, time, location, type, capacity, genre].some((field) => field === undefined || field === "")
    ){
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if(req.files?.gallery){
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path
                )
            })
        }
        throw new ApiError(400, "All fields are required")
    }

    const imagePath = req.files?.image[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path

    const image = await Image.create({
        title : title + " Image",
        folderName: req.user?.folderName,
        url: imagePath
    })

    if(!image){
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if(req.files?.gallery){
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path
                )
            })
        }
        throw new ApiError(500, "Image upload failed")
    }

    const coverImage = await Image.create({
        title: title + " Cover Image",
        folderName: req.user?.folderName,
        url: coverImagePath
    })

    if(!coverImage){
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if(req.files?.gallery){
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path
                )
            })
        }
        throw new ApiError(500, "Cover Image upload failed")
    }
    
    const event = await Event.create({
        title,
        description,
        date,
        time,
        location,
        type,
        capacity,
        genre,
        image : image._id,
        coverImage : coverImage._id,
        createdBy: organizer
    })

    if(!event){
        if(req.files?.gallery){
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path
                )
            })
        }
        throw new ApiError(500, "Event creation failed")
    }
    
    const galleryImages = req.files?.gallery
    if (galleryImages) {
        const galleryImagePromises = galleryImages.map(async (file, index) => {
            const galleryImage = await Image.create({
                title: title + " Gallery Image " + index,
                folderName: req.user?.folderName,
                url: file.path
            })
            if (!galleryImage) {
                throw new ApiError(500, "Gallery Image upload failed")
            }
            return galleryImage._id
        })

        event.gallery = await Promise.all(galleryImagePromises)
        await event.save({ validateBeforeSave: false })
    }

    organizer.createdEvents.push(event)

    await organizer.save({ validateBeforeSave: false })

    return res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"))
})

const updateEvent = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user?.id)
    if (!organizer) {
        throw new ApiError(404, "Organizer not found")
    }

    const { eventid } = req.params
    const event = await Event.findById(eventid)
    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    if (event.createdBy.toString() !== organizer._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }

    const { title, description, date, time, location, type, capacity, genre } = req.body

    if(
        [title, description, date, time, location, type, capacity, genre].some((field) => field === undefined || field === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    console.log(req.files)

    const imagePath = req.files?.image[0]?.path
    console.log(imagePath)
    let image;
    if (imagePath) {
        // Delete old image
        await Image.findByIdAndDelete(event.image);
        image = await Image.create({
            title: title + " Image",
            folderName: req.user?.folderName,
            url: imagePath
        });
    } else {
        image = event.image;
    }

    const coverImagePath = req.file?.coverImage[0]?.path
    let coverImage;
    if (coverImagePath) {
        // Delete old cover image
        await Image.findByIdAndDelete(event.coverImage);
        coverImage = await Image.create({
            title: title + " Cover Image",
            folderName: req.user?.folderName,
            url: coverImagePath
        });
    } else {
        coverImage = event.coverImage;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventid,
        {
            title,
            description,
            date,
            time,
            location,
            type,
            image,
            coverImage,
            capacity,
            genre
        },
        { new: true }
    )

    if(!updatedEvent){
        throw new ApiError(500, "Event update failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Event updated successfully"))
})

const removeImagesFromGallery = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user?.id)
    if (!organizer) {
        throw new ApiError(404, "Organizer not found")
    }

    const { eventid } = req.params
    const event = await Event.findById(eventid)
    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    if (event.createdBy.toString() !== organizer._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }

    const galleryImages = req.body.galleryImages

    if(!galleryImages){
        throw new ApiError(400, "Gallery images are required")
    }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventid,
        { 
            $pull: { 
                gallery: { 
                    $in: galleryImages 
                } 
            } 
        },
        { new: true }
    )

    if(!updatedEvent){
        throw new ApiError(500, "Gallery images removal failed")
    }

    galleryImages.forEach(async (imageId) => {
        await Image.findByIdAndDelete(imageId)
    })

    return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Gallery images removed successfully"))
})

const addImagesToGallery = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user?.id)
    if (!organizer) {
        throw new ApiError(404, "Organizer not found")
    }

    const { eventid } = req.params
    const event = await Event.findById(eventid)
    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    if (event.createdBy.toString() !== organizer._id.toString()) {
        throw new ApiError(401, "Unauthorized")
    }

    const galleryImages = req.files?.galleryImages
    if (!galleryImages) {
        throw new ApiError(400, "Gallery images are required")
    }

    const galleryImagePromises = galleryImages.map(async (file, index) => {
        const galleryImage = await Image.create({
            title: event.title + " Gallery Image " + index,
            folderName: req.user?.folderName,
            url: file.path
        })
        if (!galleryImage) {
            throw new ApiError(500, "Gallery Image upload failed")
        }
        return galleryImage._id
    })

    const updatedEvent = await Event.findByIdAndUpdate(
        eventid,
        { 
            $push: { 
                gallery: { 
                    $each: await Promise.all(galleryImagePromises) 
                } 
            } 
        },
        { new: true }
    )

    if(!updatedEvent){
        throw new ApiError(500, "Gallery images addition failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Gallery images added successfully"))
})

const getEventInfo = asyncHandler(async (req, res) => {
    const { eventid } = req.params
    console.log(eventid)
    const eventData = await Event.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(eventid) }
        },
        {
            $lookup: {
                from: "images",
                localField: "image",
                foreignField: "_id",
                as: "image",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            folderName: 0,
                            createdAt: 0,
                            updatedAt: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$image"
        },
        {
            $lookup: {
                from: "images",
                localField: "coverImage",
                foreignField: "_id",
                as: "coverImage",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            folderName: 0,
                            createdAt: 0,
                            updatedAt: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$coverImage"
        },
        {
            $lookup: {
                from: "images",
                localField: "gallery",
                foreignField: "_id",
                as: "gallery",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            folderName: 0,
                            createdAt: 0,
                            updatedAt: 0
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "organizers",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy",
                pipeline: [
                    {
                        $lookup: {
                            from: "images",
                            localField: "profilePicture",
                            foreignField: "_id",
                            as: "profilePicture",
                            pipeline: [
                                {
                                    $project: {
                                        _id: 0,
                                        __v: 0,
                                        folderName: 0,
                                        createdAt: 0,
                                        updatedAt: 0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: "$profilePicture"
                    },
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            password: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            folderName: 0,
                            createdEvents: 0,
                            refreshToken: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$createdBy"
        },
        {
            $project: {
                __v: 0
            }
        }
    ])

    if(eventData.length === 0){
        throw new ApiError(404, "Event not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, eventData[0], "Event data retrieved successfully"))
})

export { 
    createEvent,
    updateEvent,
    removeImagesFromGallery,
    addImagesToGallery,
    getEventInfo
}