const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bid_amount: {
    type: Number,
    required: true,
    min: 0
  },
  bid_time: {
    type: Date,
    default: Date.now
  },
  is_winning_bid: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Bid', bidSchema);
