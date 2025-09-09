import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      // TEXT is better for potentially long descriptions
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("lost", "found"),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      // DATEONLY is suitable for storing just the date without time
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true, // An image might not always be provided
    },
    // The userId foreign key will be automatically created on defining the association with the User model.
  },
  {
    timestamps: true,
  }
);

export default Item;

/**
 * 
 * user this code in the controller to establish the foreign key relationship of suer with the items
 import User from './User.js';
import Item from './Item.js';

// A User can have many Items
User.hasMany(Item, {
  foreignKey: 'userId',
  onDelete: 'CASCADE' // If a user is deleted, their items are also deleted
});

// An Item belongs to a single User
Item.belongsTo(User, {
  foreignKey: 'userId'
});
 */
