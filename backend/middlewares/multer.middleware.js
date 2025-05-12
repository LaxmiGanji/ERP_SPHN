const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./media");
  },
  filename: function (req, file, cb) {
    let filename = "";
    if (req.body?.type === "timetable") {
      filename = `Timetable_${req.body.semester}_Semester_${req.body.branch}.png`;
    } else if (req.body?.type === "profile") {
      if (req.body.enrollmentNo) {
        filename = `Student_Profile_${req.body.enrollmentNo}_Semester_${req.body.branch}.png`;
      } else {
        filename = `Faculty_Profile_${req.body.employeeId}.png`;
      }
    } else if (req.body?.type === "material") {
      filename = `${req.body.title}_Subject_${req.body.subject}.pdf`;
    } else if (req.body?.type === "certification") {
      const title = req.body.certificationTitle || "Certification";
      const ext = path.extname(file.originalname);
      filename = `Certification_${title}_${Date.now()}${ext}`;
    } else {
      // Default filename if no type is provided
      const ext = path.extname(file.originalname);
      filename = `File_${Date.now()}${ext}`;
    }
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
