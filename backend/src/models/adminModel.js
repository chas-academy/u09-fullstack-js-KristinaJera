import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

const adminSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
    }
});

// Middleware to hash password before saving
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
adminSchema.methods.createJWT = function() {
    return JWT.sign(
        { userId: this._id, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
