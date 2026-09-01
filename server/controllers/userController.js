import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { v2 as cloudinary } from "cloudinary";


// =====================================
// GET USER DATA
// =====================================

export const getUserData = async (req, res) => {
  try {

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    console.log("Get User Data Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// =====================================
// APPLY FOR JOB
// =====================================

export const applyForJob = async (req, res) => {

  try {

    const { jobId } = req.body;

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    if (String(jobId).startsWith("jobicy-")) {
      return res.status(400).json({
        success: false,
        message: "Apply on the company website for this listing",
      });
    }


    // Check User

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // Check Job

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }


    // Check Job Visibility

    if (!job.visible) {
      return res.status(400).json({
        success: false,
        message: "This job is no longer available",
      });
    }


    // Check Already Applied

    const alreadyApplied = await JobApplication.findOne({
      userId,
      jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }


    // Create Application

    const application = await JobApplication.create({
      userId,
      companyId: job.companyId,
      jobId,
      status: "pending",
      date: Date.now(),
    });


    return res.status(200).json({
      success: true,
      message: "Job application submitted successfully",
      application,
    });

  } catch (error) {

    console.log("Apply Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// =====================================
// GET USER JOB APPLICATIONS
// =====================================

export const getUserJobApplications = async (req, res) => {

  try {

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }


    const applications = await JobApplication.find({
      userId,
    })
      .populate("companyId", "name email image")
      .populate("jobId");


    return res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {

    console.log("Get Applications Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// =====================================
// UPDATE USER RESUME
// =====================================

export const updateUserResume = async (req, res) => {

  try {

    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });
    }


    const resumeFile = req.file;


    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume file",
      });
    }


    // Find User

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // Upload Resume to Cloudinary

    const resumeUpload =
      await cloudinary.uploader.upload(
        resumeFile.path,
        {
          resource_type: "raw",
        }
      );


    // Save Resume URL

    userData.resume =
      resumeUpload.secure_url;

    await userData.save();


    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume: userData.resume,
    });

  } catch (error) {

    console.log(
      "Update Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};