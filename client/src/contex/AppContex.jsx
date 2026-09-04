import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useUser,
  useAuth,
} from "@clerk/clerk-react";

import axios from "axios";
import { toast } from "react-toastify";


// ==========================================
// CREATE CONTEXT
// ==========================================

export const AppContext = createContext();


// ==========================================
// BACKEND URL
// ==========================================

const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");


// ==========================================
// CONTEXT PROVIDER
// ==========================================

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
  // CHECK BACKEND URL
  // ==========================================

  useEffect(() => {

    if (!backendUrl) {

      console.error(
        "❌ VITE_BACKEND_URL is missing"
      );

      return;

    }

    console.log(
      "✅ Backend URL:",
      backendUrl
    );

  }, []);


  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = useCallback(async () => {

    if (!backendUrl) {

      console.error(
        "❌ VITE_BACKEND_URL is missing"
      );

      setJobsLoading(false);

      return;

    }

    try {

      setJobsLoading(true);


      const { data } =
        await axios.get(
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

      console.error(
        "❌ JOBS ERROR:",
        error.response?.data ||
        error.message
      );


      toast.error(
        error.response?.data?.message ||
        "Failed to load jobs"
      );

    } finally {

      setJobsLoading(false);

    }

  }, []);


  // ==========================================
  // FETCH USER DATA
  // ==========================================

  const fetchUserData =
    useCallback(async () => {

      if (!backendUrl) {

        console.error(
          "❌ VITE_BACKEND_URL is missing"
        );

        return;

      }


      if (!isLoaded || !user) {

        return;

      }


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

          console.error(
            "❌ Clerk token is null"
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

          console.error(
            "❌ USER API FAILED:",
            data.message
          );

        }

      } catch (error) {

        console.error(
          "❌ USER DATA ERROR:",
          error.response?.data ||
          error.message
        );

      }

    }, [
      getToken,
      isLoaded,
      user,
    ]);


  // ==========================================
  // FETCH USER APPLICATIONS
  // ==========================================

  const fetchUserApplications =
    useCallback(async () => {

      if (!backendUrl) {

        console.error(
          "❌ VITE_BACKEND_URL is missing"
        );

        return;

      }


      if (!isLoaded || !user) {

        return;

      }


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

          console.error(
            "❌ Clerk token is null"
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

          console.error(
            "❌ APPLICATIONS API FAILED:",
            data.message
          );

        }

      } catch (error) {

        console.error(
          "❌ APPLICATIONS ERROR:",
          error.response?.data ||
          error.message
        );

      }

    }, [
      getToken,
      isLoaded,
      user,
    ]);


  // ==========================================
  // FETCH COMPANY DATA
  // ==========================================

  const fetchCompanyData =
    useCallback(async () => {

      if (!backendUrl) {

        console.error(
          "❌ VITE_BACKEND_URL is missing"
        );

        return;

      }


      if (!companyToken) {

        return;

      }


      try {

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

        console.error(
          "❌ COMPANY DATA ERROR:",
          error.response?.data ||
          error.message
        );

      }

    }, [
      companyToken,
    ]);


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

  }, [
    fetchJobs,
  ]);


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

  }, [
    companyToken,
    fetchCompanyData,
  ]);


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
      !isLoaded
    ) {

      return;

    }


    if (user) {

      fetchUserData();

      fetchUserApplications();

    } else {

      setUserData(
        null
      );


      setUserApplications(
        []
      );

    }

  }, [
    user,
    isLoaded,
    fetchUserData,
    fetchUserApplications,
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