const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const { updateProfileValidation, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// GET / — list users (search, page, limit)
router.get('/', async (req, res) => {
  try {
    const { search, page=1, limit=12 } = req.query;
    const pageNum = Math.max(1, parseInt(page)||1);
    const limitNum = Math.min(50, parseInt(limit)||12);
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    const [users, total] = await Promise.all([
      User.find(query).select('-password -savedResources').sort({ createdAt: -1 }).skip((pageNum-1)*limitNum).limit(limitNum),
      User.countDocuments(query)
    ]);
    res.json({ total, count: users.length, page: pageNum, pages: Math.ceil(total/limitNum), users });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

// GET /me/profile
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
      .populate('savedResources', 'title subject fileType fileSize downloads likesCount likes createdAt user')
      .populate('followers', 'name university year subject')
      .populate('following', 'name university year subject');
    const resources = await Resource.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ user: { ...user.toJSON(), uploadCount: resources.length, resources } });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

// PUT /me/profile
router.put('/me/profile', auth, updateProfileValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, bio, university, year, subject } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (university !== undefined) updates.university = university.trim();
    if (year !== undefined) updates.year = year;
    if (subject !== undefined) updates.subject = subject;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ message: 'Profile updated', user });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

// PUT /me/password
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
    const user = await User.findById(req.user._id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password changed' });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

// POST /me/save/:resourceId — toggle saved resource (must be before /:id)
router.post('/me/save/:resourceId', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);
    const rid = req.params.resourceId;
    const isSaved = me.savedResources.some(id => id.toString() === rid);
    if (isSaved) {
      me.savedResources = me.savedResources.filter(id => id.toString() !== rid);
    } else {
      me.savedResources.push(rid);
    }
    await me.save();
    res.json({ saved: !isSaved });
  } catch(e) { res.status(500).json({ error: 'Server error' }); }
});

// GET /:id — public profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -savedResources');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const resources = await Resource.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(20);
    res.json({ user: { ...user.toJSON(), resources } });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid user ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/follow — toggle follow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) return res.status(400).json({ error: 'Cannot follow yourself' });
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: 'User not found' });
    const me = await User.findById(req.user._id);
    const isFollowing = me.following.some(id => id.toString() === req.params.id);
    if (isFollowing) {
      me.following = me.following.filter(id => id.toString() !== req.params.id);
      target.followers = target.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      me.following.push(req.params.id);
      target.followers.push(req.user._id);
    }
    await Promise.all([me.save(), target.save()]);

    if (!isFollowing) {
      new Notification({
        user: target._id,
        type: 'follow',
        from: req.user._id,
        message: me.name + ' started following you'
      }).save().catch(function() {});
    }

    res.json({ following: !isFollowing, followerCount: target.followers.length });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid user ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
