// import JWT from "jsonwebtoken";
// import Admin from '../models/adminModel.js';

// export const adminAuth = async (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         return res.status(401).json({ message: 'Authentication required' });
//     }

//     try {
//         const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
//         const admin = await Admin.findById(decoded.userId);

//         if (!admin) {
//             return res.status(403).json({ message: 'Not authorized as admin' });
//         }

//         req.admin = admin; // Attach admin to request object
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// export const userAuth = async (req, res, next) => {
//     const authHeader = req?.headers?.authorization;

//     if(!authHeader || !authHeader?.startsWith("Bearer")) {
//         next("Authentication failed");
//     }

//     const token = authHeader?.split(" ")[1];

//     try {
//         const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

//         req.body.user = {
//             userId: userToken.userId,
//         };

//         next();
//     } catch (error) {
//         console.log(error);
//         next("Authentication failed");
//     }

// };

// // // User authentication middleware
// // export const userAuth = async (req, res, next) => {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //         return res.status(401).json({ message: 'Authentication failed' });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     try {
// //         const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY); // Ensure JWT_SECRET_KEY is correct

// //         req.body.user = {
// //             userId: decoded.userId,
// //         };

// //         next();
// //     } catch (error) {
// //         console.error(error);
// //         res.status(401).json({ message: 'Authentication failed' });
// //     }
// // };


// export default {userAuth, adminAuth};

import JWT from "jsonwebtoken";
import Admin from '../models/adminModel.js';
import Users from "../models/userModel.js";

// Admin authentication middleware
export const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

        // Check if the admin exists in the database
        const admin = await Admin.findById(decoded.userId);
        if (!admin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        // Optionally, log the admin ID for debugging (make sure not to log sensitive data)
        console.log(`Admin authenticated: ${admin._id}`);

        // Attach admin to request object for future use
        req.admin = admin;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        console.error(error); // Log error for debugging
        res.status(401).json({ message: 'Invalid token' });
    }
};

// // User/Company authentication middleware
// export const userAuth = async (req, res, next) => {
//     const authHeader = req?.headers?.authorization;

//     if (!authHeader || !authHeader?.startsWith("Bearer")) {
//         return res.status(401).json({ message: 'Authentication failed. Token missing or malformed.' });
//     }

//     const token = authHeader?.split(" ")[1];

//     try {
//         const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        
//         // Optionally log the user ID for debugging
//         console.log(`User authenticated: ${userToken.userId}`);

//         // Attach user info to request body
//         req.user = {
//             userId: userToken.userId,
//             role: userToken.role // Attach role from token
//         };

//         // Check if user has the right role to create jobs
//         if (userToken.role !== 'company') { // Adjust as necessary
//             return res.status(403).json({ message: 'Forbidden: You do not have permission to create jobs.' });
//         }

//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'Token expired. Please log in again.' });
//         }
//         console.error(error); // Log error for debugging
//         next("Authentication failed: Invalid token.");
//     }
// };


// User/Company authentication middleware
export const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: 'Token missing or malformed.' });
    }

    const token = authHeader.split(" ")[1];

    try {
        const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);
        req.user = {
            userId: userToken.userId,
            role: userToken.role,
        };

        // Proceed without checking role if not needed
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ message: 'Invalid token or access denied.' });
    }
};



// You can export these middlewares as named exports.
export default { userAuth, adminAuth };
