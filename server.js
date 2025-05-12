const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const SitesDB = require("./modules/sitesDB");
const db = new SitesDB();

// Initialize MongoDB connection before handling requests
const initializeDatabase = async () => {
  try {
    console.log("Attempting to connect to the database...");
    await db.initialize(process.env.MONGODB_CONN_STRING);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
};

// Ensure database is initialized before handling requests
initializeDatabase().then(() => {
  app.use(cors());
  app.use(express.json());
  // listen on port 3000 for local development
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server is running on port", process.env.PORT || 3001);
  });

  app.get("/", (req, res) => {
    res.send({
      message: "API Listening",
      term: "Summer 2025",
      student: "Tzu Han Chao",
    });
  });

  app.get("/api/sites", (req, res) => {
    let { page, perPage, name, region, provinceOrTerritoryName } = req.query;

    if (!page || !perPage) {
      page = 1;
      perPage = 10;
    }

    db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.error("Error fetching sites:", err);
        res.status(500).json({ error: "Failed to fetch sites" });
      });
  });

  // Export the handler for Vercel to invoke
  module.exports = async (req, res) => {
    console.log("Handler invoked"); // Log every time the function is invoked
    app(req, res); // Vercel will invoke this function
  };
});
