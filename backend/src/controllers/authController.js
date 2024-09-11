import Users from "../models/userModel.js";
import Companies from "../models/companiesModel.js";
// User Registration
export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate fields
    if (!firstName) return next("First Name is required");
    if (!lastName) return next("Last Name is required");
    if (!email) return next("Email is required");
    if (!password) return next("Password is required");

    try {
        const userExist = await Users.findOne({ email });
        if (userExist) return next("Email Address already exists");

        const user = await Users.create({ firstName, lastName, email, password });

        // User token
        const token = user.createJWT();
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                accountType: user.accountType,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// Company Registration
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
                accountType: 'company' // Ensure this field is included
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



// Sign In
// export const signIn = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         if (!email || !password) return next("Please Provide User Credentials");

//         const user = await Users.findOne({ email }).select("+password");
//         if (!user) return next("Invalid email or password");

//         const isMatch = await user.comparePassword(password);
//         if (!isMatch) return next("Invalid email or password");

//         user.password = undefined;

//         const token = user.createJWT();

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             user,
//             token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return next("Please Provide User Credentials");

        const user = await Users.findOne({ email }).select("+password");
        if (!user) return next("Invalid email or password");

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return next("Invalid email or password");

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
                accountType: user.accountType // Ensure this field is included
            },
            token,
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export default {
    register,
    registerCompany,
    signIn,
};
