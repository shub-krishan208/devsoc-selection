import { Item, User } from "../models/init.js";
import { Op } from "sequelize"; // for advanced queries

// Controller to get all items with filtering
export const getAllItems = async (req, res) => {
  try {
    const { status, category, location, date } = req.query;
    const whereClause = {}; // Dynamically build our query conditions

    if (status) whereClause.status = status;
    if (category) whereClause.category = { [Op.iLike]: `%${category}%` }; // Case-insensitive search
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` };
    if (date) whereClause.date = date;

    const items = await Item.findAll({
      where: whereClause,
      include: {
        // Include the user who posted the item
        model: User,
        attributes: ["id", "username", "email"], // Only include these user attributes
      },
      order: [["createdAt", "DESC"]], // Show newest items first
    });

    if (items.length === 0) {
      console.log("No items found !!");
      res.status(404).json({
        message: "No items found for the given query!!",
        items: items,
      });
      return;
    }
    res.status(200).json(items);
    console.log("sending query search items ...");
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to get a single item by its ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ["id", "username"],
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to create a new item
export const createItem = async (req, res) => {
  try {
    // We get the userId from the 'guard' middleware
    const {
      title,
      description,
      status,
      category,
      location,
      date,
      contactInfo,
      imageURL,
    } = req.body;
    const userId = req.user.id;

    const newItem = await Item.create({
      title,
      description,
      status,
      category,
      location,
      date,
      contactInfo,
      imageURL,
      userId,
    });
    console.log("New item created.");
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to update an existing item
export const updateItem = async (req, res) => {
  try {
    const [updatedRows] = await Item.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedRows === 0) {
      return res
        .status(404)
        .json({ message: "Item not found or no new data to update" });
    }

    // Fetch and return the updated item
    const updatedItem = await Item.findByPk(req.params.id);
    res
      .status(200)
      .json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to delete an item
export const deleteItem = async (req, res) => {
  try {
    const deletedRows = await Item.destroy({
      where: { id: req.params.id },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
