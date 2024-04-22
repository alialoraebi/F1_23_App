require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');

const db = require("./db");
const authenticateToken = require("./middleware/authenticateToken");

app.use(cors());
app.use(express.json());

// Server port
const port = process.env.PORT || 4000;

// MongoDB Connection
db.connect();

// Routes
const userRoutes = require("./routes/users");
app.use("/user", userRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api', authenticateToken, statsRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});