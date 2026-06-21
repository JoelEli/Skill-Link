const express = require('express');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { SlimFileClient } = require('@slimfile/sdk');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

var slimfile = null;
try { slimfile = new SlimFileClient(); } catch(e) { /* no API key — compression disabled */ }

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer: memory storage (buffer sent to Cloudinary, nothing hits disk)
const ALLOWED_EXTENSIONS = new Set([
  '.pdf','.ppt','.pptx','.doc','.docx','.xls','.xlsx',
  '.txt','.zip','.rar','.7z','.png','.jpg','.jpeg','.gif',
  '.csv','.json','.md'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.has(ext)) return cb(null, true);
    cb(new Error('File type not allowed. Allowed: PDF, PPT, DOC, XLS, TXT, ZIP, images, video, CSV, JSON, MD'));
  }
});

function applyUpload(req, res, next) {
  upload.single('file')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Maximum size is 50MB.' });
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
    '.txt': 'txt', '.csv': 'csv', '.md': 'md'
  };
  return map[ext] || 'other';
}

function getCloudinaryResourceType(ext) {
  if (['.png','.jpg','.jpeg','.gif','.webp'].includes(ext)) return 'image';
  return 'raw';
}

var SLIMFILE_SUPPORTED = new Set(['.jpg','.jpeg','.png','.webp','.pdf','.pptx','.docx','.xlsx']);

async function compressFile(buffer, fileName) {
  if (!slimfile) return { buffer: buffer, compressed: false };
  var ext = path.extname(fileName).toLowerCase();
  if (!SLIMFILE_SUPPORTED.has(ext)) return { buffer: buffer, compressed: false };
  try {
    var result = await slimfile.compress(buffer, { fileName: fileName, quality: 80 });
    console.log('SlimFile: ' + fileName + ' — ' + result.originalSize + ' → ' + result.compressedSize + ' (' + result.compressionRatio + '% saved)');
    return { buffer: result.data, compressed: true, originalSize: result.originalSize, compressedSize: result.compressedSize, ratio: result.compressionRatio };
  } catch(e) {
    console.error('SlimFile compression failed, using original:', e.message);
    return { buffer: buffer, compressed: false };
  }
}

function uploadToCloudinary(buffer, options) {
  return new Promise(function(resolve, reject) {
    cloudinary.uploader.upload_stream(options, function(err, result) {
      if (err) return reject(err);
      resolve(result);
    }).end(buffer);
  });
}

function parseTags(raw) {
  if (!raw) return [];
  return raw.split(',').map(t => t.trim()).filter(t => t.length > 0).slice(0, 10);
}

// GET / — list resources
router.get('/', async (req, res) => {
  try {
    var { subject, search, fileType, sort, page, limit, userId, scope, tenant } = req.query;
    var pageNum = Math.max(1, parseInt(page) || 1);
    var limitNum = Math.min(50, parseInt(limit) || 12);
    var query = {};
    var andClauses = [];

    if (scope !== 'global' && tenant) {
      andClauses.push({ $or: [{ tenant: tenant }, { visibility: 'global' }] });
    }
    if (subject && subject !== 'All') query.subject = subject;
    if (fileType && fileType !== 'All') query.fileType = fileType;
    if (userId) query.user = userId;
    if (search) {
      andClauses.push({ $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]});
    }
    if (andClauses.length) query.$and = andClauses;

    var sortObj = { createdAt: -1 };
    if (sort === 'downloads') sortObj = { downloads: -1, createdAt: -1 };
    else if (sort === 'likes')  sortObj = { likesCount: -1, createdAt: -1 };

    var [resources, total] = await Promise.all([
      Resource.find(query)
        .populate('user', 'name university year')
        .sort(sortObj)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Resource.countDocuments(query)
    ]);

    res.json({ total, count: resources.length, page: pageNum, pages: Math.ceil(total / limitNum), resources });
  } catch(e) {
    console.error('List resources error:', e);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST / — upload resource (streams buffer → Cloudinary, no disk write)
router.post('/', auth, applyUpload, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File is required' });

    var { title, description, subject, tags, accessMode, visibility } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });
    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    var ext = path.extname(req.file.originalname).toLowerCase();
    var fileType = getFileType(ext);
    var cloudinaryResourceType = getCloudinaryResourceType(ext);

    var compressed = await compressFile(req.file.buffer, req.file.originalname);
    var uploadBuffer = compressed.buffer;

    var result = await uploadToCloudinary(uploadBuffer, {
      folder: 'skilllink/resources',
      resource_type: cloudinaryResourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    var resource = new Resource({
      title:                  title.trim(),
      description:            description ? description.trim() : '',
      subject,
      fileUrl:                result.secure_url,
      cloudinaryId:           result.public_id,
      cloudinaryResourceType: cloudinaryResourceType,
      fileName:               req.file.originalname,
      fileType,
      fileSize:               compressed.compressed ? compressed.compressedSize : req.file.size,
      tags:                   parseTags(tags),
      user:                   req.user._id,
      tenant:                 visibility === 'global' ? '' : (req.user.tenant || ''),
      accessMode:             accessMode === 'view-only' ? 'view-only' : 'download',
      visibility:             visibility === 'global' ? 'global' : 'tenant'
    });

    await resource.save();
    await resource.populate('user', 'name university year');
    res.status(201).json({ message: 'Resource uploaded successfully', resource });
  } catch(e) {
    console.error('Upload resource error:', e);
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

// PUT /:id — edit resource metadata (owner only, no file change)
router.put('/:id', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    var { title, description, subject, tags } = req.body;
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ error: 'Title cannot be empty' });
      resource.title = title.trim();
    }
    if (description !== undefined) resource.description = description.trim();
    if (subject !== undefined) resource.subject = subject;
    if (tags !== undefined) resource.tags = parseTags(tags);

    await resource.save();
    await resource.populate('user', 'name university year');
    res.json({ message: 'Resource updated', resource });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /:id/download — auth required; increments counter, returns Cloudinary URL
router.get('/:id/download', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    if (resource.accessMode === 'view-only' && resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'This resource is view-only. The owner has disabled downloads.' });
    }

    resource.downloads = (resource.downloads || 0) + 1;
    await resource.save();

    if (resource.user.toString() !== req.user._id.toString()) {
      new Notification({
        user: resource.user,
        type: 'download',
        from: req.user._id,
        resource: resource._id,
        message: 'downloaded your resource "' + resource.title + '"'
      }).save().catch(function() {});
    }

    var downloadUrl = resource.fileUrl.replace('/upload/', '/upload/fl_attachment/');
    res.json({ url: downloadUrl, fileName: resource.fileName });
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

    if (!isLiked && resource.user.toString() !== userId) {
      new Notification({
        user: resource.user,
        type: 'like',
        from: req.user._id,
        resource: resource._id,
        message: 'liked your resource "' + resource.title + '"'
      }).save().catch(function() {});
    }

    res.json({ liked: !isLiked, likesCount: resource.likesCount });
  } catch(e) {
    if (e.name === 'CastError') return res.status(400).json({ error: 'Invalid resource ID' });
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /:id — owner only; removes from Cloudinary too
router.delete('/:id', auth, async (req, res) => {
  try {
    var resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    if (resource.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (resource.cloudinaryId) {
      await cloudinary.uploader.destroy(resource.cloudinaryId, {
        resource_type: resource.cloudinaryResourceType || 'raw'
      }).catch(function() {});
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
