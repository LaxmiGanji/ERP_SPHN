const express = require("express");
const router = express.Router();
const { 
  addAttendance, 
  removeAttendance, 
  getAllAttendance,
  getStudentAttendance
} = require("../../controllers/Other/attedence.controller");

// Routes
router.post("/add", addAttendance);
router.post("/remove", removeAttendance);
router.get("/getAll", getAllAttendance);
router.get("/getStudentAttendance/:enrollmentNo", getStudentAttendance);


module.exports = router;