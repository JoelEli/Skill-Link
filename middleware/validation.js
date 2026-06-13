const { body, validationResult } = require('express-validator');

const VALID_YEARS = ['','1st Year','2nd Year','3rd Year','4th Year','5th Year','Masters','PhD','Graduate'];

const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('university')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('University name cannot exceed 100 characters'),
  body('year')
    .optional({ checkFalsy: true })
    .isIn(VALID_YEARS)
    .withMessage('Invalid academic level'),
  body('subject')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Course name cannot exceed 100 characters')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Bio cannot exceed 300 characters'),
  body('university')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('University cannot exceed 100 characters'),
  body('year')
    .optional()
    .isIn(VALID_YEARS)
    .withMessage('Invalid year value')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
  updateProfileValidation,
  handleValidationErrors
};
