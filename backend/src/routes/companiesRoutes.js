import express from 'express';
import { getCompanies, getCompanyById, getCompanyJobListing, getCompanyProfile, register, signIn, createJob, updateCompanyProfile, uploadCompanyProfileImage } from "../controllers/companiesController.js";
import{userAuth} from "../middlewares/authMiddleware.js";
import { getAllCompanies } from "../controllers/adminController.js";
import multer from 'multer';

const router = express.Router();

router.post('/get-company-profile', userAuth, getCompanyProfile);
router.post('/get-company-joblisting', userAuth, getCompanyJobListing);
router.get('/', getCompanies);
router.get('/get-company/:id', getCompanyById);
router.put('/update-company-profile', userAuth, updateCompanyProfile);
router.get('/companies', getAllCompanies);
// Job creation route (authenticated companies only)
router.post('/company-create-job/:companyId', userAuth, createJob);



// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to save the files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique file names
    }
  });

  const upload = multer({ storage: storage });
// Image upload route (Authenticated)
router.post('/upload-profile-image', userAuth, upload.single('profileImage'), uploadCompanyProfileImage);



export default router;