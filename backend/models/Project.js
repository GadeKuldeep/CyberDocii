const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  status: { type: String, default: 'active' }, // active, archived
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
