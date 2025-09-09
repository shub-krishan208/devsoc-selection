// setting up connection to the postgres database using sequelize ORM
import { Sequelize } from "sequelize";
// require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

// Function to connect and sync the database
export const connectAndSyncDb = async () => {
  try {
    console.log("Connecting to the database ... ");
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // importing will setup the initial connection between the associations between the models
    await import("../models/init.js");
    console.log("✅ Model associations have been set up.");

    // { force: true } will drop tables if they exist - USE WITH CAUTION IN DEV ONLY
    // { alter: true } will attempt to alter existing tables - Safer for dev
    await sequelize.sync({ alter: true });
    console.log("✅ All models were synchronized successfully.");
  } catch (error) {
    console.error(
      "❌ Unable to connect to the database or sync models:",
      error
    );
  }
};

export default sequelize;
