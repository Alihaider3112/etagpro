import mongoose from 'mongoose';
require('dotenv').config();


export const connect = async () => {
    try {
         await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connect;