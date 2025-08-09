const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../Controller/profilecontroller");
router.post("/getuserprofile/profile", getUserProfile);
module.exports = router;
