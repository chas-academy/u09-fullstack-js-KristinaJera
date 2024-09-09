import JWT from "jsonwebtoken";
import Admin from '../models/adminModel.js';

export const adminAuth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);
        const admin = await Admin.findById(decoded.userId);

        if (!admin) {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        req.admin = admin; // Attach admin to request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const userAuth = async (req, res, next) => {
    const authHeader = req?.headers?.authorization;

    if(!authHeader || !authHeader?.startsWith("Bearer")) {
        next("Authentication failed");
    }

    const token = authHeader?.split(" ")[1];

    try {
        const userToken = JWT.verify(token, process.env.JWT_SECTRET_KEY);

        req.body.user = {
            userId: userToken.userId,
        };

        next();
    } catch (error) {
        console.log(error);
        next("Authentication failed");
    }

};

// // User authentication middleware
// export const userAuth = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: 'Authentication failed' });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY); // Ensure JWT_SECRET_KEY is correct

//         req.body.user = {
//             userId: decoded.userId,
//         };

//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// };


export default {userAuth, adminAuth};