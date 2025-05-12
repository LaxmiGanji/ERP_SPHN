import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";

const AddAttendance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [markedAttendance, setMarkedAttendance] = useState({});
  const [semester, setSemester] = useState("-- Select --");
  const [branch, setBranch] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("-- Select --");
  const [selectedBranch, setSelectedBranch] = useState("-- Select --");
  const [selectedPeriod, setSelectedPeriod] = useState("-- Select --");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [range, setRange] = useState({ start: "", end: "" }); // New range filter state

  // Fetch branch data
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
        toast.error(error.message);
      });
  };

  // Fetch subject data
  const getSubjectData = () => {
    toast.loading("Loading Subjects");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubjects(response.data.subject);
          // Filter subjects when subjects data is loaded
          filterSubjectsBySemester(semester, response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  };


  // Function to filter subjects based on semester
  const filterSubjectsBySemester = (selectedSemester, subjectsList = subjects) => {
    if (selectedSemester === "-- Select --") {
      setFilteredSubjects([]);
      setSelectedSubject("-- Select --"); // Reset subject selection
      return;
    }

    const semesterSubjects = subjectsList.filter(
      subject => String(subject.semester) === String(selectedSemester)
    );
    setFilteredSubjects(semesterSubjects);
    setSelectedSubject("-- Select --"); // Reset subject selection when semester changes
  };

  // Handle semester change
  const handleSemesterChange = (e) => {
    const newSemester = e.target.value;
    setSemester(newSemester);
    filterSubjectsBySemester(newSemester);
  };


  // Fetch student data
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

  // Initial data fetch
  useEffect(() => {
    getBranchData();
    getSubjectData();
  }, []);
  // Filter students based on filters
  useEffect(() => {
    filterStudents();
  }, [students, selectedBranch, semester, range]);

  const filterStudents = () => {
    let filtered = students;

    if (selectedBranch && selectedBranch !== "-- Select --") {
      filtered = filtered.filter(
        (student) => student.branch.toLowerCase() === selectedBranch.toLowerCase()
      );
    }

    if (semester && semester !== "-- Select --") {
      filtered = filtered.filter((student) => String(student.semester) === semester);
    }

    if (range.start && range.end) {
      filtered = filtered.filter(
        (student) =>
          student.enrollmentNo >= Number(range.start) &&
          student.enrollmentNo <= Number(range.end)
      );
    }

    filtered.sort((a, b) => a.enrollmentNo - b.enrollmentNo);
    setFilteredStudents(filtered);
  };

  // Toggle individual attendance
  const toggleAttendance = (student) => {
    if (selectedSubject === "-- Select --" || selectedPeriod === "-- Select --") {
      toast.error("Please select both a subject and period.");
      return;
    }

    const isMarked = markedAttendance[student.enrollmentNo];
    const url = isMarked
      ? `${baseApiURL()}/attendence/remove`
      : `${baseApiURL()}/attendence/add`;

    const attendanceData = {
      enrollmentNo: student.enrollmentNo,
      branch: student.branch,
      subject: selectedSubject,
      period: selectedPeriod,
    };

    axios
      .post(url, attendanceData)
      .then((response) => {
        if (response.data.success) {
          setMarkedAttendance((prev) => ({
            ...prev,
            [student.enrollmentNo]: !isMarked,
          }));
          toast.success(
            `${isMarked ? "Removed" : "Added"} attendance for ${student.firstName}`
          );
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(`Failed to ${isMarked ? "remove" : "add"} attendance`);
        console.error(error);
      });
  };

  // Toggle select all attendance
  const toggleSelectAll = () => {
    if (selectedSubject === "-- Select --" || selectedPeriod === "-- Select --") {
      toast.error("Please select both a subject and period.");
      return;
    }

    const newSelectAllChecked = !selectAllChecked;
    setSelectAllChecked(newSelectAllChecked);

    if (newSelectAllChecked) {
      const attendanceData = filteredStudents.map((student) => ({
        enrollmentNo: student.enrollmentNo,
        branch: student.branch,
        subject: selectedSubject,
        period: selectedPeriod,
      }));

      axios
        .post(`${baseApiURL()}/attendence/addBulk`, attendanceData)
        .then((response) => {
          if (response.data.success) {
            const updatedAttendance = {};
            filteredStudents.forEach(
              (student) => (updatedAttendance[student.enrollmentNo] = true)
            );
            setMarkedAttendance(updatedAttendance);
            toast.success("Attendance marked for all students.");
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          toast.error("Failed to mark attendance for all.");
        });
    } else {
      // Deselect all
      setMarkedAttendance({});
      toast.info("Attendance deselected for all students.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Add Attendance</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block font-medium text-gray-700">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option>-- Select --</option>
            {branch.map((b) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>


        <div>
          <label className="block font-medium text-gray-700">Semester</label>
          <select
            value={semester}
            onChange={handleSemesterChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option>-- Select --</option>
            {[...Array(8).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            disabled={semester === "-- Select --"}
          >
            <option>-- Select --</option>
            {filteredSubjects.map((subject) => (
              <option key={subject._id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Period</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          >
            <option>-- Select --</option>
            {[...Array(7).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700">Enrollment Range</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Start"
              value={range.start}
              onChange={(e) => setRange({ ...range, start: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="End"
              value={range.end}
              onChange={(e) => setRange({ ...range, end: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                checked={selectAllChecked}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="border border-gray-300 px-4 py-2">Enrollment No</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Branch</th>
            <th className="border border-gray-300 px-4 py-2">Semester</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student._id}>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={markedAttendance[student.enrollmentNo] || false}
                  onChange={() => toggleAttendance(student)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.enrollmentNo}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {student.firstName} {student.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">{student.branch}</td>
              <td className="border border-gray-300 px-4 py-2">{student.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AddAttendance;