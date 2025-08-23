const Topic = require("../../../model/topics/topicModel");
const ProblemCollection = require("../../../model/collections/collectionModel");


const createTopic = async (req, res) => {
  try {
    const { collectionId } = req.params; 
    const { name, description } = req.body;
    const collection = await ProblemCollection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

 
    const exists = await Topic.findOne({ name, collection: collectionId });
    if (exists) return res.status(400).json({ message: "Topic already exists in this collection" });

    const topic = await Topic.create({ name, description, collection: collectionId });
    res.status(201).json(topic);
  } catch (err) {
    res.status(500).json({ message: "Error creating topic", error: err.message });
  }
};


const getTopicsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const topics = await Topic.find({ collection: collectionId }).sort({ createdAt: -1 });
    res.status(200).json(topics);
  } catch (err) {
    res.status(500).json({ message: "Error fetching topics", error: err.message });
  }
};


const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findById(id).populate("collection");
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(topic);
  } catch (err) {
    res.status(500).json({ message: "Error fetching topic", error: err.message });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const updated = await Topic.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating topic", error: err.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Topic.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json({ message: "Topic deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting topic", error: err.message });
  }
};

module.exports = {
  createTopic,
  getTopicsByCollection,
  getTopicById,
  updateTopic,
  deleteTopic,
};
