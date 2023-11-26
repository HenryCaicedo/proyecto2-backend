// src/user/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  isAdminRestaurant: {
    type: Boolean,
    required: true
  },
  active: {
    type: Boolean,
    default: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
