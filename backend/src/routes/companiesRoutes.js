import express from 'express';
import { getCompanies, getCompanyById, getCompanyJobListing, getCompanyProfile, register, signIn } from "../controllers/companiesController.js";
import{userAuth} from "../middlewares/authMiddleware.js";
import { getAllCompanies } from "../controllers/adminController.js";
const router = express.Router();

router.post('/get-company-profile', userAuth, getCompanyProfile);
router.post('/get-company-joblisting', userAuth, getCompanyJobListing);
router.get('/', getCompanies);
router.get('/get-company/:id', getCompanyById);
router.put('/update-company', userAuth, getCompanyProfile);
router.get('/companies', getAllCompanies);


export default router;