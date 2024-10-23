import { Event } from "../models/event.model.js"
import { Organizer } from "../models/organizer.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadFile, deleteFile } from "../utils/uploadFile.js"


const createEvent = asyncHandler(async (req, res) => {
    