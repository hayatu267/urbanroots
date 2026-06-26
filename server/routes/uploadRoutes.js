const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

// Store the file in memory (not on disk) since we forward it straight to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

module.exports = router;
