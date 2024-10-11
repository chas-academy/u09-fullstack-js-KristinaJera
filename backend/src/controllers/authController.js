import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";
import Admin from "../models/adminModel.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate fields
    if (!firstName) return res.status(400).json({ message: "First Name is required" });
    if (!lastName) return res.status(400).json({ message: "Last Name is required" });
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!password) return res.status(400).json({ message: "Password is required" });

    try {
        const userExist = await Users.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Email Address already exists" });

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password,
            role: 'user' // Set default role to 'user'
        });

        const token = user.createJWT();
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role, // Use 'role' instead of 'accountType'
            },
            token,
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
};
export const registerCompany = async (req, res, next) => {
    console.log('Register Company function executed');
    const { name, email, password, companyName, companyCode } = req.body;

    // Validate fields
    if (!name) return next("Name is required");
    if (!email) return next("Email is required");
    if (!password) return next("Password is required");
    if (!companyName) return next("Company Name is required");
    if (!companyCode) return next("Company Code is required");

    try {
        // Check if company already exists
        const existingCompany = await Companies.findOne({ email });
        if (existingCompany) return next("Company already registered");

        // Create new company
        const company = await Companies.create({ name, email, password, companyName, companyCode });

        // Create JWT token
        const token = company.createJWT();

        res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                companyName: company.companyName,
                companyCode: company.companyCode,
                role: 'company' // Optionally include role if needed
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
export const companySignIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return next("Please Provide Company Credentials");

        const company = await Companies.findOne({ email }).select("+password");
        if (!company) return next("Invalid email or password");

        const isMatch = await company.comparePassword(password);
        if (!isMatch) return next("Invalid email or password");

        company.password = undefined;

        const token = company.createJWT();

        res.status(200).json({
            success: true,
            message: "Company login successful",
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                companyName: company.companyName,
                companyCode: company.companyCode,
                role: 'company' // Ensure this field is included
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return next("Please Provide User Credentials");

        const user = await Users.findOne({ email }).select("+password");
        if (!user) {
            console.log('User not found');
            return next("Invalid email or password");
          }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password does not match');
            return next("Invalid email or password");
          }
        user.password = undefined;

        const token = user.createJWT();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role // Ensure this field is included
            },
            token,
        });
        
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ message: 'An error occurred during user login' });
    }
};
export const signInAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email }).select("+password");
        if (!admin) {
            return res.status(401).json({ message: "Invalid admin email or password" });
        }

        // Check password match
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid admin email or password" });
        }

        // Create JWT
        admin.password = undefined; // Remove password from response
        const token = admin.createJWT();

        // Send response
        res.status(200).json({
            success: true,
            message: "Admin login successful",
            admin: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: 'admin' // Ensure this field is included
            },
            token,
        });
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ message: 'An error occurred during admin login', error: error.message });
    }
};


export default {
    register,
    registerCompany,
    signIn,
    signInAdmin
};
