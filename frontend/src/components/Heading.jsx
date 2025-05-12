import React from "react";

const Heading = (props) => {
  return (
    <div className="flex justify-between items-center w-full py-3 px-4 bg-gray-50 shadow-sm rounded-md">
      <div className="flex items-center space-x-2">
        <span className="text-red-500 text-2xl">📚</span> {}
        <h2 className="font-semibold text-2xl text-gray-800 border-l-4 border-red-500 pl-3 transition duration-300 ease-in-out hover:text-red-600">
          {props.title}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        {}
      </div>
    </div>
  );
};

export default Heading;
