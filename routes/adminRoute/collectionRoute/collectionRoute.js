const express = require("express");
const {
  handleCreateCollection,
  handleUpdateCollection,
  handleDeleteCollection
} = require("../../../controller/adminController/collections/collectionController");
const upload = require("../../../cloudinaryService/upload");

const router = express.Router();

router.post("/collection/add",upload.single('coverImageUrl'), handleCreateCollection);
router.put("/collection/:id",upload.single('coverImageUrl'), handleUpdateCollection);
router.delete("/collection/:id", handleDeleteCollection);

module.exports = router;
