import mongoose, { Schema } from "mongoose"

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



export const Event = mongoose.model("Event", eventSchema)