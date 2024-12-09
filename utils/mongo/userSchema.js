import mongoose from "mongoose";
import { MONGO_CONNECTION } from "./connection.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
})

export const User = mongoose.model("User", userSchema);