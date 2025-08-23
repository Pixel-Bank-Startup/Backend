const ProblemCollection = require("../../../model/collections/collectionModel");


const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await ProblemCollection.findOne({ name });
    if (exists) return res.status(400).json({ message: "Collection already exists" });

    const collection = await ProblemCollection.create({ name, description });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Error creating collection", error: err.message });
  }
};


const getCollections = async (req, res) => {
  try {
    const collections = await ProblemCollection.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collections", error: err.message });
  }
};


const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await ProblemCollection.findById(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(collection);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collection", error: err.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const { name, description } = req.body;
    if (name) updateData.name = name;
    if (description) updateData.description = description;

    const updated = await ProblemCollection.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating collection", error: err.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProblemCollection.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Collection not found" });
    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting collection", error: err.message });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};
