import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../contex/AppContex";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beginner Level");
  const [salary, setSalary] = useState("");

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { backendUrl, companyToken, fetchJobs } = useContext(AppContext);

  // Initialize Quill Editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write job description...",
      });
    }
  }, []);

  // Submit Job
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (!companyToken) {
        toast.error("Please login as a company first");
        return;
      }

      const description = quillRef.current.root.innerHTML;

      if (
        description === "<p><br></p>" ||
        !description.trim()
      ) {
        toast.error("Please enter job description");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/company/post-job",
        {
          title,
          description,
          location,
          salary: Number(salary),
          category,
          level,
        },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Job posted successfully");
        fetchJobs();

        // Reset form
        setTitle("");
        setSalary("");

        if (quillRef.current) {
          quillRef.current.setText("");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Failed to post job"
      );
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="container p-4 flex flex-col w-full items-start gap-3"
    >
      {/* Job Title */}
      <div className="w-full">
        <p className="mb-2">Job Title</p>

        <input
          type="text"
          placeholder="Type here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
        />
      </div>

      {/* Job Description */}
      <div className="w-full max-w-lg">
        <p className="my-2">Job Description</p>

        <div
          ref={editorRef}
          style={{
            height: "200px",
            marginBottom: "20px",
          }}
        />
      </div>

      {/* Category, Location and Level */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">

        {/* Category */}
        <div>
          <p className="mb-2">Job Category</p>

          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {JobCategories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <p className="mb-2">Job Location</p>

          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            {JobLocations.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <p className="mb-2">Job Level</p>

          <select
            className="w-full px-3 py-2 border-2 border-gray-300 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="Beginner Level">
              Beginner Level
            </option>

            <option value="Intermediate Level">
              Intermediate Level
            </option>

            <option value="Senior Level">
              Senior Level
            </option>
          </select>
        </div>

      </div>

      {/* Salary */}
      <div>
        <p className="mb-2">Salary</p>

        <input
          min="0"
          required
          className="w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]"
          type="number"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Enter salary"
        />
      </div>

      {/* Submit Button */}
      <button
        className="w-28 py-3 mt-1 bg-black text-white rounded"
        type="submit"
      >
        Add Job
      </button>

    </form>
  );
};

export default AddJob;