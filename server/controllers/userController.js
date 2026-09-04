import User from "../models/User.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import { v2 as cloudinary } from "cloudinary";

import {
  clerkClient,
  getAuth,
} from "@clerk/express";


// =====================================
// GET USER DATA + CREATE USER IN MONGODB
// =====================================

export const getUserData = async (req, res) => {

  try {

    const {
      isAuthenticated,
      userId,
    } = getAuth(req);


    console.log("Clerk User ID:", userId);


    // =====================================
    // CHECK AUTHENTICATION
    // =====================================

    if (!isAuthenticated || !userId) {

      return res.status(401).json({
        success: false,
        message: "Not authorized, login again",
      });

    }


    // =====================================
    // FIND USER IN MONGODB
    // =====================================

    let user =
      await User.findById(userId);


    // =====================================
    // USER DOES NOT EXIST
    // CREATE USER IN MONGODB
    // =====================================

    if (!user) {

      console.log(
        "User not found in MongoDB"
      );

      console.log(
        "Getting user details from Clerk..."
      );


      const clerkUser =
        await clerkClient.users.getUser(
          userId
        );


      // =====================================
      // GET EMAIL
      // =====================================

      const email =
        clerkUser.emailAddresses?.[0]
          ?.emailAddress || "";


      // =====================================
      // GET NAME
      // =====================================

      const name =
        `${clerkUser.firstName || ""} ${
          clerkUser.lastName || ""
        }`.trim() || "User";


      // =====================================
      // GET PROFILE IMAGE
      // =====================================

      const image =
        clerkUser.imageUrl || "";


      // =====================================
      // CREATE USER IN MONGODB
      // =====================================

      user = await User.create({
        _id: userId,

        name,

        email,

        image,

        resume: "",
      });


      console.log(
        "================================"
      );

      console.log(
        "USER CREATED IN MONGODB"
      );

      console.log(
        "MongoDB User ID:",
        user._id
      );

      console.log(
        "Email:",
        user.email
      );

      console.log(
        "================================"
      );

    } else {

      console.log(
        "User already exists in MongoDB:",
        user._id
      );

    }


    // =====================================
    // RETURN USER
    // =====================================

    return res.status(200).json({

      success: true,

      user,

    });

  } catch (error) {

    console.log(
      "Get User Data Error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



// =====================================
// APPLY FOR JOB
// =====================================

export const applyForJob =
  async (req, res) => {

    try {

      const {
        jobId,
      } = req.body;


      const {
        isAuthenticated,
        userId,
      } = getAuth(req);


      console.log(
        "Clerk User ID:",
        userId
      );


      // =====================================
      // CHECK AUTHENTICATION
      // =====================================

      if (
        !isAuthenticated ||
        !userId
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized, login again",

        });

      }


      // =====================================
      // CHECK JOB ID
      // =====================================

      if (!jobId) {

        return res.status(400).json({

          success: false,

          message:
            "Job ID is required",

        });

      }


      // =====================================
      // PREVENT EXTERNAL JOB APPLICATION
      // =====================================

      if (
        String(jobId)
          .startsWith("jobicy-")
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Apply on the company website for this listing",

        });

      }


      // =====================================
      // CHECK USER
      // =====================================

      const user =
        await User.findById(userId);


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // =====================================
      // CHECK JOB
      // =====================================

      const job =
        await Job.findById(jobId);


      if (!job) {

        return res.status(404).json({

          success: false,

          message:
            "Job not found",

        });

      }


      // =====================================
      // CHECK JOB VISIBILITY
      // =====================================

      if (!job.visible) {

        return res.status(400).json({

          success: false,

          message:
            "This job is no longer available",

        });

      }


      // =====================================
      // CHECK ALREADY APPLIED
      // =====================================

      const alreadyApplied =
        await JobApplication.findOne({

          userId,

          jobId,

        });


      if (alreadyApplied) {

        return res.status(400).json({

          success: false,

          message:
            "Already applied for this job",

        });

      }


      // =====================================
      // CREATE APPLICATION
      // =====================================

      const application =
        await JobApplication.create({

          userId,

          companyId:
            job.companyId,

          jobId,

          status:
            "pending",

          date:
            Date.now(),

        });


      return res.status(200).json({

        success: true,

        message:
          "Job application submitted successfully",

        application,

      });

    } catch (error) {

      console.log(
        "Apply Job Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// =====================================
// GET USER JOB APPLICATIONS
// =====================================

export const getUserJobApplications =
  async (req, res) => {

    try {

      const {
        isAuthenticated,
        userId,
      } = getAuth(req);


      console.log(
        "Clerk User ID:",
        userId
      );


      // =====================================
      // CHECK AUTHENTICATION
      // =====================================

      if (
        !isAuthenticated ||
        !userId
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized, login again",

        });

      }


      // =====================================
      // GET APPLICATIONS
      // =====================================

      const applications =
        await JobApplication.find({

          userId,

        })
          .populate(
            "companyId",
            "name email image"
          )
          .populate(
            "jobId"
          );


      return res.status(200).json({

        success: true,

        applications,

      });

    } catch (error) {

      console.log(
        "Get Applications Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// =====================================
// UPDATE USER RESUME
// =====================================

export const updateUserResume =
  async (req, res) => {

    try {

      const {
        isAuthenticated,
        userId,
      } = getAuth(req);


      console.log(
        "Clerk User ID:",
        userId
      );


      // =====================================
      // CHECK AUTHENTICATION
      // =====================================

      if (
        !isAuthenticated ||
        !userId
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Not authorized, login again",

        });

      }


      // =====================================
      // GET FILE
      // =====================================

      const resumeFile =
        req.file;


      if (!resumeFile) {

        return res.status(400).json({

          success: false,

          message:
            "Please upload a resume file",

        });

      }


      // =====================================
      // FIND USER
      // =====================================

      const userData =
        await User.findById(userId);


      if (!userData) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // =====================================
      // UPLOAD TO CLOUDINARY
      // =====================================

      const resumeUpload =
        await cloudinary.uploader.upload(

          resumeFile.path,

          {
            resource_type:
              "raw",
          }

        );


      // =====================================
      // SAVE RESUME URL
      // =====================================

      userData.resume =
        resumeUpload.secure_url;


      await userData.save();


      return res.status(200).json({

        success: true,

        message:
          "Resume updated successfully",

        resume:
          userData.resume,

      });

    } catch (error) {

      console.log(
        "Update Resume Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };