import React from "react";
import { useNavigate } from "react-router-dom";

const Fees = () => {
  const navigate = useNavigate();

  const fees = [
    {
      type: "Transport Fee",
      amount: "₹3,000",
    },
    {
      type: "Examination Fee",
      amount: "₹1,500",
    },
    {
      type: "Tuition Fee",
      amount: "₹25,000",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h2 className="text-3xl font-bold mb-10 text-center text-blue-700">
        Fee Payment Portal
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {fees.map((fee, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-between border border-blue-100 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800">{fee.type}</h3>
            <p className="text-2xl font-bold text-blue-600 my-4">{fee.amount}</p>
            <button
              onClick={() => navigate("/payment")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 ease-in-out"
            >
              Pay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fees;
