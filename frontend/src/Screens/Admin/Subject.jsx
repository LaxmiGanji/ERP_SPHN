import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Heading from "../../components/Heading";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { baseApiURL } from "../../baseUrl";

const Subjects = () => {
  const [data, setData] = useState({ 
    name: "", 
    code: "", 
    total: "", 
    semester: "" 
  });
  const [editData, setEditData] = useState(null);
  const [selected, setSelected] = useState("add");
  const [subject, setSubject] = useState([]);

  // Semester options
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    getSubjectHandler();
  }, []);

  const getSubjectHandler = () => {
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const addSubjectHandler = () => {
    console.log("Adding Subject:", data); // Debugging Log
    if (!data.name || !data.code || !data.total || !data.semester) {
      toast.error("Please fill all fields");
      return;
    }
    axios
      .post(`${baseApiURL()}/subject/addSubject`, data)
      .then((response) => {
        console.log("Response:", response.data); // Debugging Log
        if (response.data.success) {
          toast.success(response.data.message);
          setData({ name: "", code: "", total: "", semester: "" });
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Debugging Log
        toast.error(error.response?.data?.message || error.message);
      });
  };
  

  const deleteSubjectHandler = (id) => {
    // Confirmation before delete
    const confirmDelete = window.confirm("Are you sure you want to delete this subject?");
    if (!confirmDelete) return;

    toast.loading("Deleting Subject");
    axios
      .delete(`${baseApiURL()}/subject/deleteSubject/${id}`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  const updateSubjectHandler = () => {
    // Validate all fields are filled
    if (!editData.name || !editData.code || !editData.total || !editData.semester) {
      toast.error("Please fill all fields");
      return;
    }

    if (!editData) return;
    toast.loading("Updating Subject");
    axios
      .put(`${baseApiURL()}/subject/updateSubject/${editData._id}`, editData)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setEditData(null);
          setSelected("view");
          getSubjectHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || error.message);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Manage Subjects" />
        <div className="flex justify-end items-center w-full">
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Subject
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Subjects
          </button>
        </div>
      </div>

      {selected === "add" && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
            <label htmlFor="code" className="leading-7 text-sm">
              Subject Code
            </label>
            <input
              type="number"
              id="code"
              value={data.code}
              onChange={(e) => setData({ ...data, code: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="name" className="leading-7 text-sm">
              Subject Name
            </label>
            <input
              type="text"
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="total" className="leading-7 text-sm">
              Total Classes
            </label>
            <input
              type="number"
              id="total"
              value={data.total}
              onChange={(e) => setData({ ...data, total: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="semester" className="leading-7 text-sm">
              Semester
            </label>
            <select
              id="semester"
              value={data.semester}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={addSubjectHandler}
          >
            Add Subject
          </button>
        </div>
      )}

      {selected === "view" && (
        <div className="mt-8 w-full">
          <ul>
            {subject.map((item) => (
              <li
                key={item.code}
                className="bg-blue-100 py-3 px-6 mb-3 flex justify-between items-center w-[70%]"
              >
                <div>
                  {item.code} - {item.name} (Semester {item.semester})
                </div>
                <div>
                  <button
                    className="text-2xl mr-4 hover:text-blue-500"
                    onClick={() => {
                      setEditData(item);
                      setSelected("edit");
                    }}
                  >
                    <MdEdit />
                  </button>
                  <button
                    className="text-2xl hover:text-red-500"
                    onClick={() => deleteSubjectHandler(item._id)}
                  >
                    <MdOutlineDelete />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected === "edit" && editData && (
        <div className="flex flex-col justify-center items-center w-full mt-8">
          <div className="w-[40%] mb-4">
            <label htmlFor="editCode" className="leading-7 text-sm">
              Edit Subject Code
            </label>
            <input
              type="number"
              id="editCode"
              value={editData.code}
              onChange={(e) => setEditData({ ...editData, code: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editName" className="leading-7 text-sm">
              Edit Subject Name
            </label>
            <input
              type="text"
              id="editName"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editTotal" className="leading-7 text-sm">
              Edit Total Classes
            </label>
            <input
              type="number"
              id="editTotal"
              value={editData.total}
              onChange={(e) => setEditData({ ...editData, total: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            />
          </div>
          <div className="w-[40%] mb-4">
            <label htmlFor="editSemester" className="leading-7 text-sm">
              Edit Semester
            </label>
            <select
              id="editSemester"
              value={editData.semester}
              onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
              className="w-full bg-blue-50 rounded border text-base outline-none py-1 px-3"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          <button
            className="mt-6 bg-blue-500 px-6 py-3 text-white"
            onClick={updateSubjectHandler}
          >
            Update Subject
          </button>
        </div>
      )}
    </div>
  );
};

export default Subjects;