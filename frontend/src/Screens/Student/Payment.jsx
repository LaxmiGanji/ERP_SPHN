import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGooglePay, FaPaypal, FaPhone, FaUniversity } from "react-icons/fa";

const Payment = () => {
  const navigate = useNavigate();

  const handlePayment = (method) => {
    alert(`Redirecting to ${method} payment gateway...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Choose Your Payment Method
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => handlePayment("Google Pay")}
            className="cursor-pointer flex items-center gap-4 bg-gray-100 hover:bg-blue-100 p-6 rounded-xl shadow transition-all"
          >
            <FaGooglePay size={40} className="text-blue-600" />
            <span className="text-lg font-medium">Google Pay (GPay)</span>
          </div>

          <div
            onClick={() => handlePayment("PhonePe")}
            className="cursor-pointer flex items-center gap-4 bg-gray-100 hover:bg-blue-100 p-6 rounded-xl shadow transition-all"
          >
            <FaPhone size={40} className="text-violet-600" />
            <span className="text-lg font-medium">PhonePe</span>
          </div>

          <div
            onClick={() => handlePayment("Paytm")}
            className="cursor-pointer flex items-center gap-4 bg-gray-100 hover:bg-blue-100 p-6 rounded-xl shadow transition-all"
          >
            <FaPaypal size={40} className="text-blue-400" />
            <span className="text-lg font-medium">Paytm</span>
          </div>

          <div
            onClick={() => handlePayment("Net Banking")}
            className="cursor-pointer flex items-center gap-4 bg-gray-100 hover:bg-blue-100 p-6 rounded-xl shadow transition-all"
          >
            <FaUniversity size={40} className="text-green-600" />
            <span className="text-lg font-medium">Bank Transfer / Net Banking</span>
          </div>
        </div>
        <div className="text-center mt-10">
        </div>
      </div>
    </div>
  );
};

export default Payment;
