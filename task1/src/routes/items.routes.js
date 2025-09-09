/*
 * The required setup:
 * API Functionality: Your API should expose the following endpoints:
 * ● GET /items: Retrieve a list of all items, with support for filtering results using query parameters.
 * ● GET /items/:id: Fetch the complete details for a single item using its unique ID.
 * ● POST /items: Create a new item report (for a lost or found item).
 * ● PUT /items/:id: Update the details of an existing item. This should be restricted to the original poster or an administrator.
 * ● DELETE /items/:id: Remove an item listing from the database. This action should be restricted to administrators only.
 */

import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/items.controller.js";

import {
  guard,
  isAdmin,
  isOwnerOrAdmin,
} from "../middleware/guard.middleware.js";

import {
  validateCreateItem,
  validateUpdateItem,
} from "../middleware/validators.middleware.js";

const router = express.Router();
/*
 * @route   GET /api/items
 * @desc    Retrieve a list of all items with optional filtering
 * @desc    Accepted queries: status, location, category, date
 * @access  Public
 */
router.get("/", getAllItems);
/*
 * @route   GET /api/items/:id
 * @desc    Fetch complete details for a single item
 * @access  Public
 */
router.get("/:id", getItemById);
/*
 * @route   POST /api/items
 * @desc    Create a new item report
 * @access  Private (Requires login)
 */
router.post("/", guard, validateCreateItem, createItem);
/*
 * @route   PUT /api/items/:id
 * @desc    Update an item's details, given req.body is supposed to follow items model
 * @access  Private (Original poster or Admin only)
 */
router.put("/:id", guard, isOwnerOrAdmin, validateUpdateItem, updateItem);

/*
 * @route   DELETE /api/items/:id
 * @desc    Remove an item listing
 * @access  Private (Admin only)
 */
router.delete("/:id", guard, isAdmin, deleteItem);

export default router;
