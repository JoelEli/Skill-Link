const express = require('express');
const User = require('../models/User');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile with posted skills
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'skills',
        select: 'title description category price createdAt',
        options: { sort: { createdAt: -1 } }
      });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        averageRating: user.averageRating,
        skillsCount: user.skills.length,
        skills: user.skills,
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Get user profile error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    res.status(500).json({ error: 'Server error while fetching user profile' });
  }
});

// @route   GET /api/users/me/profile
// @desc    Get current user's profile
// @access  Private
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'skills',
        select: 'title description category price createdAt',
        options: { sort: { createdAt: -1 } }
      });
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        averageRating: user.averageRating,
        skillsCount: user.skills.length,
        skills: user.skills,
        ratings: user.ratings,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Get current user profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/me/profile
// @desc    Update current user's profile
// @access  Private
router.put('/me/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Check if email is already taken by another user
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// @route   POST /api/users/:id/rate
// @desc    Rate a user (1-5 stars)
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Prevent self-rating
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot rate yourself' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add rating to user's ratings array
    user.ratings.push(rating);
    await user.save();
    
    res.json({
      message: 'Rating added successfully',
      averageRating: user.averageRating,
      totalRatings: user.ratings.length
    });
    
  } catch (error) {
    console.error('Rate user error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    res.status(500).json({ error: 'Server error while rating user' });
  }
});

module.exports = router; 