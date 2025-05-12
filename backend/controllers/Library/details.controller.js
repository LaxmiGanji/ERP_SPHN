const libraryDetails = require("../../models/Library/details.model.js")

const getDetails = async (req, res) => {
    try {
        let user = await libraryDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Librarian Found" });
        }
        const data = {
            success: true,
            message: "Librarian Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error2" });
    }
}

const addDetails = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Debug request body
        const { libraryId, firstName, lastName, email, phoneNumber, gender } = req.body;

        // Validate required fields
        if (!libraryId || !firstName || !lastName || !email || !phoneNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // Check for existing librarian
        let user = await libraryDetails.findOne({ libraryId });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Librarian with this ID already exists.",
            });
        }

        // Create librarian
        user = await libraryDetails.create(req.body);
        res.json({
            success: true,
            message: "Library Details Added!",
            user,
        });
    } catch (error) {
        console.error("Error in addDetails:", error); // Log detailed error
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


const deleteDetails = async (req, res) => {
    let { id } = req.body;
    try {
        let user = await libraryDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Librarian Found",
            });
        }
        const data = {
            success: true,
            message: "Deleted Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error2" });
    }
}

const getCount = async (req, res) => {
    try {
        let user = await libraryDetails.count(req.body);
        const data = {
            success: true,
            message: "Count Successfull!",
            user,
        };
        res.json(data);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error2", error });
    }
}

module.exports = { getDetails, addDetails, deleteDetails, getCount }