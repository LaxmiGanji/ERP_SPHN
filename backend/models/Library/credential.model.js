const mongoose = require("mongoose");

const libraryCredential = new mongoose.Schema({
  loginid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Library Credential", libraryCredential);
