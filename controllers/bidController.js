const Bid = require("../models/Bid");
const Item = require("../models/Item");
const Notification = require("../models/Notification");

// @desc    Place a new bid
// @route   POST /api/bids
// @access  Private
exports.placeBid = async (req, res) => {
  const { item_id, bid_amount } = req.body;

  try {
    const item = await Item.findById(item_id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // ✅ Prevent user from bidding on their own item
    if (item.user_id.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "You cannot bid on your own item." });
    }

    if (item.status === "ended") {
      return res
        .status(400)
        .json({ message: "Bidding has ended for this item." });
    }

    // Find current highest bid for this item
    const highestBid = await Bid.findOne({ item_id }).sort({ bid_amount: -1 });

    // Validation: bid must be greater than starting_bid and highestBid (if exists)
    const minValidBid = highestBid ? highestBid.bid_amount : item.starting_bid;
    if (bid_amount <= minValidBid) {
      return res.status(400).json({
        message: `Your bid must be higher than $${minValidBid}`,
      });
    }

    // Mark previous highest bid as not winning
    if (highestBid) {
      highestBid.is_winning_bid = false;
      await highestBid.save();

      // Send notification to outbid user
      await Notification.create({
        user_id: highestBid.user_id,
        message: `You have been outbid on item: ${item.title}`,
        type: "outbid",
      });
    }

    // Save new bid
    const newBid = await Bid.create({
      item_id,
      user_id: req.user._id,
      bid_amount,
      is_winning_bid: true,
    });

    res.status(201).json(newBid);
  } catch (err) {
    console.error("Bid error:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all bids for a specific item
// @route   GET /api/bids/item/:id
// @access  Private
exports.getBidsByItem = async (req, res) => {
  try {
    const bids = await Bid.find({ item_id: req.params.id })
      .populate("user_id", "name email")
      .sort({ created_at: -1 });

    res.json(bids);
  } catch (err) {
    console.error("Error fetching bids for item:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all bids placed by a specific user
// @route   GET /api/bids/user/:id
// @access  Private
exports.getBidsByUser = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only view your own bids." });
    }

    const bids = await Bid.find({ user_id: req.user._id })
      .populate("item_id", "title images deadline")
      .sort({ bid_time: -1 });

    res.status(200).json(bids); // ✅ Must send an array
  } catch (err) {
    console.error("Error fetching user bids:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all unique items the user has placed bids on
// @route   GET /api/bids/my
// @access  Private
// @desc    Get all bids placed by the currently logged-in user
// @route   GET /api/bids/me
// @access  Private
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ user_id: req.user._id })
      .populate("item_id") // this makes item_id an object instead of just an ID
      .sort({ bid_time: -1 });

    res.status(200).json(bids);
  } catch (err) {
    console.error("Error fetching my bids:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get items the user has won
// @route   GET /api/bids/won
// @access  Private
exports.getWonBids = async (req, res) => {
  try {
    // Find winning bids by this user on items that have ended
    const winningBids = await Bid.find({
      user_id: req.user._id,
      is_winning_bid: true,
    })
      .populate({
        path: 'item_id',
        match: { status: 'ended' }, // Only items that are finished
        select: 'title images deadline status',
      })
      .sort({ bid_time: -1 });

    // Filter out nulls in case item is no longer found
    const filtered = winningBids.filter((b) => b.item_id !== null);

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Error fetching won bids:", err);
    res.status(500).json({ message: err.message });
  }
};