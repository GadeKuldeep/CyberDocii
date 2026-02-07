const express = require('express');
const router = express.Router();
const { getProjects, createProject, deleteProject, getProjectById } = require('../controllers/projectController');
const { protect, loadUser } = require('../middlewares/authMiddleware');

router.route('/').get(loadUser, getProjects).post(protect, createProject);
router.route('/:id').delete(protect, deleteProject).get(loadUser, getProjectById);

module.exports = router;
