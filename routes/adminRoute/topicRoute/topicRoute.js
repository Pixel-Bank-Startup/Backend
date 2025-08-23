const express = require("express");
const { createTopic, getTopicsByCollection, getTopicById, updateTopic, deleteTopic } = require("../../../controller/adminController/topics/topicController");
const router = express.Router();


router.post("/collections/:collectionId/topics", createTopic);

router.get("/collections/:collectionId/topics", getTopicsByCollection);

router.get("/topics/:id", getTopicById);
router.put("/topics/:id", updateTopic);
router.delete("/topics/:id", deleteTopic);

module.exports = router;
