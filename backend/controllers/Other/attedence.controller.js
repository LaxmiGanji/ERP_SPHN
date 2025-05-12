const Attendance = require("../../models/Other/attedence.model");

const addAttendance = async (req, res) => {
  try {
    const { enrollmentNo, branch, subject, period } = req.body;

    // Create a new attendance record
    const attendance = new Attendance({
      enrollmentNo,
      branch,
      subject,
      period,
    });

    await attendance.save();
    res.status(200).json({ success: true, message: "Attendance added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add attendance", error });
  }
};

const removeAttendance = async (req, res) => {
  try {
    const { enrollmentNo, branch, subject, period } = req.body;

    // Find and remove attendance record based on criteria
    const result = await Attendance.findOneAndDelete({
      enrollmentNo,
      branch,
      subject,
      period,
    });

    if (result) {
      res.status(200).json({ success: true, message: "Attendance removed successfully" });
    } else {
      res.status(404).json({ success: false, message: "Attendance record not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to remove attendance", error });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance records",
      error
    });
  }
};

const getStudentAttendance = async (req, res) => {
  try {
    const { enrollmentNo } = req.params;

    // Find all attendance records for the given student
    const attendanceRecords = await Attendance.find({ enrollmentNo });

    // Calculate total attendance
    const totalAttendance = attendanceRecords.length;

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      totalAttendance,
      attendanceRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student attendance",
      error,
    });
  }
};

module.exports = { addAttendance, removeAttendance, getAllAttendance, getStudentAttendance };