import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3h", //token expires in 3h
    });

    res.status(200).json({
      success: true,
      token: `Bearer ${token} ${user.role}`,
    });
  } catch (err) {
    console.log("Error while logging in: ", err);
  }
}

async function register(req, res) {
  const { username, password, email } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      return res
        .status(401)
        .json({ message: "User already exists. Please login." });
    }
    // creating the new user
    await User.create({
      username: username,
      password: password,
      email: email ? email : "",
    });
    console.log(`New user created with username: ${username}.`);
    res.status(201).json({
      message: `New user created with username: ${newUser.username}`,
      userId: newUser.id,
    });
  } catch (err) {
    console.log("Error while creating user: ", err);
  }
}

export { login, register };
