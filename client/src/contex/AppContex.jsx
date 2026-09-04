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


export const AppContext = createContext();


const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const AppContexProvider = ({ children }) => {

  // ==========================================
  // CLERK
  // ==========================================

  const { user, isLoaded } = useUser();

  const { getToken } = useAuth();


  // ==========================================
  // JOBS
  // ==========================================

  const [jobs, setJobs] = useState([]);

  const [jobsLoading, setJobsLoading] =
    useState(true);


  // ==========================================
  // USER DATA
  // ==========================================

  const [userData, setUserData] =
    useState(null);


  // ==========================================
  // USER APPLICATIONS
  // ==========================================

  const [
    userApplications,
    setUserApplications,
  ] = useState([]);


  // ==========================================
  // SEARCH FILTER
  // ==========================================

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


  // ==========================================
  // RECRUITER LOGIN
  // ==========================================

  const [
    showRecruiterLogin,
    setShowRecruiterLogin,
  ] = useState(false);


  // ==========================================
  // COMPANY AUTH
  // ==========================================

  const [
    companyToken,
    setCompanyToken,
  ] = useState(null);

  const [
    companyData,
    setCompanyData,
  ] = useState(null);


  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {

    try {

      if (!backendUrl) {

        console.log(
          "❌ VITE_BACKEND_URL is missing"
        );

        toast.error(
          "Backend URL is not configured"
        );

        return;
      }


      const { data } = await axios.get(
        `${backendUrl}/api/jobs`
      );


      console.log(
        "JOBS API RESPONSE:",
        data
      );


      if (data.success) {

        setJobs(
          data.jobs || []
        );

      } else {

        toast.error(
          data.message ||
          "Failed to load jobs"
        );

      }

    } catch (error) {

      console.log(
        "Jobs Error:",
        error.response?.data ||
        error.message
      );


      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to load jobs"
      );

    } finally {

      setJobsLoading(false);

    }

  };


  // ==========================================
  // FETCH USER DATA
  // ==========================================

  const fetchUserData = async () => {

    try {

      console.log(
        "🔄 Getting Clerk token for user data..."
      );


      const token =
        await getToken();


      console.log(
        "CLERK TOKEN EXISTS:",
        !!token
      );


      if (!token) {

        console.log(
          "❌ TOKEN IS NULL"
        );

        return;

      }


      const { data } =
        await axios.get(

          `${backendUrl}/api/users/user`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );


      console.log(
        "USER API RESPONSE:",
        data
      );


      if (data.success) {

        setUserData(
          data.user
        );

      } else {

        console.log(
          "❌ USER API FAILED:",
          data.message
        );

      }

    } catch (error) {

      console.log(
        "❌ USER DATA ERROR:",
        error.response?.data ||
        error.message
      );

    }

  };


  // ==========================================
  // FETCH USER APPLICATIONS
  // ==========================================

  const fetchUserApplications =
    async () => {

      try {

        console.log(
          "🔄 Getting Clerk token for applications..."
        );


        const token =
          await getToken();


        console.log(
          "CLERK TOKEN EXISTS FOR APPLICATIONS:",
          !!token
        );


        if (!token) {

          console.log(
            "❌ TOKEN IS NULL"
          );

          return;

        }


        const { data } =
          await axios.get(

            `${backendUrl}/api/users/applications`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        console.log(
          "APPLICATIONS API RESPONSE:",
          data
        );


        if (data.success) {

          setUserApplications(
            data.applications || []
          );

        } else {

          console.log(
            "❌ APPLICATIONS API FAILED:",
            data.message
          );

        }

      } catch (error) {

        console.log(
          "❌ APPLICATIONS ERROR:",
          error.response?.data ||
          error.message
        );

      }

    };


  // ==========================================
  // FETCH COMPANY DATA
  // ==========================================

  const fetchCompanyData =
    async () => {

      try {

        if (!companyToken) {

          return;

        }


        const { data } =
          await axios.get(

            `${backendUrl}/api/company/company`,

            {
              headers: {
                token:
                  companyToken,
              },
            }

          );


        console.log(
          "COMPANY API RESPONSE:",
          data
        );


        if (data.success) {

          setCompanyData(
            data.company
          );

        } else {

          setCompanyToken(
            null
          );

          setCompanyData(
            null
          );


          localStorage.removeItem(
            "companyToken"
          );

        }

      } catch (error) {

        console.log(
          "❌ COMPANY DATA ERROR:",
          error.response?.data ||
          error.message
        );

      }

    };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    fetchJobs();


    const storedCompanyToken =
      localStorage.getItem(
        "companyToken"
      );


    if (storedCompanyToken) {

      setCompanyToken(
        storedCompanyToken
      );

    }

  }, []);


  // ==========================================
  // FETCH COMPANY DATA
  // ==========================================

  useEffect(() => {

    if (companyToken) {

      fetchCompanyData();

    } else {

      setCompanyData(
        null
      );

    }

  }, [companyToken]);


  // ==========================================
  // FETCH USER DATA AFTER CLERK LOADS
  // ==========================================

  useEffect(() => {

    console.log(
      "CLERK STATUS:",
      {
        isLoaded,
        isLoggedIn: !!user,
      }
    );


    if (
      isLoaded &&
      user
    ) {

      fetchUserData();

      fetchUserApplications();

    }


    if (
      isLoaded &&
      !user
    ) {

      setUserData(
        null
      );

      setUserApplications(
        []
      );

    }

  }, [
    user,
    isLoaded
  ]);


  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {

    // Backend
    backendUrl,


    // Jobs
    jobs,
    setJobs,
    fetchJobs,
    jobsLoading,


    // User
    userData,
    setUserData,
    fetchUserData,


    // Applications
    userApplications,
    setUserApplications,
    fetchUserApplications,


    // Search
    searchFilter,
    setSearchFilter,

    isSearched,
    setIsSearched,


    // Recruiter Login
    showRecruiterLogin,
    setShowRecruiterLogin,


    // Company
    companyToken,
    setCompanyToken,

    companyData,
    setCompanyData,

    fetchCompanyData,

  };


  return (

    <AppContext.Provider
      value={value}
    >

      {children}

    </AppContext.Provider>

  );

};