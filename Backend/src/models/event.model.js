import mongoose, { Schema } from "mongoose"
import { Image } from "./image.model.js"
import { deleteFolder } from "../utils/S3Utils.js"

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        image: {
            type: Schema.Types.ObjectId,
            ref: "Image"
        },
        coverImage: {
            type: Schema.Types.ObjectId,
            ref: "Image"
        },
        gallery: [
            {
                type: Schema.Types.ObjectId,
                ref: "Image"
            }
        ],
        type: {
            type: String,
            enum: ["open", "invite-only"],
            default: "open",
        },
        capacity: {
            type: Number,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        attendees: [
            {
                type: Schema.Types.ObjectId,
                ref: "Participant"
            }
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Organiser"
        }
    },
    {
        timestamps: true
    }
)

eventSchema.pre('findOneAndDelete', async function (next) {
    const docToDelete = await this.model.findOne(this.getQuery());
    if (docToDelete) {
        await Image.findByIdAndDelete(docToDelete.image);
        await Image.findByIdAndDelete(docToDelete.coverImage);
        if (docToDelete.gallery.length > 0) {
            docToDelete.gallery.forEach(async (image) => {
                await Image.findByIdAndDelete(image);
            })
        }
    }
    next();
});

export const Event = mongoose.model("Event", eventSchema)