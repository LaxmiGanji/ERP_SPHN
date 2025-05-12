import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-100 shadow-md border-b border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVSz_mfjID4esb-MR0jWO584NqYdriBbzBfg&s"
              alt="Logo"
              className="h-12 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-gray-800">Sphoorthy Engineering College</span>
              <span className="text-sm text-gray-500">Acadamics</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button
              className="text-gray-900 font-semibold flex items-center space-x-2 text-lg"
              onClick={() => navigate("/")}
            >
              <RxDashboard className="text-gray-700 text-2xl" />
              <span>{router.state && router.state.type} Dashboard</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center px-5 py-2 text-sm font-semibold rounded bg-red-600 text-white hover:bg-red-700 focus:outline-none"
              onClick={() => navigate("/")}
            >
              Logout
              <FiLogOut className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
