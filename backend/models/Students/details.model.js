//details.model.js
const mongoose = require("mongoose");

const studentDetails = new mongoose.Schema({
  enrollmentNo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: false,
  },
  certifications: {
    type: [String],
    required: false,
    default: [],
  },
  books: {
    type: [{
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Library",
        required: true
      },
      issueDate: {
        type: Date,
        default: Date.now
      },
      returnDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['issued', 'returned'],
        default: 'issued'
      }
    }],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Student Detail", studentDetails);
