const express = require("express");
const { handleGetTopicsByCollection, handleGetTopicById } = require("../../controller/adminController/topics/topicController");

const router = express.Router();

router.get("/collection/:collectionId/topics", handleGetTopicsByCollection);
router.get("/collection/topics/:id", handleGetTopicById);

module.exports = router;
