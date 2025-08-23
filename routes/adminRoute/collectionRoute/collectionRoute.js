const express = require("express");
const {createCollection, getCollections, getCollectionById, updateCollection, deleteCollection } = require("../../../controller/adminController/collections/collectionController");
const router = express.Router();



router.post("/", createCollection);
router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);

module.exports = router;
