import mongoose from "mongoose";
import Job from "../models/Job.js";
import { getJobicyJobs } from "../utils/jobicyJobs.js";

export const getJobs = async (req, res) => {
  try {
    const dbJobs = await Job.find({ visible: true })
      .populate("companyId", "name email image")
      .sort({ date: -1 })
      .lean();

    const publicJobs = await getJobicyJobs();

    return res.json({
      success: true,
      jobs: [...dbJobs, ...publicJobs],
    });
  } catch (error) {
    console.log("Get Jobs Error:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (String(id).startsWith("jobicy-")) {
      const publicJobs = await getJobicyJobs();
      const job = publicJobs.find((item) => item._id === id);

      if (!job) {
        return res.json({
          success: false,
          message: "Job not found",
        });
      }

      return res.json({
        success: true,
        job,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    const job = await Job.findById(id).populate("companyId", "name email image");

    if (!job) {
      return res.json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.log("Get Job By ID Error:", error);

    return res.json({
      success: false,
      message: error.message,
    });
  }
};
