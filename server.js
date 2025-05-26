/********************************************************************************
 * WEB422 – Assignment 1
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Tzu Han Chao Student ID: 151593225 Date: 2025/05/12
 *
 * Published URL on Vercel: https://web-assignments-xi.vercel.app/
 *
 ********************************************************************************/
//set up
const express = require("express");
var cors = require("cors");
require("dotenv").config();
const app = express();
const HTTP_PORT = process.env.PORT || 3001;
const SitesDB = require("./modules/sitesDB.js");
const db = new SitesDB();

app.use(express.json());
app.use(cors());

// Tell the app to start listening for requests
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send({
    message: "API Listening",
    term: "Summer 2025",
    student: "Tzu Han Chao",
  });
});

app.get("/api/sites", (req, res) => {
  const { page, perPage, name, region, provinceOrTerritoryName } = req.query;
  //valid page and perPage
  if (!page || !perPage) {
    return res.status(400).json({
      message: "Missing required query parameters: page and perPage.",
    });
  }
  db.getAllSites(page, perPage, name, region, provinceOrTerritoryName)
    .then((sitesData) => {
      return res.send(sitesData);
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

//GET ID
app.get("/api/sites/:id", (req, res) => {
  const { id } = req.params;
  db.getSiteById(id)
    .then((siteData) => {
      return res.status(200).json(siteData);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Internal server error",
      });
    });
});

app.post("/api/sites", (req, res) => {
  const data = req.body;
  db.addNewSite(data)
    .then((siteData) => {
      res.status(201).json(siteData);
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Internal server error",
      });
    });
});

//PUT
app.put("/api/sites/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  db.updateSiteById(data, id)
    .then((sitesData) => {
      return res.status(200).json("Updated successed");
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Internal server error",
      });
    });
});

//DELETE
app.delete("/api/sites/:id", (req, res) => {
  const { id } = req.params;
  db.deleteSiteById(id)
    .then((sitesData) => {
      return res.status(204).end();
    })
    .catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
});

//404
app.use((req, res) => {
  res.status(404).json({
    message: "Resource not found",
  });
});
