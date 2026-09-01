import React, { useEffect, useState, useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../contex/AppContex";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterLogin = ({ onClose }) => {
    const navigate = useNavigate();

    const {
        setShowRecruiterLogin,
        backendUrl,
        setCompanyToken,
        setCompanyData
    } = useContext(AppContext);

    const [state, setState] = useState("Login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);

    const [isTextDataSubmitted, setIsTextDataSubmitted] = useState(false);

    // =========================
    // SUBMIT
    // =========================

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // =========================
        // LOGIN
        // =========================

        if (state === "Login") {
            try {
                if (!email || !password) {
                    toast.error("Please enter email and password");
                    return;
                }

                const { data } = await axios.post(
                    backendUrl + "/api/company/login",
                    {
                        email,
                        password
                    }
                );

                console.log("Login response:", data);

                if (data.success) {
                    toast.success("Login successful");

                    setCompanyData(data.company);
                    setCompanyToken(data.token);

                    localStorage.setItem(
                        "companyToken",
                        data.token
                    );

                    setShowRecruiterLogin(false);

                    navigate("/dashboard");
                } else {
                    toast.error(data.message);
                }

            } catch (error) {
                console.log("Login error:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Something went wrong"
                );
            }

            return;
        }

        // =========================
        // SIGN UP STEP 1
        // =========================

        if (!isTextDataSubmitted) {
            if (!name || !email || !password) {
                toast.error("Please fill all the details");
                return;
            }

            setIsTextDataSubmitted(true);
            return;
        }

        // =========================
        // SIGN UP STEP 2
        // =========================

        if (!image) {
            toast.error("Please upload company logo");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("image", image);

            const { data } = await axios.post(
                backendUrl + "/api/company/register",
                formData
            );

            console.log("Register response:", data);

            if (data.success) {
                toast.success("Company registered successfully");

                setCompanyData(data.company);
                setCompanyToken(data.token);

                localStorage.setItem(
                    "companyToken",
                    data.token
                );

                setShowRecruiterLogin(false);

                navigate("/dashboard");
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log("Registration error:", error);

            toast.error(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    // =========================
    // BODY SCROLL
    // =========================

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // =========================
    // SWITCH LOGIN / SIGNUP
    // =========================

    const switchState = () => {
        setState(state === "Login" ? "Sign Up" : "Login");

        setName("");
        setEmail("");
        setPassword("");
        setImage(null);
        setIsTextDataSubmitted(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">

            <form
                onSubmit={onSubmitHandler}
                className="bg-white w-[430px] rounded-xl shadow-2xl p-8 relative"
            >

                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-center">
                    Recruiter {state}
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-6">
                    {state === "Login"
                        ? "Welcome back! Login to continue."
                        : "Create your recruiter account."
                    }
                </p>

                {/* =========================
                    SIGNUP NAME
                ========================= */}

                {state === "Sign Up" && !isTextDataSubmitted && (
                    <div className="flex items-center border rounded-lg px-3 py-2 mb-4">

                        <img
                            src={assets.person_icon}
                            className="w-5 mr-2"
                            alt=""
                        />

                        <input
                            type="text"
                            placeholder="Company Name"
                            className="w-full outline-none"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>
                )}

                {/* =========================
                    EMAIL + PASSWORD
                ========================= */}

                {!isTextDataSubmitted && (
                    <>
                        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">

                            <img
                                src={assets.email_icon}
                                className="w-5 mr-2"
                                alt=""
                            />

                            <input
                                type="email"
                                placeholder="Company Email"
                                className="w-full outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                        </div>

                        <div className="flex items-center border rounded-lg px-3 py-2 mb-2">

                            <img
                                src={assets.lock_icon}
                                className="w-5 mr-2"
                                alt=""
                            />

                            <input
                                type="password"
                                placeholder="Company Password"
                                className="w-full outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                        </div>
                    </>
                )}

                {/* =========================
                    COMPANY LOGO
                ========================= */}

                {state === "Sign Up" && isTextDataSubmitted && (
                    <div className="text-center">

                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 mx-auto mb-5">

                            <img
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : assets.upload_area
                                }
                                className="w-full h-full object-cover"
                                alt=""
                            />

                        </div>

                        <label
                            htmlFor="logo"
                            className="cursor-pointer inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-lg font-medium"
                        >
                            Upload Company Logo
                        </label>

                        <input
                            id="logo"
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImage(e.target.files[0])
                            }
                        />

                        {image && (
                            <p className="text-green-600 mt-3 font-semibold">
                                ✓ Logo Selected
                            </p>
                        )}

                        <div className="bg-green-100 border border-green-400 rounded-lg p-4 mt-6">

                            <h2 className="text-green-700 text-xl font-bold">
                                Welcome {name}
                            </h2>

                            <p className="text-gray-600 mt-2">
                                Upload your company logo to complete registration.
                            </p>

                        </div>

                    </div>
                )}

                {/* Forgot Password */}

                {state === "Login" && (
                    <div className="text-right mt-2 mb-5">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            Forgot Password?
                        </button>
                    </div>
                )}

                {/* Submit */}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mt-4"
                >
                    {state === "Login"
                        ? "Login"
                        : isTextDataSubmitted
                            ? "Create Account"
                            : "Next"
                    }
                </button>

                {/* Switch */}

                {!isTextDataSubmitted && (
                    <p className="text-center mt-5 text-sm">

                        {state === "Login" ? (
                            <>
                                Don't have an account?{" "}
                                <span
                                    onClick={switchState}
                                    className="text-blue-600 cursor-pointer font-semibold"
                                >
                                    Sign Up
                                </span>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <span
                                    onClick={switchState}
                                    className="text-blue-600 cursor-pointer font-semibold"
                                >
                                    Login
                                </span>
                            </>
                        )}

                    </p>
                )}

            </form>
        </div>
    );
};

export default RecruiterLogin;