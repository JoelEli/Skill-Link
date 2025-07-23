const express = require('express');
const Skill = require('../models/Skill');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { skillValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/skills
// @desc    Get all skills with user information
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;
    
    const skills = await Skill.find(query)
      .populate('user', 'name email averageRating')
      .sort(sortObj)
      .limit(50);
    
    res.json({
      count: skills.length,
      skills
    });
    
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Server error while fetching skills' });
  }
});

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private
router.post('/', auth, skillValidation, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    
    // Create new skill
    const skill = new Skill({
      title,
      description,
      category,
      price,
      user: req.user._id
    });
    
    await skill.save();
    
    // Add skill to user's skills array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { skills: skill._id } }
    );
    
    // Populate user information
    await skill.populate('user', 'name email averageRating');
    
    res.status(201).json({
      message: 'Skill created successfully',
      skill
    });
    
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Server error while creating skill' });
  }
});

// @route   GET /api/skills/:id
// @desc    Get a specific skill by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate('user', 'name email averageRating');
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json(skill);
    
  } catch (error) {
    console.error('Get skill by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }
    res.status(500).json({ error: 'Server error while fetching skill' });
  }
});

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private (only skill owner)
router.put('/:id', auth, skillValidation, handleValidationErrors, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Check if user owns the skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this skill' });
    }
    
    const { title, description, category, price } = req.body;
    
    skill.title = title;
    skill.description = description;
    skill.category = category;
    skill.price = price;
    
    await skill.save();
    await skill.populate('user', 'name email averageRating');
    
    res.json({
      message: 'Skill updated successfully',
      skill
    });
    
  } catch (error) {
    console.error('Update skill error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }
    res.status(500).json({ error: 'Server error while updating skill' });
  }
});

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private (only skill owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Check if user owns the skill
    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this skill' });
    }
    
    // Remove skill from user's skills array
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { skills: skill._id } }
    );
    
    await skill.deleteOne();
    
    res.json({ message: 'Skill deleted successfully' });
    
  } catch (error) {
    console.error('Delete skill error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ error: 'Invalid skill ID' });
    }
    res.status(500).json({ error: 'Server error while deleting skill' });
  }
});

module.exports = router; 