const express = require("express");
const { handleGetProfile, handleUpdateUserProfile } = require("../../controller/profileController/userProfileController");
const upload = require("../../cloudinaryService/upload");
const router = express.Router();

router.get("/profile", handleGetProfile);
router.patch("/profile",upload.single('profilePic'),handleUpdateUserProfile);

module.exports = router;