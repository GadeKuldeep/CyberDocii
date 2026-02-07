const express = require('express');
const router = express.Router();
const { getJourney } = require('../controllers/journeyController');
const { protect, loadUser } = require('../middlewares/authMiddleware');

router.route('/:projectId').get(loadUser, getJourney);

module.exports = router;
