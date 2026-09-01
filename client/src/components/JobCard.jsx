import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const description = String(job?.description || "").replace(/<[^>]+>/g, "");
  const logo = job?.companyId?.image || assets.company_icon;

  const openJob = () => {
    navigate(`/apply-job/${job._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="border p-6 shadow rounded">
      <div className="flex justify-between items-center">
        <img className="h-8 object-contain" src={logo} alt="" />
      </div>

      <h4 className="font-medium text-xl mt-2">{job.title}</h4>

      <div className="flex items-center gap-3 mt-2 text-xs">
        <span className="bg-blue-50 border border-blue-300 px-4 py-1.5">
          {job.location}
        </span>
        <span className="bg-red-50 border border-red-200 px-4 py-1.5">
          {job.level}
        </span>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        {description.slice(0, 150)}
        {description.length > 150 ? "..." : ""}
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        <button
          onClick={openJob}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Apply Now
        </button>
        <button
          onClick={openJob}
          className="text-gray-500 py-2 px-4 border border-gray-500 rounded"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default JobCard;
