const express = require("express");
const router = express.Router();
const { getDetails, addDetails, deleteDetails, getCount } = require("../../controllers/Library/details.controller.js");
const upload = require("../../middlewares/multer.middleware.js")
router.post("/getDetails", getDetails);

router.post("/addDetails", addDetails);

router.delete("/deleteDetails/:id", deleteDetails);

router.get("/count", getCount);

module.exports = router;
