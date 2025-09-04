const express = require("express");
const {  handleUpdateUserProfile, handleUpdateUserVisibility } = require("../../controller/profileController/userProfileController");
const upload = require("../../cloudinaryService/upload");
const router = express.Router();

router.patch("/profile",upload.single('profilePic'),handleUpdateUserProfile);
router.patch("/profile/visibility", handleUpdateUserVisibility);

module.exports = router;