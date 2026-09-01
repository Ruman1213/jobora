import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";
import { AppContext } from "../contex/AppContex";

const Application = () => {
  const { getToken } = useAuth();

  const {
    backendUrl,
    userData,
    fetchUserData,
    userApplications,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!resume) {
      toast.error("Please select a resume first.");
      return;
    }

    try {
      setSaving(true);

      const token = await getToken();
      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
        setIsEdit(false);
        setResume(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to upload resume"
      );
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = (status = "") => {
    const value = String(status).toLowerCase();
    if (value === "accepted") return "Accepted";
    if (value === "rejected") return "Rejected";
    return "Pending";
  };

  return (
    <>
      <Navbar />

      <div className="container px-4 2xl:px-20 mx-auto my-10 min-h-[65vh]">

        <h2 className="text-2xl font-semibold mb-4">
          Your Resume
        </h2>

        <div className="flex gap-4 items-center mb-10 flex-wrap">

          {isEdit ? (
            <>
              <label
                htmlFor="resumeUpload"
                className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer"
              >
                <img
                  src={
                    resume
                      ? assets.resume_selected
                      : assets.resume_not_selected
                  }
                  alt=""
                  className="w-8"
                />

                <span>
                  {resume ? resume.name : "Select Resume"}
                </span>

                <input
                  id="resumeUpload"
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              {userData?.resume ? (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  View Resume
                </a>
              ) : (
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                  No Resume
                </button>
              )}

              <button
                onClick={() => setIsEdit(true)}
                className="border border-gray-400 px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Edit
              </button>
            </>
          )}

        </div>

        <h2 className="text-2xl font-semibold mb-4">
          Jobs Applied
        </h2>

        <div className="overflow-x-auto">

          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">

            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Job Title</th>
                <th className="py-3 px-4 text-left max-sm:hidden">
                  Location
                </th>
                <th className="py-3 px-4 text-left max-sm:hidden">
                  Date
                </th>
                <th className="py-3 px-4 text-left">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {userApplications.length > 0 ? (
                userApplications.map((app) => {
                  const status = statusLabel(app.status);

                  return (
                    <tr
                      key={app._id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={app.companyId?.image || assets.company_icon}
                          alt={app.companyId?.name}
                          className="w-10 h-10 object-contain"
                        />
                        {app.companyId?.name}
                      </td>

                      <td className="py-4 px-4">
                        {app.jobId?.title}
                      </td>

                      <td className="py-4 px-4 max-sm:hidden">
                        {app.jobId?.location}
                      </td>

                      <td className="py-4 px-4 max-sm:hidden">
                        {moment(app.date).fromNow()}
                      </td>

                      <td className="py-4 px-4">
                        {status === "Accepted" ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            Accepted
                          </span>
                        ) : status === "Rejected" ? (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            Rejected
                          </span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
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
    </>
  );
};

export default Application;
