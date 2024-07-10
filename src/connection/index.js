import mongoose from 'mongoose';
// mongodb://127.0.0.1:27017/etagpro
export const connect = async () => {
    try {
         await mongoose.connect("mongodb+srv://saaadii7:EPvoDr1knKou4CD9@dev.p2qvlks.mongodb.net/etagpro?retryWrites=true&w=majority&appName=Dev");
        console.log("Database connected successfully");
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export default connect;