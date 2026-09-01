import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../contex/AppContex";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);

  const fetchApplicants = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/applicants`,
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        setApplicants(data.applications || []);
      } else {
        toast.error(data.message || "Failed to load applicants");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to load applicants"
      );
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchApplicants();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update status"
      );
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchApplicants();
    }
  }, [companyToken]);

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-x-auto">
        <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4 text-left">User Name</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
              <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-2 px-4 text-left">Resume</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.length > 0 ? (
              applicants.map((applicant, index) => (
                <tr key={applicant._id} className="text-gray-700">
                  <td className="py-2 px-4 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="py-2 px-4 border-b text-center flex items-center">
                    <img
                      className="w-10 h-10 rounded-full mr-3 max-sm:hidden object-cover"
                      src={applicant.userId?.image || assets.profile_img}
                      alt=""
                    />
                    <span>{applicant.userId?.name || "Applicant"}</span>
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {applicant.jobId?.title}
                  </td>
                  <td className="py-2 px-4 border-b max-sm:hidden">
                    {applicant.jobId?.location}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {applicant.userId?.resume ? (
                      <a
                        href={applicant.userId.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                      >
                        Resume
                        <img src={assets.resume_download_icon} alt="" />
                      </a>
                    ) : (
                      <span className="text-gray-400">No resume</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b relative">
                    <div className="relative inline-block text-left group">
                      <button className="text-gray-500 action-button">
                        ...
                      </button>
                      <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                        <button
                          onClick={() => changeStatus(applicant._id, "Accepted")}
                          className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => changeStatus(applicant._id, "Rejected")}
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-6 text-center text-gray-500"
                >
                  No applications yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplications;
