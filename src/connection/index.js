import mongoose from 'mongoose';
require('dotenv').config();


export const connect = async () => {
    try {
         await mongoose.connect("mongodb+srv://saaadii7:epvodr1knkou4cd9@dev.p2qvlks.mongodb.net/etagpro?retryWrites=true&w=majority&appName=Dev");
        console.log("Database connected successfully");
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connect;