const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  stock: { type: Number, default: 0, min: 0 },
  sizes: { type: [String], default: [] },
  discountPercent: { type: Number, default: 0, min: 0, max: 90 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
