const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Resource = require('../models/Resource');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'resources');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, unique + ext);
  }
});

const ALLOWED_EXTENSIONS = new Set([
  '.pdf','.ppt','.pptx','.doc','.docx','.xls','.xlsx',
  '.txt','.zip','.rar','.7z','.png','.jpg','.jpeg','.gif',
  '.mp4','.avi','.mov','.csv','.json','.md'
]);

const fileFilter = function(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_EXTENSIONS.has(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Allowed: PDF, PPT, DOC, XLS, TXT, ZIP, images, video, CSV, JSON, MD'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: fileFilter
});

function applyUpload(req, res, next) {
  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

function getFileType(ext) {
  const map = {
    '.pdf': 'pdf',
    '.ppt': 'ppt', '.pptx': 'ppt',
    '.doc': 'doc', '.docx': 'doc',
    '.xls': 'xls', '.xlsx': 'xls',
    '.zip': 'zip', '.rar': 'zip', '.7z': 'zip',
    '.png': 'img', '.jpg': 'img', '.jpeg': 'img', '.gif': 'img',
    '.mp4': 'video', '.avi': 'video', '.mov': 'video',
    '.txt': 'txt',
    '.csv': 'csv',
    '.md': 'md'
  };
  return map[ext] || 'other';
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .slice(0, 10);
}

// GET / — list resources
router.get('/', async (req, res) => {
  try {
    var { subject, search, fileType, sort, page, limit, userId } = req.query;
    var pageNum = Math.max(1, parseInt(page) || 1);
    var limitNum = Math.min(50, parseInt(limit) || 12);
    var query = {};

    if (subject && subject !== 'All') query.subject = subject;
    if (fileType && fileType !== 'All') query.fileType = fileType;
    if (userId) query.user = userId;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    var sortObj = { createdAt: -1 };
    if (sort === 'downloads') sortObj = { downloads: -1, createdAt: -1 };
    else if (sort === 'likes') sortObj = { likesCount: -1, createdAt: -1 };

    var [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('user', 'name university year')
        .sort(sortObj)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Resource.countDocuments(query)
    ]);

    res.json({
      total,
      count: resources.length,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      resources
    });
  } catch(e) {
    console.error('List resources error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST / — upload resource
router.post('/', auth, applyUpload, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    var { title, description, subject, tags } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    var ext = path.extname(req.file.originalname).toLowerCase();
    var fileType = getFileType(ext);

    var resource = new Resource({
      title: title.trim(),
      description: description ? description.trim() : '',
      subject,
      fileUrl: '/uploads/resources/' + req.file.filename,
      fileName: req.file.originalname,
      fileType,
      fileSize: req.file.size,
      tags: parseTags(tags),
      user: req.user._id
    });

    await resource.save();
    await resource.populate('user', 'name university year');

    res.status(201).json({ message: 'Resource uploaded successfully', resource });
  } catch(e) {
    console.error('Upload resource error:', e);
    if (req.file) {
      fs.unlink(req.file.path, function() {});
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id — single resource
router.get('/:id', async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id).populate('user', 'name university year subject bio');
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id/download — auth required, serve file
router.get('/:id/download', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    var filePath = path.join(__dirname, '..', 'public', resource.fileUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();

    res.download(filePath, resource.fileName);
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /:id/like — toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    var userId = req.user._id.toString();
    var isLiked = resource.likes.some(function(id) { return id.toString() === userId; });

    if (isLiked) {
      resource.likes = resource.likes.filter(function(id) { return id.toString() !== userId; });
    } else {
      resource.likes.push(req.user._id);
    }
    resource.likesCount = resource.likes.length;

    await resource.save();
    res.json({ liked: !isLiked, likesCount: resource.likesCount });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id — owner only
router.delete('/:id', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    var filePath = path.join(__dirname, '..', 'public', resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, function() {});
    }

    await Resource.findByIdAndDelete(req.params.id);
    await User.updateMany({ savedResources: req.params.id }, { $pull: { savedResources: req.params.id } });
    res.json({ message: 'Resource deleted' });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
