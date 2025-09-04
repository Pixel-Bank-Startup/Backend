const Problem = require('../../../model/problemModel/problem');
const Topic = require("../../../model/topics/topicModel");
const Collection = require("../../../model/collections/collectionModel");
const submissionModel = require('../../../model/submissionModel/submissionModel');
const User = require('../../../model/authModel/userModel');

const handleAddProblems = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    category,
    constraints,
    sample,
    testCases,
    explanation,
    languages,
    collectionId,
    topicId,
    starterCode,
    aboutTopic,
    solutionCode,
  } = req.body;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const existingProblem = await Problem.findOne({ title, collectionId, topicId });
    if (existingProblem) {
      return res.status(400).json({
        message: "Problem with this title already exists in this collection & topic",
      });
    }


    const newProblem = new Problem({
      title,
      description,
      difficulty,
      category,
      constraints,
      aboutTopic,
      sample,        
      testCases,
      explanation,
      languages,
      collectionId,
      topicId,
      solutionCode,
       starterCode: starterCode || {}
    });

    await newProblem.save();

    res.status(201).json({
      message: "Problem added successfully",
      problem: newProblem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding problem",
      error: error.message,
    });
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
    if (solutionCode) updateData.solutionCode = solutionCode;

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

//testing

const handleGetProblems = async (req, res) => {
  try {
    
    const userId = req.user?.id;


    let solvedProblemIds = [];
    if (userId) {
      const user = await User.findById(userId).select("solvedProblems").lean();
      console.log("User document fetched:", user);

      if (user && Array.isArray(user.solvedProblems)) {
        solvedProblemIds = user.solvedProblems.map(sp => sp.problemId.toString());
        console.log("Solved problem IDs:", solvedProblemIds);
      } else {
        console.log("User not found or no solvedProblems");
      }
    } else {
      console.log("No user ID provided in request, all problems will be returned as is");
    }

    const problems = await Problem.find({}, "_id title difficulty category status problemId")
      .sort({ createdAt: -1 })
      .lean();

    console.log("Fetched problems from DB:", problems.map(p => ({ id: p._id, title: p.title })));

    const finalProblems = problems.map(p => {
      const isSolved = solvedProblemIds.includes(p._id.toString());
      console.log(`Problem: ${p.title}, ID: ${p._id}, Solved: ${isSolved}`);
      return { ...p, status: isSolved ? "Solved" : "Unsolved" };
    });

    console.log("Final formatted problems to return:", finalProblems.map(p => ({ title: p.title, status: p.status, difficulty: p.difficulty, category: p.category })));

    res.status(200).json(finalProblems);
    console.log("Fetching Problems Completed");
  } catch (error) {
    console.error("Error in handleGetProblems:", error);
    res.status(500).json({ message: "Error fetching problems", error: error.message });
  }
};
const handleGetProblemById = async (req, res) => {
  const { id } = req.params;
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
