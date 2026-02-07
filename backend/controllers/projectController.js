const Project = require('../models/Project');
const Section = require('../models/Section');
const Journey = require('../models/Journey');

// @desc    Get all projects for user
// @route   GET /api/projects?userId=...
// @access  Public/Private
const getProjects = async (req, res) => {
  try {
    const queryUserId = req.query.userId || (req.user ? req.user._id : null);
    if (!queryUserId) {
      return res.status(400).json({ message: 'User ID required' });
    }
    const projects = await Project.find({ userId: queryUserId }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { title } = req.body;
  try {
    const project = new Project({
      userId: req.user._id,
      title,
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
    }

    await project.deleteOne();
    // Clean up sections and journeys
    await Section.deleteMany({ projectId: req.params.id });
    await Journey.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    // Publicly accessible for reading
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, deleteProject, getProjectById };
