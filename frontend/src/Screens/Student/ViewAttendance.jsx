import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";

const ViewAttendance = () => {
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [uniqueDaysPresent, setUniqueDaysPresent] = useState(0);
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [subjectTotals, setSubjectTotals] = useState({});
  const [attendanceBySubject, setAttendanceBySubject] = useState({});
  const [overallAttendancePercentage, setOverallAttendancePercentage] = useState("N/A");
  const router = useLocation();

  // Fetch enrollment number
  useEffect(() => {
    const headers = { "Content-Type": "application/json" };

    axios
      .post(
        `${baseApiURL()}/${router.state.type}/details/getDetails`,
        { enrollmentNo: router.state.loginid },
        { headers: headers }
      )
      .then((response) => {
        if (response.data?.success) {
          const fetchedEnrollmentNo = response.data.user?.[0]?.enrollmentNo || "";
          setEnrollmentNo(fetchedEnrollmentNo);
        } else {
          console.error("API Error (Enrollment Details):", response.data?.message || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error fetching enrollment details:", error);
      });
  }, [router.state.type, router.state.loginid]);

  // Fetch subject totals
  useEffect(() => {
    const fetchSubjectTotals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/subject/getSubject");
        if (response.data?.success) {
          const subjectData = response.data.subject.reduce((acc, item) => {
            acc[item.name] = item.total; // Store total classes per subject
            return acc;
          }, {});
          setSubjectTotals(subjectData);
          console.log("Subject Totals:", subjectData); // Debug
        } else {
          console.error("API Error (Subject Totals):", response.data?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching subject totals:", error);
      }
    };

    fetchSubjectTotals();
  }, []);

  // Fetch attendance and calculate stats
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!enrollmentNo) return;

      try {
        const response = await axios.get(
          `http://localhost:5000/api/attendence/getStudentAttendance/${enrollmentNo}`
        );
        if (response.data?.success) {
          const sortedRecords = response.data.attendanceRecords.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setTotalAttendance(response.data.totalAttendance || 0);

          // Group attendance by subject
          const attendanceGrouped = sortedRecords.reduce((acc, record) => {
            if (!acc[record.subject]) acc[record.subject] = [];
            acc[record.subject].push(record);
            return acc;
          }, {});
          setAttendanceBySubject(attendanceGrouped);
          console.log("Grouped Attendance by Subject:", attendanceGrouped); // Debug

          // Calculate unique days present
          const attendanceByDate = sortedRecords.reduce((acc, record) => {
            const dateKey = new Date(record.date).toISOString().split("T")[0];
            acc[dateKey] = (acc[dateKey] || 0) + 1;
            return acc;
          }, {});

          const qualifyingDays = Object.values(attendanceByDate).filter(
            (periodCount) => periodCount >= 7
          ).length;

          setUniqueDaysPresent(qualifyingDays);

          // Calculate overall attendance percentage after subject totals are fetched
          if (Object.keys(subjectTotals).length > 0) {
            calculateOverallAttendance(attendanceGrouped, subjectTotals);
          }
        } else {
          console.error("API Error (Attendance Data):", response.data?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [enrollmentNo, subjectTotals]);

  // Function to calculate overall attendance percentage
  const calculateOverallAttendance = (attendanceGrouped, totals) => {
    let totalClassesAttended = 0;
    let totalClassesAvailable = 0;

    Object.keys(attendanceGrouped).forEach((subject) => {
      if (totals[subject]) { // Only consider subjects with recorded attendance
        totalClassesAttended += attendanceGrouped[subject].length;
        totalClassesAvailable += totals[subject];
      }
    });

    const overallPercentage =
      totalClassesAvailable > 0
        ? ((totalClassesAttended / totalClassesAvailable) * 100).toFixed(2)
        : "N/A";

    console.log("Total Classes Attended:", totalClassesAttended); // Debug
    console.log("Total Classes Available:", totalClassesAvailable); // Debug
    console.log("Overall Attendance Percentage:", overallPercentage); // Debug

    setOverallAttendancePercentage(overallPercentage);
  };

  // Function to calculate subject-specific attendance percentage
  const calculatePercentage = (subject) => {
    const totalClasses = subjectTotals[subject] || 0;
    const attendedClasses = attendanceBySubject[subject]?.length || 0;
    return totalClasses > 0 ? ((attendedClasses / totalClasses) * 100).toFixed(2) : "N/A";
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Total Attendance</h2>
      <p className="mb-2">Total Classes Attended: {totalAttendance}</p>
      <p className="mb-4">Total Days Present: {uniqueDaysPresent}</p>

      <h3 className="text-lg font-semibold mb-4">Attendance Details by Subject</h3>
      {Object.keys(attendanceBySubject).length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-100">
              <th className="border border-gray-300 px-4 py-2">Subject</th>
              <th className="border border-gray-300 px-4 py-2">Attended Classes</th>
              <th className="border border-gray-300 px-4 py-2">Total Classes</th>
              <th className="border border-gray-300 px-4 py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(attendanceBySubject).map((subject, index) => {
              const attendedClasses = attendanceBySubject[subject]?.length || 0;
              const totalClasses = subjectTotals[subject] || 0;
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{subject}</td>
                  <td className="border border-gray-300 px-4 py-2">{attendedClasses}</td>
                  <td className="border border-gray-300 px-4 py-2">{totalClasses}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {calculatePercentage(subject)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}

      <h3 className="text-lg font-semibold mt-6">Overall Attendance Percentage</h3>
      <p className="text-blue-600 text-lg font-bold">
        {overallAttendancePercentage}%
      </p>
    </div>
  );
};

export default ViewAttendance;
