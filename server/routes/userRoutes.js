import express from "express";
import { requireAuth } from "@clerk/express";

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
  requireAuth(),
  getUserData
);

// ==============================
// APPLY FOR JOB
// ==============================

router.post(
  "/apply",
  requireAuth(),
  applyForJob
);

// ==============================
// GET USER APPLICATIONS
// ==============================

router.get(
  "/applications",
  requireAuth(),
  getUserJobApplications
);

// ==============================
// UPDATE USER RESUME
// ==============================

router.post(
  "/update-resume",
  requireAuth(),
  upload.single("resume"),
  updateUserResume
);

export default router;