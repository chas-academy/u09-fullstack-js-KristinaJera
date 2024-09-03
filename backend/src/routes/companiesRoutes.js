import exppres from "express";
import {rateLimit} from "express-rate-limit";
import { getCompanies, getCompanyById, getCompanyJobListing, getCompanyProfile, register, signIn } from "../controllers/companiesController.js";
import userAuth from "../middlewares/authMiddleware.js";

const router = exppres.Router();

//IP rate limit
const limiter = rateLimit({
    windows: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});


// REGISTER 
router.post('/register', limiter, register);
 
// LOGIN 
router.post('/login', limiter, signIn);

// GET DATA
router.post('/get-company-profile', userAuth, getCompanyProfile);
router.post('/get-company-joblisting', userAuth, getCompanyJobListing);
router.get('/', getCompanies);
router.get('/get-company/:id', getCompanyById);

// UPDATE DATA
router.put('/update-company', userAuth, getCompanyProfile);
  

export default router;