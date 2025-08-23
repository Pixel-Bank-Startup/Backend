const Problem = require('../../../model/problemModel/problem');
const Topic = require("../../../model/topics/topicModel");
const Collection = require("../../../model/collections/collectionModel");

const handleAddProblems = async (req, res) => {

  const { collectionId,topicId,title, description, difficulty, category, constraints, sampleInput, sampleOutput, explanation } = req.body;
  try {

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const collection = await Collection.findById(collectionId);
    if (!collection) return res.status(404).json({ message: "Collection not found" });


    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(400).json({ message: "Problem with this title already exists" });
    }

    const newProblem = new Problem({
      title,
      description,
      difficulty,
      category,
      constraints,
      sampleInput,
      sampleOutput,
      explanation,
      topicId,
      collectionId,
    });

    await newProblem.save();
    res.status(201).json({ message: "Problem added successfully", problem: newProblem });
  } catch (error) {
    res.status(500).json({ message: "Error adding problem", error: error.message });
  }
};

const handleUpdateProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, difficulty, category, constraints, sampleInput, sampleOutput, explanation } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (difficulty) updateData.difficulty = difficulty;
    if (category) updateData.category = category;
    if (constraints) updateData.constraints = constraints;
    if (sampleInput) updateData.sampleInput = sampleInput;
    if (sampleOutput) updateData.sampleOutput = sampleOutput;
    if (explanation) updateData.explanation = explanation;

    const updatedProblem = await Problem.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ message: "Problem updated successfully", problem: updatedProblem });
  } catch (error) {
    res.status(500).json({ message: "Error updating problem", error: error.message });
  }
};


const handleDeleteProblem = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedProblem = await Problem.findByIdAndDelete(id);
    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting problem", error: error.message });
  }
};

const handleGetProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, "_id title difficulty category status")
      .sort({ createdAt: -1 });

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching problems",
      error: error.message,
    });
  }
};


const handleGetProblemById = async (req, res) => {
  const { id } = req.body;
  try {
    const problem = await Problem.findById(id)
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problem", error: error.message });
  }
};

const handleSearchProblems = async (req, res) => {
  try {
    const { title, category, difficulty } = req.query;
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const problems = await Problem.find(query).sort({ createdAt: -1 }).populate("topic").populate("collection");

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error searching problems", error: error.message });
  }
};


module.exports = {
  handleAddProblems,
  handleUpdateProblem,
  handleDeleteProblem,
  handleGetProblems,
  handleGetProblemById,
  handleSearchProblems
};
