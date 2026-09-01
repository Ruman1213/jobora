import express from 'express';

import {
    changeJobApplicationsStatus,
    changeVisibility,
    getcompanyData,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    logincompany,
    postJob,
    registercompany
} from '../controllers/companyController.js';
import { protectCompany } from '../middleware/authMiddleware.js';

import upload from '../config/multer.js';

const router = express.Router();

router.post('/register', upload.single('image'), registercompany);

router.post('/login', logincompany);

router.get('/company', protectCompany ,getcompanyData);

router.post('/post-job',protectCompany, postJob);

router.get('/appicants', protectCompany, getCompanyJobApplicants);
router.get('/applicants', protectCompany, getCompanyJobApplicants);

router.get('/list-jobs', protectCompany, getCompanyPostedJobs);

router.post('/change-status',protectCompany, changeJobApplicationsStatus);

router.post('/change-visibility',protectCompany, changeVisibility);

export default router;