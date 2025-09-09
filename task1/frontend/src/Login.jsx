import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (userdata) => {
    try {
      console.log("Creating new user ...");
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userdata),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Server response", data);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    }
  };
  const handleLogin = async (username, password) => {
    try {
      console.log("Loggin in ...");
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json(); // assuming backend sends JSON
      console.log("Server response", data);
      const token = data.token;
      localStorage.setItem("authToken", token);
      navigate("/database");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      handleRegister(formData);
      return;
    } else {
      handleLogin(formData.username, formData.password, formData.email);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-card text-foreground"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-sm text-left mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-left mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Your Name"
              value={formData.username}
              onChange={handleChange}
              required={isSignup}
              className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-left mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="password123"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 rounded-lg bg-input text-foreground border border-border focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:brightness-110 transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary font-medium hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
