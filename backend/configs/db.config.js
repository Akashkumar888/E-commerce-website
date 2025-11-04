
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("❌ MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/Forever`);

  } catch (error) {
    console.log("❌ DB connection failed");
    process.exit(1);
  }
};

export default connectDB;
