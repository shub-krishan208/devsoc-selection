import express from "express";
import cors from "cors";
// require("dotenv").config();

import User from "./models/user.js";

import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/items.routes.js";
import { connectAndSyncDb } from "./config/sequelize.js";

const app = express();
const PORT = 5000;

// allowing frontend to get resources from backend
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json()); //parse incoming JSON bodies

// routes
app.get("/", (req, res) => {
  //this message is shown on the webpage for now
  res.send("Backend API is now connected to the database!");
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

const createDefaultAdmin = async () => {
  try {
    const adminCount = await User.count({
      where: {
        role: "admin",
      },
    });
    if (adminCount === 0) {
      await User.create({
        username: "admin",
        password: "password123",
        role: "admin",
      });
      console.log(
        "Default Admin user created for testing, remove this before deployment."
      );
    } else {
      console.log("User already exists.");
    }
  } catch (err) {
    console.log("Error while creating admin: ", err);
  }
};

const startServer = async () => {
  try {
    await connectAndSyncDb();
    await createDefaultAdmin();

    //start the server after the database is connected
    app.listen(PORT, () => {
      console.log(`Backend server is listening on port: ${PORT}`);
    });
  } catch (err) {
    console.log("Error connecting to the database: ", err);
  }
};

// run the server starting function
startServer();
