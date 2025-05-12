import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import { FiSearch, FiUpload, FiX } from "react-icons/fi";

const EditAdmin = () => {
  const [file, setFile] = useState();
  const [searchActive, setSearchActive] = useState(false);
  const [data, setData] = useState({
    employeeId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    profile: "",
  });
  const [id, setId] = useState();
  const [search, setSearch] = useState();
  const [previewImage, setPreviewImage] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const imageUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(imageUrl);
  };

  const updateAdminProfile = (e) => {
    e.preventDefault();
    toast.loading("Updating Admin");
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();
    formData.append("employeeId", data.employeeId);
    formData.append("firstName", data.firstName);
    formData.append("middleName", data.middleName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("gender", data.gender);
    if (file) {
      formData.append("type", "profile");
      formData.append("profile", file);
    }
    axios
      .put(`${baseApiURL()}/admin/details/updateDetails/${id}`, formData, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          clearSearchHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const searchAdminHandler = (e) => {
    setSearchActive(true);
    e.preventDefault();
    toast.loading("Getting Admin");
    const headers = { "Content-Type": "application/json" };
    axios
      .post(`${baseApiURL()}/admin/details/getDetails`, { employeeId: search }, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          if (response.data.user.length !== 0) {
            toast.success(response.data.message);
            setId(response.data.user[0]._id);
            setData({
              employeeId: response.data.user[0].employeeId,
              firstName: response.data.user[0].firstName,
              middleName: response.data.user[0].middleName,
              lastName: response.data.user[0].lastName,
              email: response.data.user[0].email,
              phoneNumber: response.data.user[0].phoneNumber,
              gender: response.data.user[0].gender,
              profile: response.data.user[0].profile,
            });
          } else {
            toast.dismiss();
            toast.error("No Admin Found With ID");
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const clearSearchHandler = () => {
    setSearchActive(false);
    setSearch("");
    setId("");
    setPreviewImage();
    setData({
      employeeId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      gender: "",
      profile: "",
    });
  };

  return (
    <div className="my-6 mx-auto w-full">
      <form
        onSubmit={searchAdminHandler}
        className="flex justify-center items-center border-2 border-blue-500 rounded-lg shadow-lg w-[50%] mx-auto p-2 transition-all duration-200 ease-in-out focus-within:shadow-md"
      >
        <input
          type="text"
          className="px-4 py-2 w-full outline-none text-gray-700 rounded-l-lg bg-gray-100 focus:bg-white transition duration-300"
          placeholder="Enter Employee ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {!searchActive ? (
          <button className="px-4 text-xl text-gray-600 hover:text-blue-500 transition duration-200" type="submit">
            <FiSearch />
          </button>
        ) : (
          <button
            className="px-4 text-xl text-gray-600 hover:text-red-500 transition duration-200"
            onClick={clearSearchHandler}
          >
            <FiX />
          </button>
        )}
      </form>

      {search && id && (
        <form
          onSubmit={updateAdminProfile}
          className="w-[70%] flex justify-center items-center flex-wrap gap-6 mx-auto mt-10 p-6 bg-white shadow-md rounded-lg"
        >
          {["firstName", "middleName", "lastName", "employeeId", "email", "phoneNumber"].map((field) => (
            <div key={field} className="w-[40%]">
              <label htmlFor={field} className="leading-7 text-sm font-semibold text-gray-600">
                Enter {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={field === "email" ? "email" : field === "phoneNumber" || field === "employeeId" ? "number" : "text"}
                id={field}
                value={data[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                className="w-full bg-gray-100 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300 text-base outline-none py-2 px-4 leading-8 transition duration-200 ease-in-out"
              />
            </div>
          ))}

          <div className="w-[40%]">
            <label htmlFor="gender" className="leading-7 text-sm font-semibold text-gray-600">
              Select Gender
            </label>
            <select
              id="gender"
              className="w-full bg-gray-100 py-2 px-4 rounded border border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out"
              value={data.gender}
              onChange={(e) => setData({ ...data, gender: e.target.value })}
            >
              <option value="" disabled>
                -- Select Gender --
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="w-[40%]">
            <label htmlFor="file" className="leading-7 text-sm font-semibold text-gray-600">
              Upload Profile Picture
            </label>
            <label
              htmlFor="file"
              className="w-full bg-gray-100 py-2 px-4 rounded border border-gray-300 flex justify-center items-center cursor-pointer transition-all duration-200 ease-in-out hover:bg-blue-50"
            >
              Upload
              <FiUpload className="ml-2" />
            </label>
            <input hidden type="file" id="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {previewImage && (
            <div className="w-full flex justify-center items-center mt-4">
              <img src={previewImage} alt="Profile Preview" className="h-36 w-36 rounded-full object-cover shadow-md" />
            </div>
          )}

          {!previewImage && data.profile && (
            <div className="w-full flex justify-center items-center mt-4">
              <img
                src={`${process.env.REACT_APP_MEDIA_LINK}/${data.profile}`}
                alt="Current Profile"
                className="h-36 w-36 rounded-full object-cover shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded shadow transition duration-300 ease-in-out mt-4"
          >
            Update Admin
          </button>
        </form>
      )}
    </div>
  );
};

export default EditAdmin;
