// dbConnection.js
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('❌ MONGODB_URI is missing. Check your .env file!');
}

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connect;
