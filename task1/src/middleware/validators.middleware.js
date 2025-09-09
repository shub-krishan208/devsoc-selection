import { body, validationResult } from "express-validator";

// A middleware to handle the validation result
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Invalid role specified."),

  handleValidationErrors,
];

// Validation rules for user login
const validateLogin = [
  body("username").trim().notEmpty().withMessage("Username is required."),

  body("password").notEmpty().withMessage("Password is required."),

  handleValidationErrors,
];

// Validation rules for creating a new item
const validateCreateItem = [
  body("title").trim().notEmpty().withMessage("Title is required.").escape(), // Sanitize to prevent XSS

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .escape(),

  body("status")
    .isIn(["lost", "found"])
    .withMessage('Status must be either "lost" or "found".'),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required.")
    .escape(),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required.")
    .escape(),

  body("date")
    .isISO8601()
    .toDate()
    .withMessage("A valid date is required (YYYY-MM-DD)."),

  body("contactInfo")
    .trim()
    .notEmpty()
    .withMessage("Contact information is required.")
    .escape(),

  body("imageURL")
    .optional()
    .isURL()
    .withMessage("A valid image URL is required."),

  handleValidationErrors,
];

// Validation for updating an item (often more lenient, allowing partial updates)
const validateUpdateItem = [
  body("title").optional().trim().escape(),
  body("description").optional().trim().escape(),
  body("status").optional().isIn(["lost", "found"]),
  body("category").optional().trim().escape(),
  body("location").optional().trim().escape(),
  body("date").optional().isISO8601().toDate(),
  body("contactInfo").optional().trim().escape(),
  body("imageURL").optional().isURL(),

  handleValidationErrors,
];

export {
  validateRegistration,
  validateLogin,
  validateCreateItem,
  validateUpdateItem,
};
