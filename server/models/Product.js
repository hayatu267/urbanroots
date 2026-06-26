const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  stock: { type: Number, default: 0, min: 0 },
  sizes: { type: [String], default: [] },
  discountPercent: { type: Number, default: 0, min: 0, max: 90 },
  reviews: { type: [reviewSchema], default: [] },
  avgRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
