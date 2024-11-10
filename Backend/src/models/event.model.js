import mongoose, { Schema } from "mongoose"
import { Image } from "./image.model.js"
import qrcode from "qrcode"

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
        state: {
            type: String,
            required: true
        },
        city: {
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
        qrCode: {
            type: String
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

eventSchema.pre("save", async function(next){
    this.qrCode = await qrcode.toDataURL(`${process.env.FRONTEND_URL}/event/${this._id}`)
    .then((url) => {
        return url;
    })
    .catch((err) => {
        throw new Error("QR Code generation failed");
    })    
    next();
})

export const Event = mongoose.model("Event", eventSchema)