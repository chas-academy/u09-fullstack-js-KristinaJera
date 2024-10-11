import express from "express";
import rateLimit from "express-rate-limit";
import {signIn, register, registerCompany, companySignIn, signInAdmin} from "../controllers/authController.js";

//IP rate limit
const limiter = rateLimit({
    windows: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

// Register routes
router.post("/register", limiter, register);
router.post("/user/login", limiter, signIn);
router.post("/admin/login", limiter, signInAdmin);
router.post('/companies/login', (req, res, next) => {
    console.log('Company login route hit');  // Log this message to check
    companySignIn(req, res, next);  // Call the actual login handler
});
// router.post('/register-company', limiter, registerCompany);
router.post('/register-company', (req, res, next) => {
    console.log('Register Company route hit');
    registerCompany(req, res, next);
});
export default router;