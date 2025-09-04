const express = require("express");
const { handleGetProfile } = require("../../controller/profileController/userProfileController");

const router = express.Router();

router.get("/profile/:userId", handleGetProfile);


module.exports = router;