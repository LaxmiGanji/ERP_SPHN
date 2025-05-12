import React, { useEffect, useState, useCallback } from "react";
import Heading from "./Heading";
import axios from "axios";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import { baseApiURL } from "../baseUrl";
import './Notice.css';

const Notice = () => {
  const router = useLocation();
  const [notice, setNotice] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  const getNoticeHandler = useCallback(() => {
    let data = {};
    if (router.pathname.replace("/", "") === "student") {
      data = { type: ["student", "both"] };
    } else {
      data = { type: ["student", "both", "faculty"] };
    }

    const headers = { "Content-Type": "application/json" };
    axios
      .get(`${baseApiURL()}/notice/getNotice`, { headers, params: data })
      .then((response) => {
        if (response.data.success) {
          setNotice(response.data.notice);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  }, [router.pathname]);

  useEffect(() => {
    getNoticeHandler();
  }, [getNoticeHandler]);

  const addNoticeHandler = (e) => {
    e.preventDefault();
    toast.loading("Adding Notice");
    const headers = { "Content-Type": "application/json" };

    axios
      .post(`${baseApiURL()}/notice/addNotice`, data, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getNoticeHandler();
          setOpen(!open);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const deleteNoticeHandler = (id) => {
    toast.loading("Deleting Notice");
    const headers = { "Content-Type": "application/json" };

    axios
      .delete(`${baseApiURL()}/notice/deleteNotice/${id}`, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getNoticeHandler();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const updateNoticeHandler = (e) => {
    e.preventDefault();
    const headers = { "Content-Type": "application/json" };

    axios
      .put(`${baseApiURL()}/notice/updateNotice/${id}`, data, { headers })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          getNoticeHandler();
          setOpen(!open);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response.data.message);
      });
  };

  const setOpenEditSectionHandler = (index) => {
    setEdit(true);
    setOpen(!open);
    setData({
      title: notice[index].title,
      description: notice[index].description,
      type: notice[index].type,
      link: notice[index].link,
    });
    setId(notice[index]._id);
  };

  const openHandler = () => {
    setOpen(!open);
    setEdit(false);
    setData({ title: "", description: "", type: "student", link: "" });
  };

  return (
    <div className="w-full mx-auto flex justify-center items-start flex-col my-10 notice-container">
      <div className="relative flex justify-between items-center w-full">
        <Heading title="Notices" />
        {(router.pathname === "/faculty" || router.pathname === "/admin") &&
          (open ? (
            <button
              className="absolute right-2 flex justify-center items-center close-button"
              onClick={openHandler}
            >
              <span className="mr-2">
                <BiArrowBack className="text-red-500" />
              </span>
              Close
            </button>
          ) : (
            <button
              className="absolute right-2 flex justify-center items-center add-button"
              onClick={openHandler}
            >
              Add Notice
              <span className="ml-2">
                <IoAddOutline className="text-xl" />
              </span>
            </button>
          ))}
      </div>
      {!open && (
        <div className="mt-8 w-full">
          {notice.map((item, index) => (
            <div key={item._id} className="notice-card">
              {(router.pathname === "/faculty" || router.pathname === "/admin") && (
                <div className="absolute flex justify-center items-center right-4 bottom-3 action-icons">
                  <span className="text-sm badge">{item.type}</span>
                  <span
                    className="text-2xl delete-icon"
                    onClick={() => deleteNoticeHandler(item._id)}
                  >
                    <MdDeleteOutline />
                  </span>
                  <span
                    className="text-2xl edit-icon"
                    onClick={() => setOpenEditSectionHandler(index)}
                  >
                    <MdEditNote />
                  </span>
                </div>
              )}
              <p
                className={`text-xl font-medium flex justify-start items-center notice-title ${item.link ? "cursor-pointer" : ""} group`}
                onClick={() => item.link && window.open(item.link)}
              >
                {item.title}
                {item.link && (
                  <span className="text-2xl group-hover:text-blue-500 ml-1">
                    <IoMdLink />
                  </span>
                )}
              </p>
              <p className="text-base font-normal mt-1">{item.description}</p>
              <p className="text-sm absolute top-4 right-4 flex justify-center items-center">
                <span className="text-base mr-1">
                  <HiOutlineCalendar />
                </span>
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {open && (
        <form className="mt-8 w-full">
          <div className="w-[40%] mt-2">
            <label htmlFor="title">Notice Title</label>
            <input
              type="text"
              id="title"
              className="input-field"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="description">Notice Description</label>
            <textarea
              id="description"
              cols="30"
              rows="4"
              className="textarea-field"
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
            ></textarea>
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="link">Notice Link (If any else leave blank)</label>
            <input
              type="text"
              id="link"
              value={data.link}
              className="input-field"
              onChange={(e) => setData({ ...data, link: e.target.value })}
            />
          </div>
          <div className="w-[40%] mt-4">
            <label htmlFor="type">Type Of Notice</label>
            <select
              id="type"
              className="input-field"
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="both">Both</option>
            </select>
          </div>
          {edit ? (
            <button
              onClick={updateNoticeHandler}
              className="action-button update-button"
            >
              Update Notice
            </button>
          ) : (
            <button
              onClick={addNoticeHandler}
              className="action-button add-button"
            >
              Add Notice
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default Notice;
