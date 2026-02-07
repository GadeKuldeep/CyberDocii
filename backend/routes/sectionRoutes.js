const express = require('express');
const router = express.Router();
const { getSections, createSection, updateSection, deleteSection, reorderSections } = require('../controllers/sectionController');
const { protect, loadUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

router.route('/:projectId').get(loadUser, getSections);
router.route('/').post(protect, createSection);
router.route('/:id').put(protect, updateSection).delete(protect, deleteSection);
router.route('/reorder').put(protect, reorderSections);

// Upload route helper
router.post('/upload', protect, upload.single('file'), (req, res) => {
  if (req.file) {
    // Return path relative to server root for frontend access
    res.json({ filePath: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

module.exports = router;
