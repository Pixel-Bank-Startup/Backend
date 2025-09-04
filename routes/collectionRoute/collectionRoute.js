const express = require("express");
const { handleGetCollections, handleGetCollectionById } = require("../../controller/adminController/collections/collectionController");
const optionalAuthentication = require("../../middleware/optionalMiddleware");


const router = express.Router();

router.get("/collection",optionalAuthentication('token') , handleGetCollections);
router.get("/collection/:id", optionalAuthentication('token'), handleGetCollectionById);
module.exports = router;
