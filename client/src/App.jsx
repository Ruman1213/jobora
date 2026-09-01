import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "quill/dist/quill.snow.css";

import Home from "./pages/Home";
import ApplyJob from "./pages/Applyjob";
import Application from "./pages/Application";

import RecruiterLogin from "./components/RecruiterLogin";

import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AppContext } from "./contex/AppContex";

function App() {
  const {
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
  } = useContext(AppContext);

  return (
    <div>

      {/* Recruiter Login Modal */}
      {showRecruiterLogin && (
        <RecruiterLogin
          onClose={() => setShowRecruiterLogin(false)}
        />
      )}

      {/* Toast Messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <Routes>

        {/* USER ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/apply-job/:id"
          element={<ApplyJob />}
        />

        <Route
          path="/application"
          element={<Application />}
        />

        <Route
          path="/applications"
          element={<Application />}
        />


        {/* RECRUITER DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            companyToken
              ? <Dashboard />
              : <Navigate to="/" replace />
          }
        >

          {/* Default Dashboard Page */}
          <Route
            index
            element={<Navigate to="add-job" replace />}
          />

          <Route
            path="add-job"
            element={<AddJob />}
          />

          <Route
            path="manage-jobs"
            element={<ManageJobs />}
          />

          <Route
            path="view-applications"
            element={<ViewApplications />}
          />

        </Route>


        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </div>
  );
}

export default App;