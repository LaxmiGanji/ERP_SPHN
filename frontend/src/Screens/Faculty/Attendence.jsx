import React, { useState } from "react";
import AddAttendance from "./AddAttendance";
import ViewTotalAttendance from "./ViewTotalAttendance";

const Attendence = () => {
  const [activeTab, setActiveTab] = useState('add');
  return (
    <>
          <div className="max-w-6xl mx-auto">
            <ul className="flex justify-evenly items-center gap-10 w-full mx-auto my-8">
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  activeTab === "add"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setActiveTab("add")}
              >
                Add Attendance
              </li>
              <li
                className={`text-center rounded-sm px-4 py-2 w-1/5 cursor-pointer ease-linear duration-300 hover:ease-linear hover:duration-300 hover:transition-all transition-all ${
                  activeTab === "view"
                    ? "border-b-2 pb-2 border-blue-500 bg-blue-100 rounded-sm"
                    : "bg-blue-500 text-white hover:bg-blue-600 border-b-2 border-blue-500"
                }`}
                onClick={() => setActiveTab("view")}
              >
                ViewTotalAttendance
              </li>                   
            </ul>

            <>
              {activeTab === "add" && <AddAttendance />}
              {activeTab === "view" && <ViewTotalAttendance />}
            </>
          </div>
        </>
  )
}

export default Attendence