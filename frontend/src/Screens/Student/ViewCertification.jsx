import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setUserData } from "../../redux/actions";

const ViewCertification = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true); // Start loading
        const headers = {
          "Content-Type": "application/json",
        };
        const response = await axios.post(
          `${baseApiURL()}/${router.state.type}/details/getDetails`,
          { enrollmentNo: router.state.loginid },
          { headers }
        );
        if (response.data.success) {
          const userData = response.data.user[0];
          setStudent(userData);

          // Dispatch user data to Redux if needed
          dispatch(
            setUserData({
              fullname: `${userData.firstName} ${userData.middleName} ${userData.lastName}`,
              semester: userData.semester,
              enrollmentNo: userData.enrollmentNo,
              branch: userData.branch,
            })
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error fetching student details.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchStudentData();
  }, [dispatch, router.state.loginid, router.state.type]);

  // Renders a certification file preview based on file extension
  const renderCertification = (cert) => {
    const ext = cert.split(".").pop().toLowerCase();
    // If your server is serving files at REACT_APP_MEDIA_LINK
    const fileUrl = `${process.env.REACT_APP_MEDIA_LINK}/${cert}`;

    if (["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
      return (
        <div key={cert} className="p-2 border rounded shadow-md">
          <img src={fileUrl} alt={cert} className="w-32 h-32 object-cover" />
          <p className="text-sm mt-1 break-all">{cert}</p>
        </div>
      );
    } else if (ext === "pdf") {
      return (
        <div
          key={cert}
          className="p-2 border rounded shadow-md flex flex-col items-center"
        >
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View PDF
          </a>
          <p className="text-sm mt-1 break-all">{cert}</p>
        </div>
      );
    } else {
      return (
        <div key={cert} className="p-2 border rounded shadow-md">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {cert}
          </a>
        </div>
      );
    }
  };

  // If loading, display a loading indicator or spinner
  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 flex items-center justify-center">
        <h2 className="text-xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center">View Certifications</h2>


      {/* If student & certifications exist, render them; otherwise show a message */}
      {student && student.certifications && student.certifications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {student.certifications.map((cert) => renderCertification(cert))}
        </div>
      ) : (
        student && <p className="text-center text-gray-600">No certifications found.</p>
      )}
    </div>
  );
};

export default ViewCertification;
