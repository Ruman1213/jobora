import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contex/AppContex";

const Hero = () => {
  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const onSearch = () => {
    setSearchFilter({
      title: titleRef.current.value,
      location: locationRef.current.value,
    });

    setIsSearched(true);
  };

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-sky-600 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Over 1000+ jobs are waiting for you. Find your dream job now!
        </h2>

        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Discover the perfect opportunity that matches your skills and career
          goals.
        </p>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white rounded-lg text-gray-600 max-w-3xl mx-auto p-4">
          {/* Job Search */}
          <div className="flex items-center border rounded-md px-3 py-2 flex-1 w-full">
            <img
              src={assets.search_icon}
              alt="Search"
              className="w-5 h-5 mr-2"
            />
            <input
              ref={titleRef}
              type="text"
              placeholder="Search for jobs..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* Location Search */}
          <div className="flex items-center border rounded-md px-3 py-2 flex-1 w-full">
            <img
              src={assets.location_icon}
              alt="Location"
              className="w-5 h-5 mr-2"
            />
            <input
              ref={locationRef}
              type="text"
              placeholder="Search by location..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-full sm:w-auto"
          >
            Search
          </button>
        </div>
      </div>

      {/* Trusted By */}
      <div className="border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md">
        <div className="flex items-center justify-center gap-8 lg:gap-12 flex-wrap">
          <p className="font-medium text-gray-600">Trusted By</p>

          <img className="h-6" src={assets.microsoft_logo} alt="Microsoft" />
          <img className="h-6" src={assets.accenture_logo} alt="Accenture" />
          <img className="h-6" src={assets.amazon_logo} alt="Amazon" />
          <img className="h-6" src={assets.adobe_logo} alt="Adobe" />
          <img className="h-6" src={assets.samsung_logo} alt="Samsung" />
          <img className="h-6" src={assets.walmart_logo} alt="Walmart" />
          <img className="h-6" src={assets.salesforce_logo} alt="Salesforce" />
        </div>
      </div>
    </div>
  );
};

export default Hero;