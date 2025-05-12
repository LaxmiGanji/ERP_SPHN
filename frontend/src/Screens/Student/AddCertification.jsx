import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { FiUpload } from "react-icons/fi";

const AddCertification = () => {
  const [studentId, setStudentId] = useState("");
  const [certificationTitle, setCertificationTitle] = useState("");
  const [file, setFile] = useState(null);
  const [previewFile, setPreviewFile] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewFile(previewUrl);
    } else {
      setPreviewFile("");
    }
  };

  // Submit the certification update
  const addCertification = async (e) => {
    e.preventDefault();

    if (!studentId) {
      toast.error("Please enter the Student ID.");
      return;
    }
    if (!file) {
      toast.error("Please select a certification file to upload.");
      return;
    }

    toast.loading("Adding Certification...");

    const formData = new FormData();
    formData.append("type", "certification");
    formData.append("certificationTitle", certificationTitle);
    // Reusing "profile" as the field name for file upload
    formData.append("profile", file);

    axios
      .put(`${baseApiURL()}/student/details/updateDetails2/${studentId}`, formData)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          // Reset form fields
          setStudentId("");
          setCertificationTitle("");
          setFile(null);
          setPreviewFile("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(
          error.response?.data?.message || "Error adding certification."
        );
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={addCertification}
        className="w-full max-w-lg bg-white shadow-md rounded-lg p-10 transition-all duration-300 ease-in-out transform hover:shadow-lg"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
          Add Certification
        </h2>

        {/* Student ID Field */}
        <div className="mb-4">
          <label
            htmlFor="studentId"
            className="block text-sm font-medium text-gray-600"
          >
            Student ID
          </label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Student ID"
          />
        </div>

        {/* Certification Title (Optional) */}
        <div className="mb-4">
          <label
            htmlFor="certificationTitle"
            className="block text-sm font-medium text-gray-600"
          >
            Certification Title (Optional)
          </label>
          <input
            type="text"
            id="certificationTitle"
            value={certificationTitle}
            onChange={(e) => setCertificationTitle(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Certification Title"
          />
        </div>

        {/* Certification File Upload */}
        <div className="mb-4">
          <label
            htmlFor="certificationFile"
            className="block text-sm font-medium text-gray-600"
          >
            Certification File
          </label>
          <div className="relative mt-1 w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
            <input
              type="file"
              id="certificationFile"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
            <label
              htmlFor="certificationFile"
              className="cursor-pointer flex items-center text-gray-600"
            >
              <FiUpload className="mr-2" />
              {previewFile ? (
                <span className="text-blue-600">
                  {previewFile.split("/").pop()}
                </span>
              ) : (
                <span className="text-gray-400">
                  Upload a certification file
                </span>
              )}
            </label>
          </div>
          {previewFile && (
            <img
              src={previewFile}
              alt="Certification Preview"
              className="mt-2 w-24 h-24 object-cover rounded-md border border-gray-300"
            />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Certification
        </button>
      </form>
    </div>
  );
};

export default AddCertification;
