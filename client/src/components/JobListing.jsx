import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../contex/AppContex";
import { assets, JobCategories, JobLocations } from "../assets/assets";
import JobCard from "./JobCard";

const JobListing = () => {
  const {
    jobs,
    jobsLoading,
    isSearched,
    searchFilter,
    setSearchFilter,
  } = useContext(AppContext);

  const [showFilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // ⭐ ADDED
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Handle Category Filter
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Handle Location Filter
  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  // ⭐ ADDED FILTER LOGIC
  useEffect(() => {
    const matchCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(job.category);

    const matchLocation = (job) => {
      if (selectedLocations.length === 0) return true;

      return selectedLocations.some((loc) => {
        const jobLocation = String(job.location || "").toLowerCase();

        if (loc === "Remote") {
          return (
            job.source === "jobicy" ||
            jobLocation.includes("remote") ||
            jobLocation.includes("anywhere") ||
            jobLocation.includes("worldwide")
          );
        }

        return job.location === loc;
      });
    };

    const matchTitle = (job) =>
      searchFilter.title === "" ||
      String(job.title || "")
        .toLowerCase()
        .includes(searchFilter.title.toLowerCase());

    const matchSearchLocation = (job) =>
      searchFilter.location === "" ||
      String(job.location || "")
        .toLowerCase()
        .includes(searchFilter.location.toLowerCase());

    const newFilteredJobs = jobs
      .filter(
        (job) =>
          matchCategory(job) &&
          matchLocation(job) &&
          matchTitle(job) &&
          matchSearchLocation(job)
      )
      .sort((a, b) => (b.date || 0) - (a.date || 0));

    setFilteredJobs(newFilteredJobs);
    setCurrentPage(1);
  }, [
    jobs,
    selectedCategories,
    selectedLocations,
    searchFilter,
  ]);

  // ⭐ CHANGED (Pagination uses filteredJobs)
  const jobsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const lastJobIndex = currentPage * jobsPerPage;
  const firstJobIndex = lastJobIndex - jobsPerPage;

  // ⭐ CHANGED
  const currentJobs = filteredJobs.slice(
    firstJobIndex,
    lastJobIndex
  );

  return (
    <div className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row gap-8 py-8">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4">

        {/* Current Search */}
        {isSearched &&
          (searchFilter.title !== "" ||
            searchFilter.location !== "") && (
            <>
              <h3 className="font-medium text-lg mb-4">
                Current Search
              </h3>

              <div className="flex flex-wrap gap-2 mb-5">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded px-4 py-1.5">
                    {searchFilter.title}

                    <img
                      src={assets.cross_icon}
                      alt=""
                      className="cursor-pointer"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          title: "",
                        }))
                      }
                    />
                  </span>
                )}

                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded px-4 py-1.5">
                    {searchFilter.location}

                    <img
                      src={assets.cross_icon}
                      alt=""
                      className="cursor-pointer"
                      onClick={() =>
                        setSearchFilter((prev) => ({
                          ...prev,
                          location: "",
                        }))
                      }
                    />
                  </span>
                )}
              </div>
            </>
          )}

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="lg:hidden border border-gray-400 rounded px-5 py-2 mb-4"
        >
          {showFilter ? "Close Filters" : "Show Filters"}
        </button>

        {/* Categories */}
        <div className={`${showFilter ? "block" : "hidden"} lg:block`}>
          <h4 className="font-semibold text-lg mb-4">
            Search by Categories
          </h4>

          <ul className="space-y-3 text-gray-600">
            {JobCategories.map((category, index) => (
              <li
                key={index}
                className="flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(
                    category
                  )}
                  onChange={() =>
                    handleCategoryChange(category)
                  }
                />
                <span>{category}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div
          className={`${showFilter ? "block" : "hidden"} lg:block mt-8`}
        >
          <h4 className="font-semibold text-lg mb-4">
            Search by Location
          </h4>

          <ul className="space-y-3 text-gray-600">
            {JobLocations.map((location, index) => (
              <li
                key={index}
                className="flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={selectedLocations.includes(
                    location
                  )}
                  onChange={() =>
                    handleLocationChange(location)
                  }
                />
                <span>{location}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Listing */}
      <section className="w-full lg:w-3/4">
        <h2 className="text-3xl font-bold">
          Latest Jobs
        </h2>

        <p className="text-gray-500 mt-2 mb-8">
          Get your desired job from top companies
        </p>

        {/* ⭐ USING FILTERED JOBS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobsLoading ? (
            <div className="col-span-full text-center py-10">
              Loading jobs...
            </div>
          ) : currentJobs.length > 0 ? (
            currentJobs.map((job, index) => (
              <JobCard
                key={job._id || index}
                job={job}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              No Jobs Found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="border rounded p-2"
            >
              <img
                src={assets.left_arrow_icon}
                alt=""
                className="w-4"
              />
            </button>

            {Array.from({ length: totalPages }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`w-10 h-10 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "border"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="border rounded p-2"
            >
              <img
                src={assets.right_arrow_icon}
                alt=""
                className="w-4"
              />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default JobListing;