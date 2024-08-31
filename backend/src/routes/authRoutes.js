import express from "express";
import rateLimit from "express-rate-limit";
import {signIn, register} from "../controllers/authController.js";

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
router.post("/login", signIn);

export default router;