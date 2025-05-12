const mongoose = require("mongoose");

const Library = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  bookCode: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  issuedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Library", Library);
