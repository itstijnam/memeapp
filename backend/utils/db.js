import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0/instaclone")
        console.log(`mongo connected`)
    } catch (error) {
        console.log(`mongo not connect ERROR`)
    }
}

export default connectDB; 