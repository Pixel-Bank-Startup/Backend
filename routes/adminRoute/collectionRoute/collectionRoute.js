const express = require("express");
const {
  handleCreateCollection,
  handleUpdateCollection,
  handleDeleteCollection
} = require("../../../controller/adminController/collections/collectionController");

const router = express.Router();

router.post("/collection/add", handleCreateCollection);
router.put("/collection/:id", handleUpdateCollection);
router.delete("/collection/:id", handleDeleteCollection);

module.exports = router;
