// server/migratePricesToPKR.js
// One-time helper: your existing seeded products have old USD-style numbers
// (e.g. 59.99). This multiplies every product's price by a conversion factor
// and rounds it to a clean PKR amount, so you don't have to edit each by hand.
//
// Usage: node migratePricesToPKR.js
// Safe to run only ONCE — running it twice will multiply prices again!
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const RATE = 280; // approx USD -> PKR, adjust if you'd rather set your own prices

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find();
  for (const p of products) {
    const newPrice = Math.round((p.price * RATE) / 10) * 10; // round to nearest 10
    console.log(`${p.name}: ${p.price} -> Rs ${newPrice}`);
    p.price = newPrice;
    await p.save();
  }

  console.log(`Done. Updated ${products.length} product(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
