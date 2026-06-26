const cloudinary = require('../config/cloudinary');

// POST /api/upload  (admin only) — accepts multipart/form-data field "image"
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Convert the in-memory buffer to a data URI Cloudinary can accept directly
    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'urbanroots-products',
    });

    res.status(201).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};
