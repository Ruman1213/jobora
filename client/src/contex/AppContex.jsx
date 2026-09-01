import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import axios from "axios";

import { toast } from "react-toastify";


export const AppContext =
  createContext();


const backendUrl =
  import.meta.env.VITE_BACKEND_URL;


export const AppContexProvider = ({
  children,
}) => {

  const { user, isLoaded } =
    useUser();

  const { getToken } =
    useAuth();


  const [jobs, setJobs] =
    useState([]);

  const [jobsLoading, setJobsLoading] =
    useState(true);

  const [userData, setUserData] =
    useState(null);

  const [
    userApplications,
    setUserApplications,
  ] = useState([]);

  const [
    searchFilter,
    setSearchFilter,
  ] = useState({
    title: "",
    location: "",
  });

  const [
    isSearched,
    setIsSearched,
  ] = useState(false);

  const [
    showRecruiterLogin,
    setShowRecruiterLogin,
  ] = useState(false);

  const [
    companyToken,
    setCompanyToken,
  ] = useState(null);

  const [
    companyData,
    setCompanyData,
  ] = useState(null);


  const fetchJobs = async () => {
    try {
      if (!backendUrl) {
        toast.error("Backend URL is not configured");
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/jobs`
      );

      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        toast.error(data.message || "Failed to load jobs");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to load jobs"
      );
    } finally {
      setJobsLoading(false);
    }
  };


  const fetchUserData = async () => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/users/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      console.log(
        "User Data Error:",
        error.response?.data ||
        error.message
      );
    }
  };


  const fetchUserApplications = async () => {
    try {
      const token = await getToken();

      if (!token) {
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/users/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setUserApplications(data.applications || []);
      }
    } catch (error) {
      console.log(
        "Applications Error:",
        error.response?.data ||
        error.message
      );
    }
  };


  const fetchCompanyData = async () => {
    try {
      if (!companyToken) {
        return;
      }

      const { data } = await axios.get(
        `${backendUrl}/api/company/company`,
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        setCompanyData(data.company);
      } else {
        setCompanyToken(null);
        setCompanyData(null);
        localStorage.removeItem("companyToken");
      }
    } catch (error) {
      console.log(
        "Company Data Error:",
        error.response?.data ||
        error.message
      );
    }
  };


  useEffect(() => {
    fetchJobs();

    const storedCompanyToken =
      localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }
  }, []);


  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);


  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
      fetchUserApplications();
    } else if (isLoaded && !user) {
      setUserData(null);
      setUserApplications([]);
    }
  }, [user, isLoaded]);


  const value = {
    backendUrl,

    jobs,
    setJobs,
    fetchJobs,
    jobsLoading,

    userData,
    setUserData,
    fetchUserData,

    userApplications,
    setUserApplications,
    fetchUserApplications,

    searchFilter,
    setSearchFilter,

    isSearched,
    setIsSearched,

    showRecruiterLogin,
    setShowRecruiterLogin,

    companyToken,
    setCompanyToken,

    companyData,
    setCompanyData,
  };


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
