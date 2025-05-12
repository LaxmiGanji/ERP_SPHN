import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";

const AddLibrary = () => {
    const [data, setData] = useState({
        libraryId: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: ""
      });

      const addLibraryProfile = (e) => {
        e.preventDefault();
        if (!data.libraryId || !data.firstName || !data.lastName || !data.email || !data.phoneNumber || !data.gender) {
            toast.error("Please fill in all fields");
            return;
        }
    
        toast.loading("Adding Librarian");
    
        axios
            .post(`${baseApiURL()}/library/details/addDetails`, data) // Send JSON instead of FormData
            .then((response) => {
                toast.dismiss();
                if (response.data.success) {
                    toast.success(response.data.message);
                    // Register the librarian for authentication
                    axios
                        .post(`${baseApiURL()}/library/auth/register`, {
                            loginid: data.libraryId,
                            password: data.libraryId,
                        })
                        .then((res) => {
                            if (res.data.success) {
                                toast.success(res.data.message);
                                resetForm();
                            } else {
                                toast.error(res.data.message);
                            }
                        })
                        .catch((error) => {
                            toast.error(error.response?.data?.message || "An error occurred while registering.");
                        });
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                toast.dismiss();
                toast.error(error.response?.data?.message || "An error occurred while adding librarian.");
            });
    };
    

      const resetForm = () => {
        setData({
          libraryId: "",
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          gender: ""
        });
      };
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* Centering the content vertically and horizontally */}
      <form
        onSubmit={addLibraryProfile}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-10 transition-all duration-300 ease-in-out transform hover:shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Add New Librarian</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/** Form Fields */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              value={data.firstName}
              onChange={(e) => setData({ ...data, firstName: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={data.lastName}
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="libraryId" className="block text-sm font-medium text-gray-600">
              Library Id
            </label>
            <input
              type="number"
              id="libraryId"
              value={data.libraryId}
              onChange={(e) => setData({ ...data, libraryId: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              value={data.phoneNumber}
              onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
              Gender
            </label>
            <select
              id="gender"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Librarian
        </button>
      </form>
    </div>
  )
}

export default AddLibrary