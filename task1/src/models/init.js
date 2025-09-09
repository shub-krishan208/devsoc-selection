import User from "./user.js";
import Item from "./item.js";

console.log("Setting up model associations..."); // Add a log for debugging

// A User can have many Items
User.hasMany(Item, {
  foreignKey: "userId",
  onDelete: "CASCADE", // If a user is deleted, their items are also deleted
});

// An Item belongs to a single User
Item.belongsTo(User, {
  foreignKey: "userId",
});

// Export all models from this file
export { User, Item };
