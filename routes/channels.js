const express = require('express');
const { Channel, Post } = require('../models/Channel');
const auth = require('../middleware/auth');

const router = express.Router();

// GET / — list channels (search, page, limit), public only
router.get('/', async (req, res) => {
  try {
    var { search, page, limit, scope, tenant } = req.query;
    var pageNum = Math.max(1, parseInt(page) || 1);
    var limitNum = Math.min(50, parseInt(limit) || 20);
    var query = { isPrivate: false };
    if (scope !== 'global' && tenant) query.tenant = tenant;
    if (search) query.name = { $regex: search, $options: 'i' };

    var [channels, total] = await Promise.all([
      Channel.find(query)
        .populate('creator', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Channel.countDocuments(query)
    ]);

    res.json({ total, count: channels.length, page: pageNum, pages: Math.ceil(total / limitNum), channels });
  } catch(e) {
    console.error('List channels error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST / — create channel (auth), add creator to members
router.post('/', auth, async (req, res) => {
  try {
    var { name, description, subject, icon, isPrivate } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Channel name is required' });

    var channel = new Channel({
      name: name.trim(),
      description: description ? description.trim() : '',
      subject: subject || 'General',
      icon: icon || '📚',
      creator: req.user._id,
      members: [req.user._id],
      isPrivate: isPrivate === true || isPrivate === 'true',
      tenant: req.user.tenant || ''
    });

    await channel.save();
    await channel.populate('creator', 'name');
    res.status(201).json({ message: 'Channel created', channel });
  } catch(e) {
    console.error('Create channel error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id — channel detail
router.get('/:id', async (req, res) => {
  try {
    var channel = await Channel.findById(req.params.id).populate('creator', 'name');
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    res.json({ channel });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid channel ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/join — auth, add user to members if not already
router.post('/:id/join', auth, async (req, res) => {
  try {
    var channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    var userId = req.user._id.toString();
    var isMember = channel.members.some(function(id) { return id.toString() === userId; });

    if (!isMember) {
      channel.members.push(req.user._id);
      await channel.save();
    }

    res.json({ joined: true, memberCount: channel.members.length });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid channel ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/leave — auth, remove from members
router.post('/:id/leave', auth, async (req, res) => {
  try {
    var channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    var userId = req.user._id.toString();
    channel.members = channel.members.filter(function(id) { return id.toString() !== userId; });
    await channel.save();

    res.json({ joined: false, memberCount: channel.members.length });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid channel ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id/posts — paginated posts
router.get('/:id/posts', async (req, res) => {
  try {
    var { page, limit } = req.query;
    var pageNum = Math.max(1, parseInt(page) || 1);
    var limitNum = Math.min(50, parseInt(limit) || 20);

    var channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    var [posts, total] = await Promise.all([
      Post.find({ channel: req.params.id })
        .populate('user', 'name university year')
        .populate('resource', 'title subject fileType fileSize downloads likesCount')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Post.countDocuments({ channel: req.params.id })
    ]);

    res.json({ total, count: posts.length, page: pageNum, pages: Math.ceil(total / limitNum), posts });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid channel ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/posts — auth, create post (must be a member)
router.post('/:id/posts', auth, async (req, res) => {
  try {
    var channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    var userId = req.user._id.toString();
    var isMember = channel.members.some(function(id) { return id.toString() === userId; });
    if (!isMember) return res.status(403).json({ error: 'Join this channel before posting' });

    var { content, resourceId } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Post content is required' });

    var post = new Post({
      channel: req.params.id,
      user: req.user._id,
      content: content.trim(),
      resource: resourceId || null
    });

    await post.save();
    await post.populate('user', 'name university year');
    if (post.resource) {
      await post.populate('resource', 'title subject fileType fileSize downloads likesCount');
    }

    res.status(201).json({ message: 'Post created', post });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id — creator only, deletes channel and all posts
router.delete('/:id', auth, async (req, res) => {
  try {
    var channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    if (channel.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only the channel creator can delete it' });
    }
    await Post.deleteMany({ channel: req.params.id });
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Channel deleted' });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid channel ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id/posts/:postId — post author or channel creator
router.delete('/:id/posts/:postId', auth, async (req, res) => {
  try {
    var post = await Post.findOne({ _id: req.params.postId, channel: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    var userId = req.user._id.toString();
    var isAuthor = post.user.toString() === userId;

    var channel = await Channel.findById(req.params.id);
    var isChannelCreator = channel && channel.creator.toString() === userId;

    if (!isAuthor && !isChannelCreator) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted' });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/posts/:postId/like — auth, toggle like on post
router.post('/:id/posts/:postId/like', auth, async (req, res) => {
  try {
    var post = await Post.findOne({ _id: req.params.postId, channel: req.params.id });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    var userId = req.user._id.toString();
    var isLiked = post.likes.some(function(id) { return id.toString() === userId; });

    if (isLiked) {
      post.likes = post.likes.filter(function(id) { return id.toString() !== userId; });
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ liked: !isLiked, likesCount: post.likes.length });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
