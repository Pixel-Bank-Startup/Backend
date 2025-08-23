const express = require("express");
const { handleCreateBadge, handleUpdateBadge, handleDeleteBadge } = require("../../../controller/adminController/badgeController/userBadge");
const router = express.Router();


router.post("/badges",  handleCreateBadge);
router.put("/badges/:id",  handleUpdateBadge);
router.delete("/badges/:id",  handleDeleteBadge);



module.exports = router;
