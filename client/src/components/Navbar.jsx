import React, { useContext } from "react";
import { AppContext } from "../contex/AppContex";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const navigate = useNavigate();

  const { setShowRecruiterLogin } = useContext(AppContext);

  return (
    <nav className="bg-white shadow-sm py-3">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">

        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer w-40 sm:w-44 md:w-48 h-auto object-contain"
          src={assets.newlogo}
          alt="Jobora Logo"
        />

        {/* Right Side */}
        <div className="flex gap-4 items-center max-sm:text-xs">

          {user ? (
            <>
              <Link
                to="/application"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Applied Jobs
              </Link>

              <UserButton />
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRecruiterLogin(true)}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Recruiter Login
              </button>

              <button
                onClick={() => openSignIn()}
                className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 sm:px-9 py-2 rounded-full"
              >
                Login
              </button>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;