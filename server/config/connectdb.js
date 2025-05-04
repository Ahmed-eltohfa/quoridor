import mongoose from 'mongoose';

const connectDB = () => {

    mongoose.connect(`${process.env.MONGO_URI}/quoridor`)
        .then(() => console.log('MongoDB connected'))
        .catch((err) => console.error('MongoDB error:', err));
}
export default connectDB;