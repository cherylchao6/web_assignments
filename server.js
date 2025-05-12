const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const SitesDB = require("./modules/sitesDB");
const db = new SitesDB();
const HTTP_PORT = 3001;

app.use(cors());
app.use(express.json());

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
      res.status(500).json({ error: err.message });
    });
});

app.post("/api/sites", (req, res) => {
  db.addNewSite(req.body)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.get("/api/sites/:id", (req, res) => {
  db.getSiteById(req.params.id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Site not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.put("/api/sites/:id", (req, res) => {
  db.updateSiteById(req.body, req.params.id)
    .then((data) => {
      if (data) {
        res.json({
          message: `Site with id ${req.params.id} updated successfully`,
        });
      } else {
        res.status(404).json({ error: "Site not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.delete("/api/sites/:id", (req, res) => {
  db.deleteSiteById(req.params.id)
    .then((data) => {
      if (data) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: "Site not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log("Database initialized");
    app.listen(HTTP_PORT, () => {
      // vercel is serverless, so we don't need to log the port
      // console.log(`server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = (req, res) => {
  app(req, res); // Use the express app to handle the request
};
