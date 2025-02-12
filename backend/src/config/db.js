import { MONGO_URI } from "../constants/env.js";
import mongoose from "mongoose";
const connectToDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
export default connectToDB;