import express from 'express';
import { getCompanies, getCompanyById, getCompanyJobListing, getCompanyProfile, register, signIn, createJob } from "../controllers/companiesController.js";
import{userAuth} from "../middlewares/authMiddleware.js";
import { getAllCompanies } from "../controllers/adminController.js";
const router = express.Router();

router.post('/get-company-profile', userAuth, getCompanyProfile);
router.post('/get-company-joblisting', userAuth, getCompanyJobListing);
router.get('/', getCompanies);
router.get('/get-company/:id', getCompanyById);
router.put('/update-company', userAuth, getCompanyProfile);
router.get('/companies', getAllCompanies);
// Job creation route (authenticated companies only)
router.post('/company-create-job/:companyId', userAuth, createJob);


export default router;