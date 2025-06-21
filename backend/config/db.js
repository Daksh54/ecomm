import mongoose from "mongoose";
const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
        // Uncomment the line below to log the connection object
    } catch (error) {
        console.error(`Database connection failed:", {error.message}`);
        process.exit(1); // Exit the process with failure
    }
}
export default connectDB;