import mongoose from "mongoose";

async function connectDB() {
    try {
        const conn = await mongoose.connect(String(process.env.MONGODB_CONNECTION_STRING));
        console.log("MongoDB is connected")
        return conn;
    } catch (error) {
        console.log(error)
    }
}

export default connectDB