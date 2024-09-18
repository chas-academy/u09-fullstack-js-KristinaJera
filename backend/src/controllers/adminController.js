import Admin from '../models/adminModel.js';
import Users from '../models/userModel.js';
import Companies from '../models/companiesModel.js';

// Create an admin
export const createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const adminExist = await Admin.findOne({ email });
        if (adminExist) return res.status(400).json({ message: 'Admin already exists' });

        const admin = await Admin.create({ username, email, password });
        const token = admin.createJWT();
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new user by admin
export const createUser = async (req, res) => {
    const { firstName, lastName, email, password, contact, location, jobTitle, about } = req.body;

    try {
        const userExists = await Users.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password, // Consider hashing the password before saving
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
        res.status(500).json({ message: error.message });
    }
};

// Create a new company by admin
export const createCompany = async (req, res) => {
    const { name, address, industry, email, contact, website } = req.body;

    try {
        const companyExists = await Companies.findOne({ email });
        if (companyExists) return res.status(400).json({ message: 'Company already exists' });

        const company = await Companies.create({ 
            name,
            address,
            industry,
            email,
            contact,
            website
        });

        const token = await company.createJWT();
        res.status(201).json({
            success: true,
            message: 'Company created successfully',
            token
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

export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const updateData = req.body;

    try {
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

// CRUD operations for companies
export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Companies.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCompanyById = async (req, res) => {
    const { companyId } = req.params;

    try {
        const company = await Companies.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCompany = async (req, res) => {
    const { companyId } = req.params;
    const updateData = req.body;

    try {
        const company = await Companies.findByIdAndUpdate(companyId, updateData, { new: true });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

// Export functions
export default {
    createAdmin,
    // adminLogin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    createUser,   
    createCompany
};
