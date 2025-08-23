const express = require("express");
const {
    handleCreateTopic,
    handleGetTopicsByCollection,
    handleGetTopicById,
    handleUpdateTopic,
    handleDeleteTopic
} = require("../../../controller/adminController/topics/topicController");
const router = express.Router();


router.post("/collection/:collectionId/topics/add", handleCreateTopic);
router.get("/collection/:collectionId/topics", handleGetTopicsByCollection);
router.get("/collection/topics/:id", handleGetTopicById);
router.put("/collection/topics/:id", handleUpdateTopic);
router.delete("/collection/topics/:id", handleDeleteTopic);

module.exports = router;
