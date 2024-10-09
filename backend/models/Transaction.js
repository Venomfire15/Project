const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productTitle: String,
  productDescription: String,
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);
