import { config } from "dotenv";
import mongoose from "mongoose";
config();
const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`DB connected 👌!...`);
    })
    .catch((err) => {
      console.log(`DB connection fail`, err);
    });
};

export default connectDB;
