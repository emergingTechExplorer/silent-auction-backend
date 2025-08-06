const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private (only owner)
exports.getUserProfile = async (req, res) => {
  console.log("Token user ID:", req.user._id?.toString());
  console.log("Request param ID:", req.params.id);

  if (req.user._id?.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.params.id).select("-password_hash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user profile (name, profile_image)
// @route   PUT /api/users/:id
// @access  Private (only owner)
exports.updateUserProfile = async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const { name, profile_image } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.profile_image = profile_image || user.profile_image;

    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profile_image: updatedUser.profile_image,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Upload user profile image
// @route   POST /api/users/:id/upload-profile-image
// @access  Private
exports.uploadUserProfileImage = async (req, res) => {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profile_image = req.file.path; // Save relative path

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profile_image: req.file.path, // ✅ frontend expects this key
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile_image: updatedUser.profile_image,
      },
    });
  } catch (err) {
    console.error("Profile image upload error:", err);
    res.status(500).json({ message: err.message });
  }
};
