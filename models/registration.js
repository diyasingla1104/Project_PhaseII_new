const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  age: Number,
  weight: Number,
  goal: String,
  domain: String,
  program: String,
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('registration', registrationSchema);
