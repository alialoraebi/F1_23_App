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
  const user = req.body;
  console.log(user);

  if (!user || !user.username || !user.password) {
      res.status(400).json({ message: 'Username and password are required' });
  } else {
      // Check if user already exists
      const existingUser = await userModel.findOne({ username: user.username });
      if (existingUser) {
          res.status(409).json({ message: 'Username already exists' });
      } else {
          // Hash the password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          user.password = hashedPassword;

          // Create a new user
          const newUser = new userModel(user);
          await newUser.save();
          res.status(201).json({ message: 'User account created successfully' });
      }
  }
});    


// User Login
routes.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find the user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        //Password comparison
        const passwordMatch = await bcrypt.compare(password, user.password);

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