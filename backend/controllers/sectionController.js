const Section = require('../models/Section');
const Journey = require('../models/Journey');
const Project = require('../models/Project');

// Helper to check ownership
const verifyProjectOwnership = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  return project && project.userId.toString() === userId.toString();
};

// @desc    Get sections for a project
// @route   GET /api/sections/:projectId
// @access  Public
const getSections = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const sections = await Section.find({ projectId: req.params.projectId }).sort({ order: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a section (Block) with Journey logging
// @route   POST /api/sections
// @access  Private
const createSection = async (req, res) => {
  const { projectId, type, content, order } = req.body;

  try {
    const isOwner = await verifyProjectOwnership(projectId, req.user._id);
    if (!isOwner) return res.status(401).json({ message: 'Not authorized' });

    const section = new Section({
      projectId,
      type,
      content,
      order,
    });
    const createdSection = await section.save();

    // Log Journey
    await Journey.create({
      projectId,
      sectionId: createdSection._id,
      userId: req.user._id,
      action: 'create',
      type,
      details: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
    });

    res.status(201).json(createdSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a section with Journey logging
// @route   PUT /api/sections/:id
// @access  Private
const updateSection = async (req, res) => {
  const { content, order, type } = req.body; // allow type updates if needed, though rare for blocks except maybe text->code

  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const isOwner = await verifyProjectOwnership(section.projectId, req.user._id);
    if (!isOwner) return res.status(401).json({ message: 'Not authorized' });

    // Detect change type
    let journeyAction = 'update';
    if (order !== undefined && order !== section.order) journeyAction = 'reorder';

    // Create Journey Log only for meaningful content updates or creation (not just minor reorders ideally, but requirement says "adds/edits a block")
    // We'll log updates.
    if (content !== undefined && content !== section.content) {
      await Journey.create({
        projectId: section.projectId,
        sectionId: section._id,
        userId: req.user._id,
        action: 'update',
        type: section.type,
        details: `Updated content`,
      });
    }

    section.content = content !== undefined ? content : section.content;
    section.order = order !== undefined ? order : section.order;
    section.type = type !== undefined ? type : section.type;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a section with Journey logging
// @route   DELETE /api/sections/:id
// @access  Private
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Section not found' });

    const isOwner = await verifyProjectOwnership(section.projectId, req.user._id);
    if (!isOwner) return res.status(401).json({ message: 'Not authorized' });

    await Journey.create({
      projectId: section.projectId,
      sectionId: section._id,
      userId: req.user._id,
      action: 'delete',
      type: section.type,
      details: 'Block removed',
    });

    await section.deleteOne();
    res.json({ message: 'Section removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reorder sections batch
// @route   PUT /api/sections/reorder
// @access  Private
const reorderSections = async (req, res) => {
  const { updates, projectId } = req.body; // updates: [{ _id, order }]
  try {
    const isOwner = await verifyProjectOwnership(projectId, req.user._id);
    if (!isOwner) return res.status(401).json({ message: 'Not authorized' });

    const operations = updates.map(u => ({
      updateOne: {
        filter: { _id: u._id },
        update: { $set: { order: u.order } }
      }
    }));

    await Section.bulkWrite(operations);
    res.json({ message: 'Reordered' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getSections, createSection, updateSection, deleteSection, reorderSections };
