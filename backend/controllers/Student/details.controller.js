const studentDetails = require("../../models/Students/details.model.js");
const Library = require("../../models/Other/library.model.js");

const getDetails = async (req, res) => {
  try {
    const user = await studentDetails.find(req.body).populate("books.bookId", "bookName author bookCode");

    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, message: "No Student Found" });
    }

    res.json({ success: true, message: "Student Details Found!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getDetails2 = async (req, res) => {
  try {
    const students = await studentDetails.find().populate("books.bookId", "bookName author");

    if (!students || students.length === 0) {
      return res.status(404).json({ success: false, message: "No Students Found" });
    }

    res.json({ success: true, message: "Student Details Found!", students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const getDetailsByEnrollment = async (req, res) => {
  try {
    const { enrollmentNo } = req.query;
    if (!enrollmentNo) {
      return res.status(400).json({ success: false, message: "Enrollment number is required" });
    }

    const student = await studentDetails.findOne({ enrollmentNo }).populate("books.bookId", "bookName author bookCode");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Student Details Found!", user: [student] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

const addDetails = async (req, res) => {
  try {
    const existing = await studentDetails.findOne({ enrollmentNo: req.body.enrollmentNo });
    if (existing) {
      return res.status(400).json({ success: false, message: "Student With This Enrollment Already Exists" });
    }

    const user = await studentDetails.create({ ...req.body, profile: req.file?.filename });
    res.json({ success: true, message: "Student Details Added!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateDetails = async (req, res) => {
  try {
    const updateData = req.file ? { ...req.body, profile: req.file.filename } : req.body;
    const user = await studentDetails.findByIdAndUpdate(req.params.id, updateData);

    if (!user) {
      return res.status(400).json({ success: false, message: "No Student Found" });
    }

    res.json({ success: true, message: "Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateDetails2 = async (req, res) => {
  try {
    const enrollmentNo = req.params.id;
    let user;

    if (req.body?.type === "certification" && req.file) {
      user = await studentDetails.findOneAndUpdate(
        { enrollmentNo },
        { $push: { certifications: req.file.filename } },
        { new: true }
      );
    } else if (req.body?.type === "profile") {
      user = await studentDetails.findOneAndUpdate(
        { enrollmentNo },
        req.file ? { ...req.body, profile: req.file.filename } : req.body,
        { new: true }
      );
    } else {
      user = await studentDetails.findOneAndUpdate(
        { enrollmentNo },
        req.file ? { ...req.body, file: req.file.filename } : req.body,
        { new: true }
      );
    }

    if (!user) return res.status(400).json({ success: false, message: "No Student Found" });

    res.json({ success: true, message: "Updated Successfully!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteDetails = async (req, res) => {
  try {
    const user = await studentDetails.findByIdAndDelete(req.params.id);
    if (!user) return res.status(400).json({ success: false, message: "No Student Found" });

    res.json({ success: true, message: "Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCount = async (req, res) => {
  try {
    const user = await studentDetails.count(req.body);
    res.json({ success: true, message: "Count Successful!", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error });
  }
};

const assignBooksToStudent = async (req, res) => {
  const { enrollmentNo, bookIds } = req.body;

  try {
    if (!enrollmentNo || !bookIds?.length) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const student = await studentDetails.findOne({ enrollmentNo }).populate("books.bookId", "bookName author");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const existingBookIds = student.books
      .filter(book => book.status === "issued")
      .map(book => book.bookId._id.toString());

    const newBookIds = bookIds.filter(id => !existingBookIds.includes(id.toString()));

    if (newBookIds.length === 0) {
      return res.json({ success: true, message: "All selected books are already assigned to this student", student });
    }

    const books = await Library.find({ _id: { $in: newBookIds } });
    const unavailableBooks = books.filter(book => (book.issuedCount || 0) >= book.quantity);

    if (unavailableBooks.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some books are not available",
        unavailableBooks: unavailableBooks.map(book => book.bookName),
      });
    }

    const newAssignments = newBookIds.map(bookId => ({
      bookId,
      issueDate: new Date(),
      status: "issued",
    }));

    student.books.push(...newAssignments);
    await student.save();

    await Library.updateMany({ _id: { $in: newBookIds } }, { $inc: { issuedCount: 1 } });

    res.json({ success: true, message: `${newBookIds.length} book(s) assigned successfully`, student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const returnBooks = async (req, res) => {
  const { enrollmentNo, bookIds } = req.body;

  try {
    if (!enrollmentNo || !bookIds?.length) {
      return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    const student = await studentDetails.findOneAndUpdate(
      { enrollmentNo },
      { $pull: { books: { bookId: { $in: bookIds }, status: "issued" } } },
      { new: true }
    ).populate("books.bookId", "bookName author");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await Library.updateMany({ _id: { $in: bookIds } }, { $inc: { issuedCount: -1 } });

    res.json({ success: true, message: "Books returned successfully", student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const searchStudents = async (req, res) => {
  try {
    const query = req.query.query;
    const students = await studentDetails.find({
      $or: [
        { firstName: new RegExp(query, "i") },
        { lastName: new RegExp(query, "i") },
        { enrollmentNo: new RegExp(query, "i") },
      ],
    });
    res.json({ students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Search failed", error: error.message });
  }
};

module.exports = {
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
};
