import { assets } from "../assets/assets";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../contex/AppContex";
import React, { useContext } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const {
    companyData,
    setCompanyData,
    setCompanyToken,
  } = useContext(AppContext);

  // =====================================
  // COMPANY LOGOUT
  // =====================================

  const logout = () => {
    setCompanyToken(null);
    setCompanyData(null);

    localStorage.removeItem("companyToken");

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}

      <div className="bg-white shadow border-b">
        <div className="flex items-center justify-between px-6 py-4">

          <img
            src={assets.logo}
            alt="Logo"
            onClick={() => navigate("/")}
            className="h-10 cursor-pointer"
          />

          {companyData && (
            <div className="flex items-center gap-4">

              <p className="hidden sm:block font-medium">
                Welcome, {companyData.name}
              </p>

              {/* PROFILE DROPDOWN */}

              <div className="relative group">

                {/* PROFILE IMAGE */}

                <img
                  src={companyData.image}
                  alt="Company"
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                />

                {/* DROPDOWN */}

                <div
                  className="
                    absolute
                    right-0
                    top-full
                    pt-2
                    hidden
                    group-hover:block
                    z-50
                  "
                >
                  <div className="w-32 bg-white border rounded-lg shadow-lg overflow-hidden">

                    <button
                      onClick={logout}
                      className="
                        w-full
                        text-left
                        px-5
                        py-3
                        hover:bg-gray-100
                        cursor-pointer
                      "
                    >
                      Logout
                    </button>

                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      </div>


      {/* DASHBOARD BODY */}

      <div className="flex">

        {/* SIDEBAR */}

        <div className="w-64 min-h-[calc(100vh-72px)] border-r bg-white">

          {/* ADD JOB */}

          <NavLink
            to="add-job"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-100 border-r-4 border-blue-600 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <img
              src={assets.add_icon}
              alt=""
              className="min-w-4"
            />

            <p className="max-sm:hidden">
              Add Job
            </p>
          </NavLink>


          {/* MANAGE JOBS */}

          <NavLink
            to="manage-jobs"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-100 border-r-4 border-blue-600 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <img
              src={assets.home_icon}
              alt=""
              className="min-w-4"
            />

            <p className="max-sm:hidden">
              Manage Jobs
            </p>
          </NavLink>


          {/* VIEW APPLICATIONS */}

          <NavLink
            to="view-applications"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-4 transition ${
                isActive
                  ? "bg-blue-100 border-r-4 border-blue-600 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`
            }
          >
            <img
              src={assets.person_tick_icon}
              alt=""
              className="min-w-4"
            />

            <p className="max-sm:hidden">
              View Applications
            </p>
          </NavLink>

        </div>


        {/* RIGHT SIDE CONTENT */}

        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default Dashboard;