import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import { FiUpload } from "react-icons/fi";


const AddStudent = () => {
  const [file, setFile] = useState();
  const [branch, setBranch] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [data, setData] = useState({
    enrollmentNo: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    semester: "",
    branch: "",
    gender: "",
  });

  const getBranchData = () => {
    axios
      .get(`${baseApiURL()}/branch/getBranch`)
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getBranchData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    console.log(imageUrl);
    setPreviewImage(imageUrl);
  };

  const addStudentProfile = (e) => {
    e.preventDefault();
    toast.loading("Adding Student");
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    formData.append("type", "profile");
    formData.append("profile", file);

    axios
      .post(`${baseApiURL()}/student/details/addDetails`, formData)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          axios
            .post(`${baseApiURL()}/student/auth/register`, {
              loginid: data.enrollmentNo,
              password: data.enrollmentNo,
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
              toast.error(error.response.data.message);
            });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const resetForm = () => {
    setFile(null);
    setData({
      enrollmentNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      semester: "",
      branch: "",
      gender: "",
    });
    setPreviewImage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* Centering the content vertically and horizontally */}
      <form
        onSubmit={addStudentProfile}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-10 transition-all duration-300 ease-in-out transform hover:shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Add New Student</h2>
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
            <label htmlFor="middlename" className="block text-sm font-medium text-gray-600">
              Middle Name
            </label>
            <input
              type="text"
              id="middlename"
              value={data.middleName}
              onChange={(e) => setData({ ...data, middleName: e.target.value })}
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
            <label htmlFor="enrollmentNo" className="block text-sm font-medium text-gray-600">
              Enrollment No
            </label>
            <input
              type="number"
              id="enrollmentNo"
              value={data.enrollmentNo}
              onChange={(e) => setData({ ...data, enrollmentNo: e.target.value })}
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
            <label htmlFor="semester" className="block text-sm font-medium text-gray-600">
              Semester
            </label>
            <select
              id="semester"
              value={data.semester}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {[...Array(8)].map((_, index) => (
                <option value={index + 1} key={index}>
                  {index + 1} Semester
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-600">
              Branch
            </label>
            <select
              id="branch"
              value={data.branch}
              onChange={(e) => setData({ ...data, branch: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select --</option>
              {branch?.map((branch) => (
                <option value={branch.name} key={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
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
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-600">
              Profile Picture
            </label>
            <div className="relative mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
              <input
                type="file"
                id="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="file" className="cursor-pointer flex items-center text-gray-600">
                <FiUpload className="mr-2" />
                {previewImage ? (
                  <span className="text-blue-600">{previewImage.split("/").pop()}</span>
                ) : (
                  <span className="text-gray-400">Upload a profile picture</span>
                )}
              </label>
            </div>
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="mt-2 w-24 h-24 object-cover rounded-md border border-gray-300"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
