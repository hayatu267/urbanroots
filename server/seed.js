// server/seed.js
// One-time script to create (or promote) the admin account.
// Usage: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  { name: 'UrbanLow - Classic', price: 59.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', category: 'Sneakers', stock: 20 },
  { name: 'CityTrek - High Top', price: 69.99, image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800', category: 'Sneakers', stock: 15 },
  { name: 'EcoSlide - Slip On', price: 39.99, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', category: 'Casual', stock: 25 },
  { name: 'MountainFlex - Outdoor', price: 74.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', category: 'Outdoor', stock: 10 },
];

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function run() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before running this script.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email: ADMIN_EMAIL });

  if (user) {
    user.role = 'admin';
    await user.save();
    console.log(`Existing user ${ADMIN_EMAIL} promoted to admin.`);
  } else {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Seeded ${sampleProducts.length} sample products.`);
  } else {
    console.log(`Skipped product seeding — ${productCount} products already exist.`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
