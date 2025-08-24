const Plan = require("../../../model/premiumPlan/planModel");

const handleCreatePlan = async (req, res) => {
  try {
    const { name, description, price, currency, durationInDays, features  } = req.body;


    if (!name || price == null || durationInDays == null) {
      return res.status(400).json({ message: "Missing required fields: name, price, durationInDays" });
    }

    const exists = await Plan.findOne({ name });
    if (exists) return res.status(409).json({ message: "Plan with this name already exists" });

    const plan = await Plan.create({
      name,
      description,
      price,
      currency,
      durationInDays,
      features,
    });

    return res.status(201).json({ message: "Plan created successfully", plan });
  } catch (err) {
    console.error("createPlan err:", err);
    return res.status(500).json({ message: "Error creating plan", error: err.message });
  }
};


const handleUpdatePlan = async (req, res) => {
  try {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid plan id" });

    const allowed = ["name", "description", "price", "currency", "durationInDays", "features", "isActive"];
    const updateData = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    if (updateData.name) {
      const dup = await Plan.findOne({ name: updateData.name, _id: { $ne: id } });
      if (dup) return res.status(409).json({ message: "Another plan with this name already exists" });
    }

    const updated = await Plan.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Plan not found" });

    return res.status(200).json({ message: "Plan updated", plan: updated });
  } catch (err) {
    console.error("updatePlan err:", err);
    return res.status(500).json({ message: "Error updating plan", error: err.message });
  }
};


const handleDeletePlan = async (req, res) => {
  try {
  
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid plan id" });

    const deleted = await Plan.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Plan not found" });

    return res.status(200).json({ message: "Plan deleted", plan: deleted });
  } catch (err) {
    console.error("deletePlan err:", err);
    return res.status(500).json({ message: "Error deleting plan", error: err.message });
  }
};


const handleGetPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1, durationInDays: -1 });
    return res.status(200).json(plans);
  } catch (err) {
    console.error("getPlans err:", err);
    return res.status(500).json({ message: "Error fetching plans", error: err.message });
  }
};


const handleGetPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid plan id" });

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    return res.status(200).json(plan);
  } catch (err) {
    console.error("getPlanById err:", err);
    return res.status(500).json({ message: "Error fetching plan", error: err.message });
  }
};

module.exports = {
  handleCreatePlan,
  handleUpdatePlan,
  handleDeletePlan,
  handleGetPlans,
  handleGetPlanById
};
