import { Event } from "../models/event.model.js"
import { Organizer } from "../models/organizer.model.js"
import { User } from "../models/user.model.js"
import { Participant } from "../models/participant.model.js"
import { Image } from "../models/image.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendMail } from "../utils/mailingUtils/mailSender.js"
import fs from "fs"
import mongoose from "mongoose"
import schedule from "node-schedule"

const scheduleEventReminder = async (event) => {
    const reminderTime = new Date(event.date)
    reminderTime.setMinutes(reminderTime.getMinutes() - 30)

    schedule.scheduleJob(reminderTime, async () => {
        const participants = await Participant.find({ event: event._id });
        if (participants.length > 0) {
            const participantEmails = await Promise.all(participants.map(async participant => {
                const user = await User.findById(participant.user);
                return user.email;
            }));
            const mailOptions = {
                to: participantEmails,
                subject: `Reminder: ${event.title} is starting soon!`,
                text: `Dear Participant,\n\nThis is a reminder that the event "${event.title}" is starting in 30 minutes.\n\nLocation: ${event.location}\nDate: ${event.date}\nTime: ${event.time}\n\nWe look forward to seeing you there!\n\nBest regards,\n${event.createdBy.name}`
            }

            await sendMail(mailOptions)
        }
    })
}

const createEvent = asyncHandler(async (req, res) => {
    const organizer = await Organizer.findById(req.user?.id)
    if (!organizer) {
        throw new ApiError(404, "Organizer not found")
    }

    const { title, description, date, time, location, state, city, type, capacity } = req.body

    // convert the incoming time to date and append it with the date of the event
    const eventDateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    eventDateTime.setHours(hours);
    eventDateTime.setMinutes(minutes);

    // Automatically set deadline to 2 hours before the event date
    const deadlineDateTime = new Date(eventDateTime);
    deadlineDateTime.setHours(deadlineDateTime.getHours() - 2);

    if (
        [title, description, date, time, location, state, city, type, capacity].some((field) => field === undefined || field === "")
    ) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(400, "All fields are required")
    }

    if (capacity <= 0) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(400, "Capacity should be greater than 0")
    }

    if (eventDateTime < new Date()) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(400, "Date should be greater than current date")
    }

    if (deadlineDateTime < new Date()) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(400, "Deadline should be greater than current date")
    }

    if (deadlineDateTime > eventDateTime) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(400, "Deadline should be less than date")
    }

    const imagePath = req.files?.image[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path

    const image = await Image.create({
        title: title + " Image",
        folderName: req.user?.folderName,
        url: imagePath
    })

    if (!image) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(500, "Image upload failed")
    }

    const coverImage = await Image.create({
        title: title + " Cover Image",
        folderName: req.user?.folderName,
        url: coverImagePath
    })

    if (!coverImage) {
        fs.unlinkSync(req.files?.image[0]?.path)
        fs.unlinkSync(req.files?.coverImage[0]?.path)
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
            })
        }
        throw new ApiError(500, "Cover Image upload failed")
    }

    const event = await Event.create({
        title,
        description,
        date: eventDateTime,
        location,
        deadline: deadlineDateTime,
        state,
        city,
        type,
        capacity,
        image: image._id,
        coverImage: coverImage._id,
        createdBy: organizer
    })

    if (!event) {
        if (req.files?.gallery) {
            req.files.gallery.forEach((file) => {
                fs.unlinkSync(file.path)
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

    // Schedule the event reminder
    await scheduleEventReminder(event)

    return res
        .status(201)
        .json(new ApiResponse(201, event, "Event created successfully"))
})

const updateEvent = asyncHandler(async (req, res) => {
    try {
        const organizer = await Organizer.findById(req.user?.id);
        if (!organizer) {
            throw new ApiError(404, "Organizer not found");
        }

        const { eventid } = req.params;
        const event = await Event.findById(eventid);
        if (!event) {
            throw new ApiError(404, "Event not found");
        }

        if (event.createdBy.toString() !== organizer._id.toString()) {
            throw new ApiError(401, "Unauthorized");
        }

        console.log(req.body)

        const { title, description, date, location, state, city, type, capacity } = req.body;

        if ([title, description, date, location, state, city, type, capacity].some(field => !field)) {
            throw new ApiError(400, "All fields are required");
        }

        if (Number(capacity) <= 0) {
            throw new ApiError(400, "Capacity should be greater than 0");
        }

        if(Number(capacity) < event.attendees.length){
            throw new ApiError(400, "Capacity can not be less than the number of attendees already registered");
        }

        if (isNaN(new Date(date))) {
            throw new ApiError(400, "Invalid date format");
        }

        const deadlineDateTime = new Date(date);
        deadlineDateTime.setHours(deadlineDateTime.getHours() - 2);

        if (deadlineDateTime < new Date()) {
            throw new ApiError(400, "Event date should be greater than current date");
        }

        if (deadlineDateTime > new Date(date)) {
            throw new ApiError(400, "Deadline should be at least 2 hours before the event date");
        }

        const remainingCapacity = event.remainingCapacity + (Number(capacity) - Number(event.capacity));
        if (remainingCapacity < 0) {
            throw new ApiError(400, "Remaining capacity cannot be negative");
        }

        console.log("here")

        const updatedEvent = await Event.findByIdAndUpdate(
            eventid,
            {
                title,
                description,
                date,
                location,
                state,
                city,
                type,
                capacity,
                remainingCapacity,
                deadline: deadlineDateTime,
            },
            { new: true }
        );

        if (!updatedEvent) {
            throw new ApiError(500, "Event update failed");
        }

        const updatedEventWithImages = await Event.aggregate([
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
        ]);


        return res.status(200).json(new ApiResponse(200, updatedEventWithImages[0], "Event updated successfully"));
    } catch (error) {
        console.error("Error updating event:", error);
        throw new ApiError(500, "Internal Server Error");
    }
});


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

    if (!galleryImages) {
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

    if (!updatedEvent) {
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

    if (!updatedEvent) {
        throw new ApiError(500, "Gallery images addition failed")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedEvent, "Gallery images added successfully"))
})

const getEventInfo = asyncHandler(async (req, res) => {
    const { eventid } = req.params
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

    if (eventData.length === 0) {
        throw new ApiError(404, "Event not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, eventData[0], "Event data retrieved successfully"))
})

// const sendRSVPMailsToParticipants = asyncHandler(async (req, res) => {
//     const { eventid } = req.params
//     const event = await Event.findById(eventid)
//     if (!event) {
//         throw new ApiError(404, "Event not found")
//     }

//     const participants = await Participant.find({ event: eventid, rsvpStatus: "not-going" }).populate("user")

//     if (participants.length === 0) {
//         throw new ApiError(404, "No participants found")
//     }

//     const participantEmails = participants.map(participant => participant.user.email)

//     const rsvpLink = `${process.env.FRONTEND_URL}/events/${eventid}`;

//     const message = `Dear Participant,\n\nYou are invited to RSVP for the event "${event.title}".\n\nLocation: ${event.location}\nDate: ${event.date}\nTime: ${event.time}\n\nPlease RSVP at your earliest convenience by clicking the link below:\n\n${rsvpLink}\n\nBest regards,\n${req.user.name}`;

//     const mailOptions = {
//         to: participantEmails,
//         subject: `RSVP for ${event.title}`,
//         text: message
//     };

//     await sendMail(mailOptions);

//     return res
//         .status(200)
//         .json(new ApiResponse(200, null, "RSVP mails sent successfully"))
// })

const verifyRSVPUsingQRCode = asyncHandler(async (req, res) => {
    // TODO: implement capture image of the person while registering for the event and when the same person checks in the event using the qr code provided, the event coordinator gets to see the RSVP status and the image which can be used to verify if the same person is attending the event who registered in the event
    const organizerID = req.user?.id
    if (!organizerID) {
        throw new ApiError(401, "Unauthorized")
    }

    const organizer = await Organizer.findById(organizerID)
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

    const { qrCode } = req.body
    const participant = await Participant.findById(qrCode)

    if (!participant) {
        throw new ApiError(404, "Participant not found")
    }

    if (participant.event.toString() !== event._id.toString()) {
        throw new ApiError(404, "Participant not found")
    }

    if (participant.rsvpStatus == "checked-in") {
        throw new ApiError(400, "Participant already checked in")
    }

    participant.rsvpStatus = "checked-in"
    await participant.save({ validateBeforeSave: false })

    const participantWithName = await Participant.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(qrCode) }
        },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 0,
                            __v: 0,
                            password: 0,
                            createdAt: 0,
                            updatedAt: 0,
                            folderName: 0,
                            refreshToken: 0,
                            verified: 0,
                            eventHistory: 0
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                __v: 0,
                event: 0,
                qrCode: 0,
                createdAt: 0,
                updatedAt: 0
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, participantWithName[0], "Participant verified successfully"))
})

