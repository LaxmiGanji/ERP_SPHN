const mongoose = require("mongoose");

const Marks = new mongoose.Schema({
  enrollmentNo: {
    type: String,
    required: true,
  },
  internal: {
    type: {},
  },
  external: {
    type: {},
  }
}, { timestamps: true });

module.exports = mongoose.model("Mark", Marks);
