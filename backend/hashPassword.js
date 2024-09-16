// // // hashPassword.js
// import bcrypt from 'bcrypt';

// // const password = 'your_super_admin_password'; // Use a secure password for your super admin
// // const saltRounds = 10;

// // bcrypt.hash(password, saltRounds, function(err, hash) {
// //     if (err) {
// //         console.error('Error hashing password:', err);
// //     } else {
// //         console.log("Hashed password:", hash);
// //         // Copy the hashed password and use it when creating the super admin in your MongoDB
// //     }
// // });

// // const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const plainTextPassword = '1234567890'; // Replace with actual plain text password

// bcrypt.hash(plainTextPassword, saltRounds, function(err, hash) {
//     if (err) {
//         console.log(err);
//     } else {
//         db.admins.update(
//             { email: 'admin@example.com' }, // Find the admin by email or ID
//             { $set: { password: hash } } // Update the password with the hashed value
//         );
//         console.log('Password updated successfully');
//     }
// });
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/models/adminModel.js';  // Adjust path as needed

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || '';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error('Connection Error:', err);
    process.exit(1);
  }
};

const hashPassword = async () => {
  try {
    await connectDB();

    const plainTextPassword = '1234567890';  // Replace with the actual password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

    const admin = await Admin.findOne({ email: 'admin@example.com' });
    if (!admin) {
      console.log('No matching admin found.');
      return;
    }

    admin.password = hashedPassword;
    await admin.save();
    console.log('Password updated successfully:', hashedPassword);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
  }
};

hashPassword();
