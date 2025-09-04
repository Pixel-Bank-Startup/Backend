const User = require("../../model/authModel/userModel");

const handleUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, gitHubUsername, linkedInProfileURL, kaggleUsername } =
      req.body;
    const profilePic = req.file ? req.file.path : undefined;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (gitHubUsername) updateData.gitHubUsername = gitHubUsername;
    if (profilePic) updateData.profilePic = profilePic;
    if (linkedInProfileURL) updateData.linkedInProfileURL = linkedInProfileURL;
    if (kaggleUsername) updateData.kaggleUsername = kaggleUsername;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

const handleGetProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile Fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleUpdateUserVisibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isEmailVisible, isSocialVisible, isBadgeVisible } = req.body;

    const updateFields = {};
    if (typeof isEmailVisible === "boolean")
      updateFields.isEmailVisible = isEmailVisible;
    if (typeof isSocialVisible === "boolean")
      updateFields.isSocialVisible = isSocialVisible;
    if (typeof isBadgeVisible === "boolean")
      updateFields.isBadgeVisible = isBadgeVisible;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password"); 

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User visibility settings updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleUpdateUserProfile,
  handleGetProfile,
  handleUpdateUserVisibility,
};
