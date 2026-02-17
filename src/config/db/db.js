import mongoose from 'mongoose';
import { MONGO_URI } from '../env/env.js';

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Mongo db connected succesfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }

};

export default connectDb;