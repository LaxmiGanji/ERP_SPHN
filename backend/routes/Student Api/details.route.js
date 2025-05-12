const express = require("express");
const router = express.Router();
const upload = require("../../middlewares/multer.middleware.js");
const studentDetails = require("../../models/Students/details.model.js");

const {
  getDetails,
  getDetails2,
  getDetailsByEnrollment,
  addDetails,
  updateDetails,
  updateDetails2,
  deleteDetails,
  getCount,
  assignBooksToStudent,
  returnBooks,
  searchStudents,
} = require("../../controllers/Student/details.controller.js");

// Routes
router.post("/getDetails", getDetails);
router.get("/getDetails2", getDetails2);
router.get("/getDetailsByEnrollment", getDetailsByEnrollment);
router.post("/addDetails", upload.single("profile"), addDetails);
router.put("/updateDetails/:id", upload.single("profile"), updateDetails);
router.put("/updateDetails2/:id", upload.single("profile"), updateDetails2);
router.delete("/deleteDetails/:id", deleteDetails);
router.get("/count", getCount);
router.post("/assignBooks", assignBooksToStudent);
router.post("/returnBooks", returnBooks);
router.get("/search", searchStudents);
router.get("/findByBook", async (req, res) => {
  try {
    const { bookId } = req.query;
    
    if (!bookId) {
      return res.status(400).json({ 
        success: false, 
        message: "Book ID is required" 
      });
    }

    const students = await studentDetails.find({
      'books.bookId': bookId,
      'books.status': 'issued'
    }).select('firstName lastName enrollmentNo branch');

    res.json({
      success: true,
      students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
});

module.exports = router;