const getAllOpenEvents = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    
    const events = await Event.aggregate([
        {
            $match: { type: "open", registrationsEnabled: true, deadline: { $gt: currentDate } }  
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
            $addFields: {
                image: { $arrayElemAt: ["$image", 0] },
                coverImage: { $arrayElemAt: ["$coverImage", 0] }
            }
        },
        {
            $project: {
                __v: 0,
                gallery: 0,
                createdBy: 0,
                attendees: 0,
                type: 0,
                capacity: 0,
                remainingCapacity: 0,
                qrCode: 0,
                registrationsEnabled: 0,
                deadline: 0,
                createdAt: 0,
                updatedAt: 0,
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, events, "Open events retrieved successfully"));
})

const disableRegistrations = asyncHandler(async (req, res) => {
    const organizerID = req.user?.id
    if (!organizerID) {
        throw new ApiError(401, "Unauthorized")
    }

    const organizer = await Organizer.findById(organizerID)
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

    event.registrationsEnabled = false
    await event.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Registrations disabled successfully"))
})

const sendMailToParticipants = asyncHandler(async (req, res) => {
    const { eventid } = req.params
    const event = await Event.findById(eventid)

    if (!event) {
        throw new ApiError(404, "Event not found")
    }

    const message = req.body.message
    if(!message) {
        throw new ApiError(400, "Message is required")
    }

    const participants = await Participant.find({ event: eventid }).populate("user")

    if (participants.length === 0) {
        throw new ApiError(404, "No participants registered for the Event")
    }

    const participantEmails = participants.map(participant => participant.user.email)    

    const subject = `Update About Event ${event.title}`
    const htmlMessage = `<p>${message}</p><p>Best regards,<br>${req.user.name}</p>`

    const mailOptions = {
        to: participantEmails,
        subject,
        html: htmlMessage
    }

    await sendMail(mailOptions)

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Mail sent successfully"))
})

export {
    createEvent,
    updateEvent,
    removeImagesFromGallery,
    addImagesToGallery,
    getEventInfo,
    verifyRSVPUsingQRCode,
    disableRegistrations,
    getAllOpenEvents,
    sendMailToParticipants
}

//TODO: delete event