const mongoose = require('mongoose');

const SUBJECTS = [
  'Academic',
  'Story Books',
  'Journals',
  'Academic Research',
  'Other'
];

const resourceSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, default: '', maxlength: 1000 },
  subject:     { type: String, required: true },
  fileUrl:     { type: String, required: true },
  cloudinaryId: { type: String },
  cloudinaryResourceType: { type: String },
  fileName:    { type: String, required: true },
  fileType:    { type: String, required: true },
  fileSize:    { type: Number, required: true },
  tags:        [{ type: String, maxlength: 30, trim: true }],
  downloads:   { type: Number, default: 0 },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount:  { type: Number, default: 0 },
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenant:      { type: String, default: '' },
  accessMode:  { type: String, default: 'download', enum: ['download', 'view-only'] }
}, { timestamps: true });

resourceSchema.set('toJSON', { virtuals: false });
resourceSchema.index({ title: 'text', description: 'text' });
resourceSchema.index({ subject: 1, createdAt: -1 });
resourceSchema.index({ user: 1, createdAt: -1 });
resourceSchema.index({ downloads: -1 });
resourceSchema.index({ likesCount: -1 });
resourceSchema.index({ tenant: 1, createdAt: -1 });
resourceSchema.index({ tenant: 1, subject: 1, createdAt: -1 });
resourceSchema.index({ tenant: 1, downloads: -1 });
resourceSchema.index({ tenant: 1, likesCount: -1 });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
module.exports.SUBJECTS = SUBJECTS;
