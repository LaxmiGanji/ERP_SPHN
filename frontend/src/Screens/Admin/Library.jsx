import React, { useState } from "react";
import Heading from "../../components/Heading";
import AddLibrary from './Library/AddLibrary';
import EditLibrary from './Library/EditLibrary';
import ViewLibrary from './Library/ViewLibrary';

const Library = () => {
    const [selected, setSelected] = useState("add");
  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Library Details" />
        <div className="flex justify-end items-center w-full"> 
          <button
            className={`${
              selected === "add" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm mr-6`}
            onClick={() => setSelected("add")}
          >
            Add Student
          </button>
          <button
            className={`${
              selected === "edit" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("edit")}
          >
            Edit Student
          </button>
          <button
            className={`${
              selected === "view" && "border-b-2 "
            }border-blue-500 px-4 py-2 text-black rounded-sm`}
            onClick={() => setSelected("view")}
          >
            View Student
          </button>
        </div>
      </div>
      {selected === "add" && <AddLibrary />}
      {selected === "edit" && <EditLibrary />}
      {selected === "view" && <ViewLibrary />}
    </div>
  )
}

export default Library