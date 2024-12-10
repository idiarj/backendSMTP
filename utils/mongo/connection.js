import mongoose from "mongoose";

const URI = process.env.MONGO_URI || "mongodb+srv://Idiarj:16012004id@cluster0.pbqjb.mongodb.net/smtp?retryWrites=true&w=majority";

console.log(URI)
export const createConnection = async () =>{
    try {
        return await mongoose.connect(URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error(error);
    }
}

export const MONGO_CONNECTION = await createConnection();