import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";

const Login = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.loginid !== "" && data.password !== "") {
      const headers = {
        "Content-Type": "application/json",
      };
      axios
        .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, data, {
          headers: headers,
        })
        .then((response) => {
          navigate(`/${selected.toLowerCase()}`, {
            state: { type: selected, loginid: response.data.loginid },
          });
        })
        .catch((error) => {
          toast.dismiss();
          console.error(error);
          toast.error(error.response.data.message);
        });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-r from-blue-700 to-blue-500">
      {/* Left Panel with Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-700 p-12 flex-col justify-between items-center">
        <div className="flex flex-col items-center text-white">
          {/* Logo Section */}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVSz_mfjID4esb-MR0jWO584NqYdriBbzBfg&s" // Replace with your actual logo URL
            alt="College Logo"
            className="h-32 w-auto mb-6"
          />
          <h1 className="text-4xl font-extrabold mb-2 animate__animated animate__fadeIn">
            Sphoorthy Engineering College
          </h1>
          <p className="text-lg text-blue-100 animate__animated animate__fadeIn animate__delay-1s">
            Academic Dashboard
          </p>
        </div>
        <div className="relative">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-16 w-64 h-64 bg-blue-500 rounded-full opacity-30 animate__animated animate__zoomIn" />
          <div className="absolute -bottom-16 -left-16 w-96 h-96 bg-blue-500 rounded-full opacity-30 animate__animated animate__zoomIn animate__delay-1s" />
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-300 hover:scale-105">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-500 mt-2">Please login to access your Dashboard</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selected} Login ID
                </label>
                <input
                  type="text"
                  {...register("loginid")}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:shadow-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:shadow-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium transform hover:scale-105"
              >
                <span>Sign In</span>
                <FiLogIn className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-8 flex justify-center space-x-6">
              {["Student", "Faculty", "Admin", "Library"].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelected(role)}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                    selected === role
                      ? "bg-blue-100 text-blue-600 font-medium transform hover:scale-110"
                      : "text-gray-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
