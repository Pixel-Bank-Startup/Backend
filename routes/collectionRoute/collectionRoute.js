const express = require("express");
const { handleGetCollections, handleGetCollectionById } = require("../../controller/adminController/collections/collectionController");


const router = express.Router();

router.get("/collection", handleGetCollections);
router.get("/collection/:id", handleGetCollectionById);
module.exports = router;
