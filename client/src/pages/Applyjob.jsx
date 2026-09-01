import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import kconvert from "k-convert";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

import { AppContext } from "../contex/AppContex";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import JobCard from "../components/JobCard";
import { assets } from "../assets/assets";

const ApplyJob = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();

  const {
    jobs,
    backendUrl,
    userData,
    fetchUserApplications,
  } = useContext(AppContext);

  const [jobData, setJobData] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const fetchJob = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);

      if (data.success) {
        setJobData(data.job);
      } else {
        toast.error(data.message || "Job not found");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to load job"
      );
    }
  };

  const applyHandler = async () => {
    try {
      if (!user) {
        toast.error("Please login to apply");
        return;
      }

      if (jobData?.source === "jobicy" && jobData.applyUrl) {
        window.open(jobData.applyUrl, "_blank", "noopener,noreferrer");
        return;
      }

      if (!userData?.resume) {
        toast.error("Please upload your resume first");
        return;
      }

      setIsApplying(true);

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/users/apply`,
        { jobId: jobData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to apply"
      );
    } finally {
      setIsApplying(false);
    }
  };

  useEffect(() => {
    if (id && backendUrl) {
      fetchJob();
    }
  }, [id, backendUrl]);

  if (!jobData) {
    return <Loading />;
  }

  const moreJobs = jobs.filter((job) => {
    const sameCompany =
      String(job.companyId?._id) === String(jobData.companyId?._id);
    return sameCompany && String(job._id) !== String(jobData._id);
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 2xl:px-20">

          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

              <div className="flex flex-col md:flex-row items-center">
                <img
                  className="h-24 w-24 bg-white border rounded-lg p-4 mr-0 md:mr-6 mb-4 md:mb-0 object-contain"
                  src={jobData.companyId?.image || assets.company_icon}
                  alt={jobData.companyId?.name}
                />

                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {jobData.title}
                  </h1>

                  <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-4 text-gray-600">
                    <span className="flex items-center gap-2">
                      <img src={assets.suitcase_icon} className="w-5" alt="" />
                      {jobData.companyId?.name}
                    </span>

                    <span className="flex items-center gap-2">
                      <img src={assets.location_icon} className="w-5" alt="" />
                      {jobData.location}
                    </span>

                    <span className="flex items-center gap-2">
                      <img src={assets.person_icon} className="w-5" alt="" />
                      {jobData.level}
                    </span>

                    <span className="flex items-center gap-2">
                      <img src={assets.money_icon} className="w-5" alt="" />
                      CTC : {kconvert.convertTo(jobData.salary || 0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={applyHandler}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg disabled:opacity-60"
                >
                  {jobData.source === "jobicy"
                    ? "Apply on Jobicy"
                    : isApplying
                      ? "Applying..."
                      : "Apply Now"}
                </button>

                <p className="text-gray-500 mt-3">
                  Posted {moment(jobData.date).fromNow()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-200 mt-8 p-8">
            <h2 className="text-2xl font-bold mb-6">
              Job Description
            </h2>

            <div
              className="rich-text leading-8 text-gray-700"
              dangerouslySetInnerHTML={{
                __html:
                  jobData.description ||
                  "<p>No Job Description Available.</p>",
              }}
            />

            <button
              onClick={applyHandler}
              disabled={isApplying}
              className="mt-8 bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-lg disabled:opacity-60"
            >
              {jobData.source === "jobicy"
                ? "Apply on Jobicy"
                : isApplying
                  ? "Applying..."
                  : "Apply Now"}
            </button>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              More Jobs from {jobData.companyId?.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moreJobs.slice(0, 4).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ApplyJob;
