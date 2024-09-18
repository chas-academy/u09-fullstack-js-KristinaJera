import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Company Name is required"],
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
        select: false,
    },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    jobPosts: [{ type: Schema.Types.ObjectId, ref: 'Jobs' }],
    about: { type: String },
    role: {
        type: String,
        enum: ['user', 'company', 'admin'],
        default: 'company',
    }
});

// Middleware to hash password before saving
companySchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
companySchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// Create JWT token
companySchema.methods.createJWT = function () {
    return JWT.sign(
        { userId: this._id, role: this.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
    );
};

const Companies = mongoose.model("Companies", companySchema);
export default Companies;
