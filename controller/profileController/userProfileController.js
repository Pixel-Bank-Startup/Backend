const User = require("../../model/authModel/userModel");

const handleUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { fullName, gitHubUsername, linkedInProfileURL, kaggleUsername } = req.body;
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
    const user = await User.findById(req.user.id)
    .select('-password')

    if (!user) return res.status(404).json({ message: 'User not found' });

      res.status(200).json({
      message: "Profile Fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  handleUpdateUserProfile,
  handleGetProfile,
}
