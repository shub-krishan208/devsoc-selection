import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Item from "../models/item.js";
// the req, res and next function to execute, as args
export const guard = async (req, res, next) => {
  let token;

  // request header must have a token type of 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // initialize the token as the immediate next string after 'Bearer', separated by ' '
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        console.error("Not authorized or no token found.");
        return res.status(401).json({ message: "No token found!" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // assign the admin id (pk) to the req as designed in the tokne (it has both id and password)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found!" });
      }

      //if user is found, move on
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    // If the header is missing or malformed, there's no token
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Checks if the logged-in user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

// Checks if the user is the item's original poster OR an admin
export const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // Check if the user ID on the request matches the item's userId OR if the user is an admin
    if (item.userId === req.user.id || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
