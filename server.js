/********************************************************************************
*  WEB322 – Assignment 05
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: _____Samir Sharma_____ Student ID: _166531236____ Date: ___7/18/2025___________
*
*  Published URL: ___________________________________________________________
*
********************************************************************************/


const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const HTTP_PORT = process.env.PORT || 4000;

// Sequelize functions
const {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  addProject,
  getAllSectors,
  editProject,
  deleteProject
} = require("./modules/projects");


// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Routes */

// Home
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// View all projects (with optional sector filter)
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;

  const fetch = sector ? getProjectsBySector(sector) : getAllProjects();

  fetch
    .then(projects => {
      res.render("projects", { projects, page: "/solutions/projects" });
    })
    .catch(err => {
      res.status(404).render("404", { message: "No projects found." });
    });
});

// View single project by ID
app.get("/solutions/projects/:id", (req, res) => {
  getProjectById(parseInt(req.params.id))
    .then(project => res.render("project", { project, page: "" }))
    .catch(err => res.status(404).render("404", { message: "Project not found." }));
});

// Add Project Form
app.get("/solutions/addProject", (req, res) => {
  getAllSectors()
    .then(sectors => res.render("addProject", { sectors }))
    .catch(err => res.render("500", { message: err }));
});


app.get("/solutions/editProject/:id", (req, res) => {
  const id = parseInt(req.params.id);

  Promise.all([
    getProjectById(id),
    getAllSectors()
  ])
    .then(([project, sectors]) => {
      res.render("editProject", { project, sectors });
    })
    .catch(err => {
      res.status(404).render("404", { message: "Project not found." });
    });
});

app.get("/solutions/deleteProject/:id", (req, res) => {
  const id = parseInt(req.params.id);
  deleteProject(id)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err => res.render("500", { message: `Delete failed: ${err}` }));
});



app.post("/solutions/editProject/:id", (req, res) => {
  const id = parseInt(req.params.id);

  editProject(id, req.body)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err =>
      res.render("500", { message: `Failed to update project: ${err}` })
    );
});


// Add Project POST
app.post("/solutions/addProject", (req, res) => {
  addProject(req.body)
    .then(() => res.redirect("/solutions/projects"))
    .catch(err =>
      res.render("500", { message: `I'm sorry, but we have encountered the following error: ${err}` })
    );
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404", { message: "Sorry, we couldn't find what you were looking for." });
});



// Start server after DB sync
initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on port ${HTTP_PORT}`);
    });
  })
  .catch(err => {
    console.log("Failed to initialize the database:", err);
  });
