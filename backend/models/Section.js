const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['text', 'image', 'video', 'command', 'output', 'error', 'link'] 
  },
  content: { type: String, default: '' }, // Text content or URL
  order: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
