const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' }, // Optional, as a delete action might not have a link anymore
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true, enum: ['create', 'update', 'delete', 'reorder'] },
  type: { type: String, required: true }, // The type of the block involved (e.g., 'command', 'image')
  details: { type: String }, // Optional description or snapshot
}, { timestamps: true });

module.exports = mongoose.model('Journey', journeySchema);
