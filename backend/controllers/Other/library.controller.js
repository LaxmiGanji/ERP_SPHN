const Library = require("../../models/Other/library.model.js");

const addLibraryBook = async (req, res) => {
    let { bookName, bookCode, author, genre, quantity } = req.body;
    try {
        let libraryBook = await Library.findOne({ bookCode });
        if (libraryBook) {
            return res
                .status(400)
                .json({ success: false, message: "Book Already Exists" });
        }
        await Library.create({
            bookName,
            bookCode,
            author,
            genre,
            quantity,
        });
        const data = {
            success: true,
            message: "Book Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error2" });
    }
}

const updateLibraryBook = async (req, res) => {
    let { bookName, bookCode, author, genre, quantity } = req.body;
    try {
        let notice = await Library.findByIdAndUpdate(req.params.id, {
            bookName,
            bookCode,
            author,
            genre,
            quantity,
        });
        if (!notice) {
            return res
                .status(400)
                .json({ success: false, message: "No Book Available!" });
        }
        res.json({
            success: true,
            message: "Book Updated Successfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteLibraryBook = async (req, res) => {
    try {
        let book = await Library.findByIdAndDelete(req.params.id);
        if (!book) {
            return res
                .status(400)
                .json({ success: false, message: "No Book Exists!" });
        }
        const data = {
            success: true,
            message: "Book Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }  
}

const getLibraryBook = async (req, res) => {
    try {
        let book = await Library.find();
        if (!book) {
            return res
                .status(400)
                .json({ success: false, message: "No Book Available" });
        }
        const data = {
            success: true,
            message: "All Books Loaded!",
            book,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const searchLibraryBooks = async (req, res) => {
    const query = req.query.query;
    try {
      const books = await Library.find({
        $or: [
          { bookName: new RegExp(query, "i") },
          { author: new RegExp(query, "i") },
          { bookCode: new RegExp(query, "i") },
        ],
      });
      res.json({ success: true, books });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };



module.exports = { getLibraryBook, addLibraryBook, deleteLibraryBook, updateLibraryBook, searchLibraryBooks }
