const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id:{
    type: String
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  join_date: {
    type: Date,
    required: false,
    default: Date.now,
  },
  cart: [{
    product_id: String,
    quantity: Number,
    title: String,
    price: Number
  }],
});

module.exports = mongoose.model("User", userSchema);
