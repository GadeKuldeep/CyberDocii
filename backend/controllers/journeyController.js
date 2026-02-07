const Journey = require('../models/Journey');
const Project = require('../models/Project');

// @desc    Get journey for a project
// @route   GET /api/journey/:projectId
// @access  Public
const getJourney = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const { type } = req.query; // Filter by type (command, error, etc.)
    let query = { projectId: req.params.projectId };

    if (type && type !== 'all') {
      query.type = type;
    }

    const journey = await Journey.find(query).sort({ createdAt: -1 });
    res.json(journey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJourney };
