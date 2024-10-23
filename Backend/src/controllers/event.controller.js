import { Event } from "../models/event.model.js"
import { Organizer } from "../models/organizer.model.js"
import { Image } from "../models/image.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import fs from "fs"


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
        folderName: req.user?.folderName + "/" + title,
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
        folderName: req.user?.folderName + "/" + title,
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
                folderName: req.user?.folderName + "/" + title,
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

export { 
    createEvent 
}