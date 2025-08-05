const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String
  },
  starting_bid: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  images: [
    {
      type: String
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Virtual populate to link Item → Bid
itemSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "item_id",
});

// Ensure virtuals are included in JSON output
itemSchema.set("toObject", { virtuals: true });
itemSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);
