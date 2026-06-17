const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, required: true, enum: ['follow', 'like', 'download', 'channel_post'] },
  from:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', default: null },
  channel:  { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', default: null },
  read:     { type: Boolean, default: false },
  message:  { type: String, default: '' }
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
