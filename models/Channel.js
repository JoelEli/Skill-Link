const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, default: '', maxlength: 500 },
  subject:     { type: String, default: 'General' },
  icon:        { type: String, default: '📚' },
  creator:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPrivate:   { type: Boolean, default: false },
  tenant:      { type: String, default: '' }
}, { timestamps: true });

channelSchema.virtual('memberCount').get(function(){ return this.members.length; });
channelSchema.set('toJSON', { virtuals: true });
channelSchema.index({ tenant: 1, createdAt: -1 });

const postSchema = new mongoose.Schema({
  channel:  { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:  { type: String, required: true, maxlength: 2000 },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', default: null },
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.virtual('likesCount').get(function(){ return this.likes.length; });
postSchema.set('toJSON', { virtuals: true });
postSchema.index({ channel: 1, createdAt: -1 });

const Channel = mongoose.model('Channel', channelSchema);
const Post    = mongoose.model('Post', postSchema);
module.exports = { Channel, Post };
