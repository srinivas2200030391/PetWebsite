import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://2200032294:5vBxdvADAP1cubnX@cluster0.mvguo.mongodb.net/PET-SHOP?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting mongodb", error.message);
    process.exit(1);
  }
};

export default connectDB;
