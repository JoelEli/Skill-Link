const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('./models/User');
const Resource = require('./models/Resource');
const { Channel } = require('./models/Channel');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');
const channelRoutes = require('./routes/channels');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      fontSrc: ["'self'", 'https:', 'data:'],
      connectSrc: ["'self'", 'https://res.cloudinary.com'],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// CORS — allow Vercel frontend + Railway + localhost + any CORS_ORIGIN extras
var defaultOrigins = [
  'https://skill-link-drab.vercel.app',
  'https://energetic-analysis-production-6afe.up.railway.app',
  'http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5000'
];
var extraOrigins = (process.env.CORS_ORIGIN || '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
var allowedOrigins = defaultOrigins.concat(extraOrigins);
app.use(cors({
  origin: function(origin, cb) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
    cb(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// General rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
}));

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many auth attempts, please try again later.' }
});

// Upload limiter — 20 uploads per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Upload limit reached. Please try again later.' }
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Serve static files (frontend + uploaded files)
app.use(express.static(path.join(__dirname, 'public')));

// Database connection with auto-retry
function connectDB() {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => {
      console.error('MongoDB connection error:', error.message, '— retrying in 5s');
      setTimeout(connectDB, 5000);
    });
}
connectDB();

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.post('/api/resources', uploadLimiter);
app.use('/api/resources', resourceRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/notifications', notificationRoutes);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const { scope, tenant } = req.query;
    const filter = (scope !== 'global' && tenant) ? { tenant } : {};
    const [totalResources, totalUsers, dlResult, totalChannels] = await Promise.all([
      Resource.countDocuments(filter),
      User.countDocuments(filter),
      Resource.aggregate([{ $match: filter }, { $group: { _id: null, total: { $sum: '$downloads' } } }]),
      Channel.countDocuments(filter)
    ]);
    res.json({
      totalResources,
      totalUsers,
      totalDownloads: (dlResult[0] && dlResult[0].total) || 0,
      totalChannels
    });
  } catch(e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Serve the SPA — no-cache ensures CSP/JS changes apply without browser hard-refresh
app.get('*', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
