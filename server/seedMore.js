// server/seedMore.js
// Adds a batch of extra sample products WITHOUT touching existing ones.
// Safe to re-run — it skips any product whose name already exists.
// Usage: node seedMore.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const moreProducts = [
  { name: 'AirGlide - Runner', price: 64.99, image: 'https://images.unsplash.com/photo-1517260911058-6b03f56d6c41?w=800', category: 'Sneakers', stock: 18, sizes: ['7', '8', '9', '10', '11'], discountPercent: 0 },
  { name: 'StreetForce - Hi', price: 79.99, image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800', category: 'Sneakers', stock: 12, sizes: ['8', '9', '10', '11'], discountPercent: 15 },
  { name: 'CanvasWalk - Low', price: 44.99, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', category: 'Casual', stock: 30, sizes: ['6', '7', '8', '9', '10'], discountPercent: 0 },
  { name: 'TrailBlaze - Hiker', price: 89.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', category: 'Outdoor', stock: 8, sizes: ['8', '9', '10', '11', '12'], discountPercent: 10 },
  { name: 'RetroCourt - Classic', price: 54.99, image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', category: 'Sneakers', stock: 22, sizes: ['7', '8', '9', '10'], discountPercent: 0 },
  { name: 'FlexFoam - Comfort', price: 49.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', category: 'Casual', stock: 16, sizes: ['6', '7', '8', '9'], discountPercent: 20 },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let added = 0;
  for (const p of moreProducts) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      console.log(`Skipped (already exists): ${p.name}`);
      continue;
    }
    await Product.create(p);
    console.log(`Added: ${p.name}`);
    added++;
  }

  console.log(`Done. Added ${added} new product(s).`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
