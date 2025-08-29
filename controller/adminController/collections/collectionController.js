const ProblemCollection = require("../../../model/collections/collectionModel");
const Problem = require("../../../model/problemModel/problem");
const Topic = require("../../../model/topics/topicModel");

const handleCreateCollection = async (req, res) => {
  try {
    const { name, description, section, isPremium } = req.body;
    const coverImageUrl = req.file ? req.file.path : undefined;
    const exists = await ProblemCollection.findOne({ name });
    if (exists)
      return res.status(400).json({ message: "Collection already exists" });
    const collection = await ProblemCollection.create({
      name,
      description,
      section,
      coverImageUrl,
      isPremium,
    });
    res.status(201).json(collection);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating collection", error: err.message });
  }
};

const handleGetCollections = async (req, res) => {
  try {
    const collections = await ProblemCollection.find().sort({ createdAt: -1 });
    res.status(200).json(collections);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching collections", error: err.message });
  }
};

const handleGetCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await ProblemCollection.findById(id);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const topics = await Topic.find({ collectionId: id });

    const topicsWithQuestions = await Promise.all(
      topics.map(async (topic) => {
        const questions = await Problem.find(
          { topicId: topic._id },
          "_id title"
        );
        return { ...topic.toObject(), questions };
      })
    );

    res.status(200).json({
      ...collection.toObject(),
      topics: topicsWithQuestions,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching collection",
      error: err.message,
    });
  }
};

const handleUpdateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    const { name, description, section, isPremium } = req.body;
    const coverImageUrl = req.file ? req.file.path : req.body.coverImageUrl;
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (section) updateData.section = section;
    if (coverImageUrl) updateData.coverImageUrl = coverImageUrl;
    if (isPremium !== undefined) updateData.isPremium = isPremium;

    const updated = await ProblemCollection.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Collection not found" });
    res.status(200).json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating collection", error: err.message });
  }
};

const handleDeleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProblemCollection.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Collection not found" });
    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting collection", error: err.message });
  }
};

module.exports = {
  handleCreateCollection,
  handleGetCollections,
  handleGetCollectionById,
  handleUpdateCollection,
  handleDeleteCollection,
};
