import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import toast from "react-hot-toast";

const ViewFaculty = () => {
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/faculty/details/getDetails2`);
        if (response.data.success) {
          setFaculties(response.data.faculties); 
        } else {
          toast.error("Failed to load faculty");
        }
      } catch (error) {
        toast.error("Error fetching faculty");
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="my-6 mx-auto w-full">
      <h2 className="text-2xl font-bold text-center mb-4">View Faculties</h2>

      {faculties.length === 0 ? (
        <p className="text-center">No Faculty available.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">Enrollment No</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Experience</th>
              <th className="border px-4 py-2">Post</th>
              <th className="border px-4 py-2">Gender</th>
            </tr>
          </thead>
          <tbody>
            {faculties.map((facul) => (
              <tr key={facul.enrollmentNo}>
                <td className="border px-4 py-2">{facul.employeeId}</td>
                <td className="border px-4 py-2">
                  {facul.firstName} {facul.middleName} {facul.lastName}
                </td>
                <td className="border px-4 py-2">{facul.email}</td>
                <td className="border px-4 py-2">{facul.phoneNumber}</td>
                <td className="border px-4 py-2">{facul.experience}</td>
                <td className="border px-4 py-2">{facul.post}</td>
                <td className="border px-4 py-2">{facul.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewFaculty;