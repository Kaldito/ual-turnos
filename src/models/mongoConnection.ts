import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI!;

const connectDB = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(uri);
};

export default connectDB;
