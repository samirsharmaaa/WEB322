/********************************************************************************
* WEB322 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Samir Sharma       Student ID: 166531236        Date: 6/15/2025
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require("express");
const path = require("path");

const app = express();
const HTTP_PORT = process.env.PORT || 3000;

// Sample projects data
const projects = [
  { id: 1, title: "Project 1", summary_short: "Summary 1", feature_img_url: "https://via.placeholder.com/400x200", sector: "industry" },
  { id: 2, title: "Project 2", summary_short: "Summary 2", feature_img_url: "https://via.placeholder.com/400x200", sector: "transportation" },
  { id: 3, title: "Project 3", summary_short: "Summary 3", feature_img_url: "https://via.placeholder.com/400x200", sector: "agriculture" },
];

// Static files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views/about.html"));
});

// Projects list with optional sector filter
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  let filteredProjects = projects;

  if (sector) {
    filteredProjects = projects.filter(p => p.sector === sector);
  }
  res.json(filteredProjects);
});

// Project details route
app.get("/solutions/projects/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const project = projects.find(p => p.id === id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).sendFile(path.join(__dirname, "views/404.html"));
  }
});

// Custom 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views/404.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});