import express from "express";
const router = express.Router();
import { login, register } from "../controllers/auth.controller.js";
import { guard } from "../middleware/guard.middleware.js";
import {
  validateLogin,
  validateRegistration,
} from "../middleware/validators.middleware.js";

router.post("/login", validateLogin, login); // need username, password
router.post("/register", validateRegistration, register); // need usernmame, password, role
router.get("/protect", guard, (req, res) => {
  res.status(200).json({ message: "The guard function works smoothly!" });
}); // need authtoken as payload and example use case: router.delete("/:id", guard, deleteItem);
export default router;
