import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import toast from "react-hot-toast";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [semester, setSemester] = useState("-- Select --");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [branch, setBranch] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("-- Select --"); // Corrected the state name

  const getBranchData = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/branch/getBranch`, { headers })
      .then((response) => {
        if (response.data.success) {
          setBranch(response.data.branches);
          console.log(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    getBranchData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/student/details/getDetails2`);
        if (response.data.success) {
          setStudents(response.data.students);
        } else {
          toast.error("Failed to load students");
        }
      } catch (error) {
        toast.error("Error fetching students");
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, selectedBranch, semester, sortOrder]);

  const filterStudents = () => {
    let filtered = students;

    // Filter by branch
    if (selectedBranch && selectedBranch !== "-- Select --") {
      filtered = filtered.filter(
        (student) => student.branch.toLowerCase() === selectedBranch.toLowerCase()
      );
    }

    // Filter by semester
    if (semester && semester !== "-- Select --") {
      filtered = filtered.filter((student) => String(student.semester) === semester);
    }

    // Sort by roll number (enrollment number)
    filtered = filtered.sort((a, b) => {
      if (sortOrder === "Ascending") {
        return a.enrollmentNo.localeCompare(b.enrollmentNo);
      } else {
        return b.enrollmentNo.localeCompare(a.enrollmentNo);
      }
    });

    setFilteredStudents(filtered);
  };

  return (
    <div className="my-6 mx-auto w-full px-6">
      <h2 className="text-2xl font-bold text-center mb-6">View Students</h2>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Branch Filter */}
        <div className="w-50 ml-auto">
          <label htmlFor="branch" className="leading-7 text-base">
            Select Branch
          </label>
          <select
            id="branch"
            className="px-2 bg-blue-50 py-3 rounded-sm text-base w-full accent-blue-700 mt-1"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)} // Corrected state update
          >
            <option defaultValue>-- Select --</option>
            {branch &&
              branch.map((branch) => {
                return (
                  <option value={branch.name} key={branch.name}>
                    {branch.name}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Semester Filter */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Select Semester:</label>
          <select
            className="border px-3 py-2 rounded shadow-sm focus:outline-blue-500"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="-- Select --">-- Select --</option>
            {[...Array(8).keys()].map((i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Filter */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Sort by Roll Number:</label>
          <select
            className="border px-3 py-2 rounded shadow-sm focus:outline-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500">No students available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-4 py-2 text-left">Enrollment No</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Semester</th>
                <th className="border px-4 py-2 text-left">Branch</th>
                <th className="border px-4 py-2 text-left">Gender</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.enrollmentNo} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{student.enrollmentNo}</td>
                  <td className="border px-4 py-2">
                    {student.firstName} {student.middleName} {student.lastName}
                  </td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.phoneNumber}</td>
                  <td className="border px-4 py-2 text-center">{student.semester}</td>
                  <td className="border px-4 py-2">{student.branch}</td>
                  <td className="border px-4 py-2">{student.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
