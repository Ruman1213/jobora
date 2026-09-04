import express from "express";

import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// ==============================
// GET USER DATA
// ==============================

router.get(
  "/user",
  getUserData
);


// ==============================
// APPLY FOR JOB
// ==============================

router.post(
  "/apply",
  applyForJob
);


// ==============================
// GET USER APPLICATIONS
// ==============================

router.get(
  "/applications",
  getUserJobApplications
);


// ==============================
// UPDATE USER RESUME
// ==============================

router.post(
  "/update-resume",
  upload.single("resume"),
  updateUserResume
);


export default router;