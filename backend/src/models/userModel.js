import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
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
    jobTitle: { type: String },
    about: { type: String },
    role: {
      type: String,
      enum: ["user", "company", "admin"], // Define valid roles
      default: "user", // Default role
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

// Create JWT token
userSchema.methods.createJWT = function () {
  return JWT.sign(
    { userId: this._id, role: this.role }, // Include role in token payload
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1d" }
  );
};

const Users = mongoose.model("Users", userSchema);
export default Users;
