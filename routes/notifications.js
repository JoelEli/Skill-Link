const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

const router = express.Router();

// GET / — list notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    var { page, limit } = req.query;
    var pageNum = Math.max(1, parseInt(page) || 1);
    var limitNum = Math.min(50, parseInt(limit) || 20);

    var [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .populate('from', 'name university')
        .populate('resource', 'title fileType')
        .populate('channel', 'name icon')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Notification.countDocuments({ user: req.user._id }),
      Notification.countDocuments({ user: req.user._id, read: false })
    ]);

    res.json({ total, unreadCount, count: notifications.length, page: pageNum, pages: Math.ceil(total / limitNum), notifications });
  } catch(e) {
    console.error('List notifications error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /unread-count — quick count for badge
router.get('/unread-count', auth, async (req, res) => {
  try {
    var count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ unreadCount: count });
  } catch(e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /read-all — mark all as read (MUST be before /:id routes)
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All marked as read' });
  } catch(e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /:id/read — mark one as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    var notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notif) return res.status(404).json({ error: 'Notification not found' });
    notif.read = true;
    await notif.save();
    res.json({ message: 'Marked as read' });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
