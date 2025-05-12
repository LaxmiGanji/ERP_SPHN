import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseApiURL } from "../../baseUrl";

const Material = () => {
  const { fullname } = useSelector((state) => state.userData);
  console.log(fullname);
  const [subject, setSubject] = useState([]);
  const [branches, setBranches] = useState([]);
  const [file, setFile] = useState();
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    branch: "",
    semester: "",
    faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
  });

  // Load subjects
  useEffect(() => {
    toast.loading("Loading Subjects...");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });

    // Load branches
    axios
      .get(`${baseApiURL()}/branch/getBranch`)
      .then((response) => {
        if (response.data.success) {
          setBranches(response.data.branches);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, []);

  // Add material handler
  const addMaterialHandler = () => {
    if (!selected.branch || !selected.semester) {
      return toast.error("Please select both Branch and Semester!");
    }

    toast.loading("Adding Material...");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("branch", selected.branch);
    formData.append("semester", selected.semester);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    formData.append("material", file);

    axios
      .post(`${baseApiURL()}/material/addMaterial`, formData, {
        headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            branch: "",
            semester: "",
            faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
          });
          setFile("");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title={`Upload Material`} />
      </div>

      <div className="w-full flex justify-evenly items-center mt-12">
        <div className="w-1/2 flex flex-col justify-center items-center">
          {/* Material Title */}
          <div className="w-[80%] mt-2">
            <label htmlFor="title">Material Title</label>
            <input
              type="text"
              id="title"
              className="bg-blue-50 py-2 px-4 w-full mt-1"
              value={selected.title}
              onChange={(e) =>
                setSelected({ ...selected, title: e.target.value })
              }
            />
          </div>

          {/* Select Subject */}
          <div className="w-[80%] mt-2">
            <label htmlFor="subject">Material Subject</label>
            <select
              value={selected.subject}
              id="subject"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
              onChange={(e) =>
                setSelected({ ...selected, subject: e.target.value })
              }
            >
              <option defaultValue value="">
                -- Select Subject --
              </option>
              {subject.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Branch */}
          <div className="w-[80%] mt-2">
            <label htmlFor="branch">Select Branch</label>
            <select
              value={selected.branch}
              id="branch"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
              onChange={(e) =>
                setSelected({ ...selected, branch: e.target.value })
              }
            >
              <option defaultValue value="">
                -- Select Branch --
              </option>
              {branches.map((branch) => (
                <option key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Semester */}
          <div className="w-[80%] mt-2">
            <label htmlFor="semester">Select Semester</label>
            <select
              value={selected.semester}
              id="semester"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base accent-blue-700 mt-1 w-full"
              onChange={(e) =>
                setSelected({ ...selected, semester: e.target.value })
              }
            >
              <option defaultValue value="">
                -- Select Semester --
              </option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Semester
                </option>
              ))}
            </select>
          </div>

          {/* Upload Material */}
          {!selected.link && (
            <label
              htmlFor="upload"
              className="px-2 bg-blue-50 py-3 rounded-sm text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
            >
              Upload Material
              <span className="ml-2">
                <FiUpload />
              </span>
            </label>
          )}
          {selected.link && (
            <p
              className="px-2 border-2 border-blue-500 py-2 rounded text-base w-[80%] mt-4 flex justify-center items-center cursor-pointer"
              onClick={() => setSelected({ ...selected, link: "" })}
            >
              Remove Selected Material
              <span className="ml-2">
                <AiOutlineClose />
              </span>
            </p>
          )}
          <input
            type="file"
            id="upload"
            hidden
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            className="bg-blue-500 text-white mt-8 px-4 py-2 rounded-sm"
            onClick={addMaterialHandler}
          >
            Add Material
          </button>
        </div>
      </div>
    </div>
  );
};

export default Material;
