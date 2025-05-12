const express = require("express");
const { getSubject, addSubject, deleteSubject, updateSubject } = require("../../controllers/Other/subject.controller");
const router = express.Router();

router.get("/getSubject", getSubject);
router.post("/addSubject", addSubject);
router.put("/updateSubject/:id", updateSubject);
router.delete("/deleteSubject/:id", deleteSubject);

module.exports = router;
