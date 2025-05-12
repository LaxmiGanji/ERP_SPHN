const Subject = require("../../models/Other/subject.model");

const getSubject = async (req, res) => {
    try {
        let subject = await Subject.find().select('name code total semester _id');
        if (!subject || subject.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "No Subject Available" });
        }
        const data = {
            success: true,
            message: "All Subject Loaded!",
            subject,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateSubject = async (req, res) => {
    let { name, code, total, semester } = req.body;
    try {
        // Convert semester to Number
        semester = Number(semester);
        
        let subject = await Subject.findByIdAndUpdate(req.params.id, {
            name,
            code,
            total,
            semester,
        }, { new: true });
        
        if (!subject) {
            return res
                .status(400)
                .json({ success: false, message: "No Subject Available!" });
        }
        res.json({
            success: true,
            message: "Subject Updated Successfully",
            subject
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addSubject = async (req, res) => {
    console.log("Received Data:", req.body);
    let { name, code, total, semester } = req.body;
   
    try {
        // Convert semester to Number
        semester = Number(semester);
        
        let existingSubject = await Subject.findOne({ code });
        if (existingSubject) {
            return res.status(400).json({ success: false, message: "Subject Already Exists" });
        }
        
        const subject = await Subject.create({ 
            name, 
            code, 
            total, 
            semester 
        });
       
        res.json({ 
            success: true, 
            message: "Subject Added!",
            subject
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteSubject = async (req, res) => {
    try {
        let subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res
                .status(400)
                .json({ success: false, message: "No Subject Exists!" });
        }
        const data = {
            success: true,
            message: "Subject Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

module.exports = { getSubject, addSubject, deleteSubject, updateSubject }