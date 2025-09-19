import mongoose from "mongoose";

const connectMongoDB = async () => { 
    try {
        await mongoose.connect("mongodb+srv://ayushking6395_db_user:YaBgKr9XGH4CKmJX@cluster0.qd3u2pr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
    }
    }

    export default connectMongoDB;