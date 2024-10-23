import mongoose, {Schema} from "mongoose";

const imageSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Image = mongoose.model("Image", imageSchema)