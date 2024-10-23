import mongoose, {Schema} from "mongoose";

const participantSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        event: {
            type: Schema.Types.ObjectId,
            ref: "Event"
        },
        rsvpStatus: {
            type: String,
            enum: ["going", "not-going", "maybe"],
            default: "not-going"
        },
        badge: {
            type: String,
            default: "none"
        },
        preferences: {
            type: String
        },
        qrCode: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

export const Participant = mongoose.model("Participant", participantSchema)