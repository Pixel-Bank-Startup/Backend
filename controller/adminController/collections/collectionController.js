const mongoose = require("mongoose");
const ProblemCollection = require("../../../model/collections/collectionModel");
const Problem = require("../../../model/problemModel/problem");
const Topic = require("../../../model/topics/topicModel");
const User = require("../../../model/authModel/userModel");

async function getUserSolvedProblemIds(userId) {
  if (!userId) return [];
  const user = await User.findById(userId).select("solvedProblems");
  if (!user || !Array.isArray(user.solvedProblems)) return [];
  return user.solvedProblems
    .map(p => p.problemId)
    .filter(Boolean)
    .map(pid => (mongoose.isValidObjectId(pid) ? new mongoose.Types.ObjectId(pid) : null))
    .filter(Boolean);
}

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

// const handleGetCollections = async (req, res) => {
//   try {
//     const collections = await ProblemCollection.find().sort({ createdAt: -1 });
//     res.status(200).json(collections);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Error fetching collections", error: err.message });
//   }
// };


const handleGetCollections = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || null;

    const collections = await ProblemCollection.find().lean();
    if (!collections || collections.length === 0) {
      return res.status(200).json({ message: "Collections fetched", data: [] });
    }

    const collectionIds = collections.map(c => new mongoose.Types.ObjectId(c._id));

    const totalAgg = await Problem.aggregate([
      { $match: { collectionId: { $in: collectionIds } } },
      { $group: { _id: "$collectionId", total: { $sum: 1 } } }
    ]);

    const totalMap = {};
    totalAgg.forEach(a => {
      if (a._id) totalMap[a._id.toString()] = a.total;
    });

    if (!userId) {
      const result = collections.map(c => ({
        ...c,
        solvedCount: 0,
        totalQuestions: totalMap[c._id.toString()] || 0
      }));
      return res.status(200).json({ message: "Collections fetched", data: result });
    }

    const solvedIds = await getUserSolvedProblemIds(userId);
    if (!solvedIds.length) {
      const result = collections.map(c => ({
        ...c,
        solvedCount: 0,
        totalQuestions: totalMap[c._id.toString()] || 0
      }));
      return res.status(200).json({ message: "Collections fetched", data: result });
    }

    const solvedAgg = await Problem.aggregate([
      { $match: { _id: { $in: solvedIds } } },
      { $group: { _id: "$collectionId", count: { $sum: 1 } } }
    ]);

    const solvedMap = {};
    solvedAgg.forEach(a => {
      if (a._id) solvedMap[a._id.toString()] = a.count;
    });

    const result = collections.map(c => ({
      ...c,
      solvedCount: solvedMap[c._id.toString()] || 0,
      totalQuestions: totalMap[c._id.toString()] || 0
    }));

    return res.status(200).json({ message: "Collections fetched", data: result });
  } catch (error) {
    console.error("handleGetCollections:", error);
    return res.status(500).json({ message: error.message });
  }
};

// const handleGetCollectionById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const collection = await ProblemCollection.findById(id);
//     if (!collection) {
//       return res.status(404).json({ message: "Collection not found" });
//     }

//     const topics = await Topic.find({ collectionId: id });

//     const topicsWithQuestions = await Promise.all(
//       topics.map(async (topic) => {
//         const questions = await Problem.find(
//           { topicId: topic._id },
//           "_id title"
//         );
//         return { ...topic.toObject(), questions };
//       })
//     );

//     res.status(200).json({
//       ...collection.toObject(),
//       topics: topicsWithQuestions,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error fetching collection",
//       error: err.message,
//     });
//   }
// };


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

    const totalQuestions = topicsWithQuestions.reduce(
      (sum, t) => sum + (Array.isArray(t.questions) ? t.questions.length : 0),
      0
    );
    let solvedCount = 0;

    const userId = req.user?.id || req.user?.userId || null;

    if (userId) {
      const user = await User.findById(userId).select("solvedProblems");
      if (user && Array.isArray(user.solvedProblems) && user.solvedProblems.length > 0) {
        const solvedIds = user.solvedProblems
          .map((p) => p.problemId)
          .filter(Boolean)
          .map((pid) => (mongoose.isValidObjectId(pid) ? new mongoose.Types.ObjectId(pid) : null))
          .filter(Boolean);

        if (solvedIds.length > 0) {
          const topicIds = topics.map((t) => t._id).filter(Boolean);
          if (topicIds.length > 0) {
            solvedCount = await Problem.countDocuments({
              _id: { $in: solvedIds },
              topicId: { $in: topicIds },
            });
          }
        }
      }
    }

    res.status(200).json({
      ...collection.toObject(),
      topics: topicsWithQuestions,
      solvedCount,      
      totalQuestions,   
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
