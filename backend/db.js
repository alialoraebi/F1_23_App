const mongoose = require("mongoose");

exports.connect = () => {
  const DB_HOST = process.env.DB_HOST;
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_NAME = process.env.DB_NAME;
  const DB_PORT = process.env.DB_PORT || 27017;
  const USE_SRV = process.env.USE_SRV || false;

  let DB_CONNECTION_STRING;

  if (USE_SRV === 'true') {
    DB_CONNECTION_STRING = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
  } else {
    DB_CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  }

  // Connect to MongoDB
  mongoose.connect(DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Success Mongodb connection");
  }).catch(err => {
    // Handle error
    if (err.name === "MongoNetworkError") {
      console.error("Failed to connect to MongoDB: Network error");
    } else if (err.name === "MongoParseError") {
      console.error("Failed to connect to MongoDB: Invalid connection string");
    } else {
      console.error("Failed to connect to MongoDB:", err.message);
    }
  });
};