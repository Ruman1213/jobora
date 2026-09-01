import Company from "../models/company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// ======================================================
// REGISTER COMPANY
// ======================================================

export const registercompany = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const imageFile = req.file;

        // Check required fields
        if (!name || !email || !password || !imageFile) {
            return res.json({
                success: false,
                message: "Missing Details"
            });
        }

        // Check if company already exists
        const companyExists = await Company.findOne({ email });

        if (companyExists) {
            return res.json({
                success: false,
                message: "Company already registered"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(
            imageFile.path
        );

        // Create company
        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        });

        // Generate JWT token
        const token = generateToken(company._id);

        return res.json({
            success: true,
            message: "Company registered successfully",
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// COMPANY LOGIN
// ======================================================

export const logincompany = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find company
        const company = await Company.findOne({ email });

        if (!company) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            company.password
        );

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate token
        const token = generateToken(company._id);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            }
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET COMPANY DATA
// ======================================================

export const getcompanyData = async (req, res) => {
    try {
        if (!req.company) {
            return res.json({
                success: false,
                message: "Company not found"
            });
        }

        return res.json({
            success: true,
            company: req.company
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// POST NEW JOB
// ======================================================

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            salary,
            level,
            category
        } = req.body;

        // Check authentication
        if (!req.company) {
            return res.json({
                success: false,
                message: "Not authorized, login again"
            });
        }

        // Check job details
        if (
            !title ||
            !description ||
            !location ||
            salary === undefined ||
            salary === null ||
            !level ||
            !category
        ) {
            return res.json({
                success: false,
                message: "Missing job details"
            });
        }

        // Create job
        const newJob = await Job.create({
            title,
            description,
            location,
            salary: Number(salary),
            companyId: req.company._id,
            date: Date.now(),
            level,
            category,
            visible: true
        });

        return res.json({
            success: true,
            message: "Job posted successfully",
            newJob
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET COMPANY JOB APPLICANTS
// ======================================================

export const getCompanyJobApplicants = async (req, res) => {
    try {
        if (!req.company) {
            return res.json({
                success: false,
                message: "Not authorized, login again"
            });
        }

        // Find all jobs posted by this company
        const companyJobs = await Job.find({
            companyId: req.company._id
        });

        // Get job IDs
        const jobIds = companyJobs.map(job => job._id);

        // Find applications for those jobs
        const applications = await JobApplication.find({
            jobId: { $in: jobIds }
        })
            .populate("jobId")
            .populate("userId", "name email image resume")
            .sort({ date: -1 });

        return res.json({
            success: true,
            applications
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// GET JOBS POSTED BY COMPANY
// ======================================================

export const getCompanyPostedJobs = async (req, res) => {
    try {
        if (!req.company) {
            return res.json({
                success: false,
                message: "Not authorized, login again"
            });
        }

        // Get all jobs of logged-in company
        const jobs = await Job.find({
            companyId: req.company._id
        });

        // Add applicant count to every job
        const jobsData = await Promise.all(
            jobs.map(async (job) => {

                const applicantsCount =
                    await JobApplication.countDocuments({
                        jobId: job._id
                    });

                return {
                    ...job.toObject(),
                    applicants: applicantsCount
                };
            })
        );

        return res.json({
            success: true,
            jobsData
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// CHANGE JOB APPLICATION STATUS
// ======================================================

export const changeJobApplicationsStatus = async (req, res) => {
    try {
        if (!req.company) {
            return res.json({
                success: false,
                message: "Not authorized, login again"
            });
        }

        const { id, status } = req.body;

        if (!id || !status) {
            return res.json({
                success: false,
                message: "Application ID and status are required"
            });
        }

        // Find application
        const application =
            await JobApplication.findById(id);

        if (!application) {
            return res.json({
                success: false,
                message: "Application not found"
            });
        }

        // Find the job related to application
        const job = await Job.findById(
            application.jobId
        );

        if (!job) {
            return res.json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if job belongs to logged-in company
        if (
            job.companyId.toString() !==
            req.company._id.toString()
        ) {
            return res.json({
                success: false,
                message: "Not authorized"
            });
        }

        // Update application status
        application.status = status;

        await application.save();

        return res.json({
            success: true,
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};


// ======================================================
// CHANGE JOB VISIBILITY
// ======================================================

export const changeVisibility = async (req, res) => {
    try {
        if (!req.company) {
            return res.json({
                success: false,
                message: "Not authorized, login again"
            });
        }

        const { id } = req.body;

        if (!id) {
            return res.json({
                success: false,
                message: "Job ID is required"
            });
        }

        // Find job
        const job = await Job.findById(id);

        if (!job) {
            return res.json({
                success: false,
                message: "Job not found"
            });
        }

        // Check if job belongs to logged-in company
        if (
            job.companyId.toString() !==
            req.company._id.toString()
        ) {
            return res.json({
                success: false,
                message: "Not authorized to modify this job"
            });
        }

        // Toggle visibility
        job.visible = !job.visible;

        await job.save();

        return res.json({
            success: true,
            message: "Job visibility updated successfully",
            job
        });

    } catch (error) {
        console.log(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
};