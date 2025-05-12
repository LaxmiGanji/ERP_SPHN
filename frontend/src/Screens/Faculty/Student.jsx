import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import { FiSearch } from "react-icons/fi";
import ViewStudents from "../Admin/Student/ViewStudents";

const Student = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("view");
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
    profile: "",
    certifications: [],
  });
  const [id, setId] = useState("");
  const [marks, setMarks] = useState(null);

  const searchStudentHandler = (e) => {
    e.preventDefault();
    setId("");
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
      profile: "",
      certifications: [],
    });
    setMarks(null);

    toast.loading("Getting Student...");
    const headers = { "Content-Type": "application/json" };

    axios
      .post(`${baseApiURL()}/student/details/getDetails`, { enrollmentNo: search }, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          const user = response.data.user[0];
          if (!user) {
            toast.error("No Student Found!");
          } else {
            toast.success(response.data.message);
            setData({
              enrollmentNo: user.enrollmentNo,
              firstName: user.firstName,
              middleName: user.middleName,
              lastName: user.lastName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              semester: user.semester,
              branch: user.branch,
              gender: user.gender,
              profile: user.profile,
              certifications: user.certifications || [],
            });
            setId(user._id);
            fetchMarks(user.enrollmentNo);
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Error occurred");
        console.error(error);
      });
  };

  const fetchMarks = (enrollmentNo) => {
    axios
      .post(`${baseApiURL()}/marks/getMarks`, { enrollmentNo })
      .then((response) => {
        if (response.data.success) {
          setMarks(response.data.Mark[0]);
        } else {
          toast.error("Marks not available");
        }
      })
      .catch((error) => {
        toast.error("Error fetching marks");
        console.error(error);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col items-center mb-10 px-4">
      <div className="w-full mb-8">
        <Heading title="Student Details" />
      </div>

      <div className="w-full mb-6 flex justify-center">
        <form
          className="flex items-center border-2 border-blue-500 rounded-md w-[70%] md:w-[40%] mx-auto shadow-lg"
          onSubmit={searchStudentHandler}
        >
          <input
            type="text"
            className="px-6 py-3 w-full outline-none rounded-l-md"
            placeholder="Enrollment No."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="px-4 py-3 text-2xl hover:text-blue-500 bg-blue-100 rounded-r-md" type="submit">
            <FiSearch />
          </button>
        </form>
      </div>

      {id && (
        <div className="mx-auto w-full bg-blue-50 mt-10 flex flex-col md:flex-row justify-between items-center p-6 rounded-md shadow-md">
          <div className="flex-1">
            <p className="text-2xl font-semibold text-center md:text-left">
              {data.firstName} {data.middleName} {data.lastName}
            </p>
            <div className="mt-3 space-y-2">
              <p className="text-lg font-normal">Enrollment No: {data.enrollmentNo}</p>
              <p className="text-lg font-normal">Phone Number: +91 {data.phoneNumber}</p>
              <p className="text-lg font-normal">Email Address: {data.email}</p>
              <p className="text-lg font-normal">Branch: {data.branch}</p>
              <p className="text-lg font-normal">Semester: {data.semester}</p>
              <p className="text-lg font-normal">Certifications:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {data.certifications.length > 0 ? (
                  data.certifications.map((cert, index) => (
                    <a
                      key={index}
                      href={`${process.env.REACT_APP_MEDIA_LINK}/${cert}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Certification {index + 1}
                    </a>
                  ))
                ) : (
                  <p className="text-lg font-normal text-gray-500">No certifications available</p>
                )}
              </div>
              <p className="text-lg font-normal mt-4">Marks:</p>
              {marks ? (
                <div className="mt-2">
                  <p className="font-semibold">Internal Marks:</p>
                  <pre>{JSON.stringify(marks.internal, null, 2)}</pre>
                  <p className="font-semibold mt-2">External Marks:</p>
                  <pre>{JSON.stringify(marks.external, null, 2)}</pre>
                </div>
              ) : (
                <p className="text-lg font-normal text-gray-500">No marks available</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full mt-8 flex justify-center space-x-6">
        <button
          className={`px-6 py-2 text-lg font-medium text-black rounded-md border-b-2 ${
            selected === "view" ? "border-blue-500" : "border-transparent"
          } hover:text-blue-500 transition-all`}
          onClick={() => setSelected("view")}
        >
          View Students
        </button>
      </div>

      {selected === "view" && <ViewStudents />}
    </div>
  );
};

export default Student;
