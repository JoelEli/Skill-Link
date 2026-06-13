const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, maxlength: 80 },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true, minlength: 6 },
  bio:       { type: String, default: '', maxlength: 300 },
  university:{ type: String, default: '', maxlength: 100 },
  year:      { type: String, default: '', enum: ['','1st Year','2nd Year','3rd Year','4th Year','5th Year','Masters','PhD','Graduate'] },
  subject:   { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
}, { timestamps: true });

userSchema.virtual('followerCount').get(function(){ return this.followers ? this.followers.length : 0; });
userSchema.virtual('followingCount').get(function(){ return this.following ? this.following.length : 0; });
userSchema.set('toJSON', { virtuals: true, transform: function(doc, ret){ delete ret.password; return ret; } });

module.exports = mongoose.model('User', userSchema);
