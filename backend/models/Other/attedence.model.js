const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  enrollmentNo: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    reuired:true,
  },
  branch: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });



module.exports = mongoose.model("Attendance", attendanceSchema);
