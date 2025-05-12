import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import xlsx library
import { baseApiURL } from "../../baseUrl";

const ViewTotalAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [subjectTotals, setSubjectTotals] = useState({});
  const [studentSubjectSummary, setStudentSubjectSummary] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [enrollmentNumbers, setEnrollmentNumbers] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios.get(`${baseApiURL()}/attendence/getAll`);
        if (response.data.success) {
          setAttendanceRecords(response.data.attendance);

          const uniqueEnrollments = [
            ...new Set(response.data.attendance.map((item) => item.enrollmentNo)),
          ];
          setEnrollmentNumbers(uniqueEnrollments);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch attendance records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/subject/getSubject");
        if (response.data && response.data.success) {
          const subjectData = response.data.subject.reduce((acc, item) => {
            acc[item.name] = item.total;
            return acc;
          }, {});
          setSubjectTotals(subjectData);

          const subjectList = response.data.subject.map((item) => item.name);
          setSubjects(subjectList);
        } else {
          console.error("API Error (Subject Totals):", response.data?.message || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching subject totals:", error);
      }
    };

    fetchSubjectData();
  }, []);

  useEffect(() => {
    if (attendanceRecords.length > 0 && Object.keys(subjectTotals).length > 0) {
      const summary = {};

      attendanceRecords.forEach((record) => {
        const { enrollmentNo, subject } = record;
        if (!summary[enrollmentNo]) summary[enrollmentNo] = {};
        if (!summary[enrollmentNo][subject]) summary[enrollmentNo][subject] = 0;
        summary[enrollmentNo][subject] += 1;
      });

      Object.keys(summary).forEach((student) => {
        Object.keys(summary[student]).forEach((subject) => {
          const attended = summary[student][subject];
          const total = subjectTotals[subject] || 0;
          const percentage = total > 0 ? ((attended / total) * 100).toFixed(2) : 0;

          summary[student][subject] = {
            attended,
            total,
            percentage,
          };
        });
      });

      setStudentSubjectSummary(summary);
    }
  }, [attendanceRecords, subjectTotals]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleEnrollmentChange = (e) => {
    setSelectedEnrollment(e.target.value);
  };

  const handleExportToExcel = () => {
    const filteredData = Object.entries(studentSubjectSummary)
      .flatMap(([student, subjects]) =>
        Object.entries(subjects).map(([subject, data]) => ({
          "Enrollment No": student,
          Subject: subject,
          "Attended Classes": data.attended,
          "Total Classes": data.total,
          Percentage: `${data.percentage}%`,
        }))
      )
      .filter((item) =>
        (selectedSubject ? item.Subject === selectedSubject : true) &&
        (selectedEnrollment ? item["Enrollment No"] === selectedEnrollment : true)
      );

    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
    XLSX.writeFile(wb, "Attendance_Report.xlsx");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading attendance records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex flex-col sm:flex-row justify-start gap-4 mb-4">
        <div>
          <label className="mr-2">Subject:</label>
          <select
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Select --</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2">Enrollment No:</label>
          <select
            value={selectedEnrollment}
            onChange={handleEnrollmentChange}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Select --</option>
            {enrollmentNumbers.map((enrollment) => (
              <option key={enrollment} value={enrollment}>
                {enrollment}
              </option>
            ))}
          </select>
        </div>

        {/* Add to Excel Button */}
        <button
          onClick={handleExportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add to Excel Sheet
        </button>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Enrollment No</th>
            <th className="py-2 px-4 text-left">Subject</th>
            <th className="py-2 px-4 text-left">Attended Classes</th>
            <th className="py-2 px-4 text-left">Total Classes</th>
            <th className="py-2 px-4 text-left">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(studentSubjectSummary)
            .flatMap(([student, subjects]) =>
              Object.entries(subjects).map(([subject, data]) => ({
                student,
                subject,
                ...data,
              }))
            )
            .filter(
              (item) =>
                (selectedSubject ? item.subject === selectedSubject : true) &&
                (selectedEnrollment ? item.student === selectedEnrollment : true)
            )
            .map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{item.student}</td>
                <td className="py-2 px-4">{item.subject}</td>
                <td className="py-2 px-4">{item.attended}</td>
                <td className="py-2 px-4">{item.total}</td>
                <td className="py-2 px-4">{item.percentage}%</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTotalAttendance;
