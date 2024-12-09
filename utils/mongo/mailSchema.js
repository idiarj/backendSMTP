import mongoose, { SchemaType } from "mongoose";
import { MONGO_CONNECTION } from "./connection.js";

const mailSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    attachaments: {
        type: Array,
        required: false,

    }
})

export const Mail = MONGO_CONNECTION.model("Mail", mailSchema);