const Newsletter = require('../models/Newsletter');

// POST /api/newsletter  (public)
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const newEntry = new Newsletter({ email });
    await newEntry.save();
    res.status(201).json({ message: 'Subscribed!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
};

// GET /api/newsletter  (admin only - see who has subscribed)
exports.getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
};
