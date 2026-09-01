import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import axios from "axios";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const navigate = useNavigate();

  // Jobs state
  const [jobs, setJobs] = useState([]);

  const { backendUrl, companyToken } = useContext(AppContext);

  // ============================================
  // FETCH COMPANY JOBS
  // ============================================

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/list-jobs`,
        {
          headers: {
            token: companyToken,
          },
        }
      );

      console.log("Jobs API Response:", data);

      if (data.success) {
        // Backend returns jobsData
        setJobs([...(data.jobsData || [])].reverse());

        console.log("Jobs:", data.jobsData);
      } else {
        toast.error(data.message || "Failed to fetch jobs");
      }
    } catch (error) {
      console.log("Fetch jobs error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong while fetching jobs"
      );
    }
  };

  // ============================================
  // CHANGE JOB VISIBILITY
  // ============================================

  const changeJobVisibility = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-visibility`,
        { id },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      console.log("Visibility response:", data);

      if (data.success) {
        toast.success(data.message);

        // Refresh jobs after changing visibility
        await fetchCompanyJobs();
      } else {
        toast.error(data.message || "Failed to change job visibility");
      }
    } catch (error) {
      console.log("Visibility error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  // ============================================
  // FETCH JOBS WHEN COMPANY TOKEN IS AVAILABLE
  // ============================================

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobs();
    } else {
      setJobs([]);
    }
  }, [companyToken]);

  return (
    <div className="container p-4 max-w-5xl">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left max-sm:hidden">
                #
              </th>

              <th className="py-2 px-4 border-b text-left">
                Job Title
              </th>

              <th className="py-2 px-4 border-b text-left max-sm:hidden">
                Date
              </th>

              <th className="py-2 px-4 border-b text-left max-sm:hidden">
                Location
              </th>

              <th className="py-2 px-4 border-b text-center">
                Applicants
              </th>

              <th className="py-2 px-4 border-b text-center">
                Visible
              </th>
            </tr>
          </thead>

          <tbody>
            {jobs.length > 0 ? (
              jobs.map((job, index) => (
                <tr
                  key={job._id}
                  className="text-gray-700"
                >
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {index + 1}
                  </td>

                  <td className="py-2 px-4 border-b">
                    {job.title}
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.date
                      ? moment(job.date).format("ll")
                      : "N/A"}
                  </td>

                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {job.location}
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    {job.applicants ?? 0}
                  </td>

                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="checkbox"
                      className="scale-125 cursor-pointer"
                      checked={Boolean(job.visible)}
                      onChange={() =>
                        changeJobVisibility(job._id)
                      }
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-gray-500"
                >
                  No jobs posted yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD NEW JOB BUTTON */}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-black text-white py-2 px-4 rounded"
        >
          Add New Job
        </button>
      </div>
    </div>
  );
};

export default ManageJobs;     