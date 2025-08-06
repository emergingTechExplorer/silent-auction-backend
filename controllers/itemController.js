const Item = require("../models/Item");
const Bid = require("../models/Bid");

// @desc    Upload a new auction item
// @route   POST /api/items
// @access  Private (seller only)
// exports.uploadItem = async (req, res) => {
//   const { title, description, starting_bid, deadline, category, images } = req.body;

//   try {
//     const item = await Item.create({
//       user_id: req.user._id,
//       title,
//       description,
//       category,
//       starting_bid,
//       deadline,
//       images
//     });

//     res.status(201).json(item);
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.uploadItem = async (req, res) => {
  const { title, description, starting_bid, deadline, category } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
    const item = await Item.create({
      user_id: req.user._id,
      title,
      description,
      category,
      starting_bid,
      deadline,
      images: imagePath ? [imagePath] : [],
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all auction items
// @route   GET /api/items
// @access  Public
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ deadline: -1 });
    res.json(items);
  } catch (error) {
    console.error("Get all items error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "user_id",
      "name email"
    );
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Get item by ID error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Edit an auction item (only if no bids yet)
// @route   PUT /api/items/:id
// @access  Private (owner only)
exports.updateItem = async (req, res) => {
  const { title, description, starting_bid, deadline, category, images } =
    req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your item" });
    }

    const existingBids = await Bid.findOne({ item_id: item._id });
    if (existingBids) {
      return res
        .status(400)
        .json({ message: "Cannot edit item: bids have already been placed." });
    }

    item.title = title || item.title;
    item.description = description || item.description;
    item.starting_bid = starting_bid || item.starting_bid;
    item.deadline = deadline || item.deadline;
    item.category = category || item.category;
    item.images = images || item.images;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete an auction item (only if no bids yet)
// @route   DELETE /api/items/:id
// @access  Private (owner only)
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: not your item" });
    }

    const existingBids = await Bid.findOne({ item_id: item._id });
    if (existingBids) {
      return res
        .status(400)
        .json({ message: "Cannot delete: bids already placed." });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all items uploaded by the logged-in user
// @route   GET /api/items/my
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .populate({
        path: "bids", // virtual populate field
        options: { sort: { bid_amount: -1 } },
      });

    res.json(items);
  } catch (err) {
    console.error("Error fetching user items:", err);
    res.status(500).json({ message: err.message });
  }
};