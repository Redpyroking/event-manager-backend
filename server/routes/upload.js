const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Configure multer to store the file temporarily
const upload = multer({ dest: 'uploads/' });

// POST /api/upload - upload an image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Upload the file from the temporary folder
    const result = await cloudinary.uploader.upload(req.file.path);
    // Remove the temporary file
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
