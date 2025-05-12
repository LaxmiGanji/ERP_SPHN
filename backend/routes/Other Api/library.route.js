const express = require("express");
const router = express.Router();
const { getLibraryBook, addLibraryBook, updateLibraryBook, deleteLibraryBook, searchLibraryBooks } = require("../../controllers/Other/library.controller.js");
const Library = require("../../models/Other/library.model.js");

router.get("/getLibraryBook", getLibraryBook);
router.post("/addLibraryBook", addLibraryBook);
router.put("/updateLibraryBook/:id", updateLibraryBook);
router.delete("/deleteLibraryBook/:id", deleteLibraryBook);
//router.get("/search", searchLibraryBooks);
router.get("/search", async (req, res) => {
  const query = req.query.query;
  
  try {
    // For string fields (bookName, author)
    const stringQuery = {
      $or: [
        { bookName: new RegExp(query, "i") },
        { author: new RegExp(query, "i") }
      ]
    };

    // For numeric field (bookCode) - only if query is numeric
    let numericQuery = {};
    if (!isNaN(query)) {
      numericQuery = { bookCode: parseInt(query) };
    }

    // Combine queries
    const searchQuery = !isNaN(query) 
      ? { $or: [stringQuery, numericQuery] }
      : stringQuery;

    const books = await Library.find(searchQuery);
    res.json({ success: true, books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
  

module.exports = router; 