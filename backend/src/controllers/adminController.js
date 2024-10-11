import Admin from '../models/adminModel.js';
import Users from '../models/userModel.js';
import Companies from '../models/companiesModel.js';
import Jobs from '../models/jobsModel.js';
import bcrypt from 'bcrypt';


// Create an admin
export const createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the admin already exists
        const adminExist = await Admin.findOne({ email });
        if (adminExist) return res.status(400).json({ message: 'Admin already exists' });

        // Create the new admin
        const admin = await Admin.create({ username, email, password });

        const token = admin.createJWT(); // Assuming createJWT() is a method defined in your Admin model

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-password'); // Exclude password from the response
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get admin by ID
export const getAdminById = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findById(adminId).select('-password'); // Exclude password
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an admin
export const updateAdmin = async (req, res) => {
    const { adminId } = req.params;
    const updateData = req.body;

    try {
        // Optionally hash the password if it's included in the update
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const admin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an admin
export const deleteAdmin = async (req, res) => {
    const { adminId } = req.params;

    try {
        const admin = await Admin.findByIdAndDelete(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user by admin
export const createUser = async (req, res) => {
    const { firstName, lastName, email, password, contact, location, jobTitle, about } = req.body;

    try {
        // Log the incoming request body
        console.log("Request body:", req.body);

        // Check if the user already exists
        console.log("Checking if user exists with email:", email);
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Create a new user
        const user = await Users.create({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Use the hashed password
            contact,
            location,
            jobTitle,
            about,
            role: 'user' // Set default role to 'user'
        });

        const token = await user.createJWT();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// Create a new company by admin
export const createCompany = async (req, res) => {
    const { companyName, email, password, contact, location, profileUrl, about } = req.body;

    try {
        const companyExists = await Companies.findOne({ email });
        if (companyExists) return res.status(400).json({ message: 'Company already exists' });

        const company = await Companies.create({ 
            companyName,
            email,
            password,
            contact,
            location,
            profileUrl,
            about
        });

        const token = company.createJWT(); // Generate token after creation
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            token,
            company
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD operations for users
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await Users.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updateData = { ...req.body }; // Create a copy of req.body

    try {
        // Check if password is provided in the updateData
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const user = await Users.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await Users.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Companies.find().select('-password'); // Exclude password from the response
        res.status(200).json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: error.message });
    }
};
// Get company by ID
export const getCompanyById = async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await Companies.findById(companyId).select('-password');
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update company
export const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    const updateData = { ...req.body }; // Create a copy of req.body

    try {
        // Check if password is provided in the updateData
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        const company = await Companies.findByIdAndUpdate(companyId, updateData, { new: true, runValidators: true }).select('-password');
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete company
export const deleteCompany = async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await Companies.findByIdAndDelete(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// CRUD operations for jobs
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Jobs.find();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: error.message });
    }
};


// Export functions
export default {
    createAdmin,
    getAdminById,
    getAllAdmins,
    deleteAdmin,
    updateAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    createUser,   
    createCompany,
    getAllJobs
};
