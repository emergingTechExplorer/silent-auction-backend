const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password_hash: { type: String, required: true },
  profile_image: { type: String, default: '' },
  role: { type: String, enum: ['seller', 'bidder'], default: 'bidder' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
 
