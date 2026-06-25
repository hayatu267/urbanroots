const ContactMessage = require('../models/ContactMessage');

// POST /api/contact  (public) — anyone can send a message
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const entry = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: 'Message sent successfully', entry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/contact  (admin only) — view all submitted messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/contact/:id/read  (admin only) — mark a message as read
exports.markAsRead = async (req, res) => {
  try {
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/contact/:id  (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
