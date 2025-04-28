import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB...', conn.connection.host);  // Success log
  } catch (error) {
    console.error('Error connecting to DB:', error);  // Error log
    process.exit(1);  // Exit process if DB connection fails
  }
};

export default connectDb;
