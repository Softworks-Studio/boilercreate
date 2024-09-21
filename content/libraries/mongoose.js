export const mongoose = `
import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('Connected to MongoDB successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// // Example schema and model
// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// export const User = mongoose.model('User', userSchema);

// // Example CRUD operations
// export const mongooseOperations = {
//   createUser: async (userData) => {
//     const user = new User(userData);
//     return await user.save();
//   },

//   findUserById: async (id) => {
//     return await User.findById(id);
//   },

//   updateUser: async (id, updateData) => {
//     return await User.findByIdAndUpdate(id, updateData, { new: true });
//   },

//   deleteUser: async (id) => {
//     return await User.findByIdAndDelete(id);
//   }
// };
`;
