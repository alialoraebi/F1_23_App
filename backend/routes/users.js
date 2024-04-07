const express = require("express");
const userModel = require('../model/user.js'); 
const bcrypt = require("bcryptjs"); 
const routes = express.Router();
const jwt = require('jsonwebtoken');


// Get All Users
routes.get('/users', async (req, res, next) => {
    try {
        const userList = await userModel.find();
        if (userList.length === 0) {
            res.status(200).json({ message: "No users" });
        } else {
            res.status(200).json(userList);
        }
    } catch (error) {
        next(error); 
    }
});

// Adding User
routes.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Create a new user (password will be hashed in pre-save hook)
        const newUser = new userModel({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'User account created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// User Login
routes.post("/login", async (req, res) => {
    console.log('Request body:', req.body);

    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find the user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        console.log('User:', user);

        // Password comparison
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json(error);
    }
});


// Delete User
routes.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by _id and delete
        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
});

// Error handling middleware
routes.use((error, req, res, next) => {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid request data' });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      res.status(409).json({ message: 'User already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = routes;