

require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');

let sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

// Define Sector model
const Sector = sequelize.define('Sector', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  sector_name: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

// Define Project model
const Project = sequelize.define('Project', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  feature_img_url: Sequelize.STRING,
  summary_short: Sequelize.TEXT,
  intro_short: Sequelize.TEXT,
  impact: Sequelize.TEXT,
  original_source_url: Sequelize.STRING
}, {
  createdAt: false,
  updatedAt: false
});

// Define association
Project.belongsTo(Sector, { foreignKey: 'sector_id' });

// Initialize DB
function initialize() {
  return sequelize.sync();
}

// Get all projects with sector
function getAllProjects() {
  return Project.findAll({ include: [Sector] });
}

// Get one project by ID
function getProjectById(projectId) {
  return Project.findAll({
    where: { id: projectId },
    include: [Sector]
  }).then(data => {
    if (data.length > 0) return data[0];
    else throw "Unable to find requested project";
  });
}

// Get projects by sector name
function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      '$Sector.sector_name$': {
        [Sequelize.Op.iLike]: `%${sector}%`
      }
    }
  }).then(data => {
    if (data.length > 0) return data;
    else throw "Unable to find requested projects";
  });
}

// Add a new project
function addProject(projectData) {
  return Project.create(projectData).catch(err => {
    throw err.errors[0].message;
  });
}

// Get all sectors
function getAllSectors() {
  return Sector.findAll();
}

// Edit a project
function editProject(id, projectData) {
  return Project.update(projectData, { where: { id } }).catch(err => {
    throw err.errors[0].message;
  });
}

// Delete a project
function deleteProject(id) {
  return Project.destroy({ where: { id } }).catch(err => {
    throw err.errors[0].message;
  });
}
function getAllSectors() {
  return Sector.findAll();
}

function addProject(projectData) {
  return Project.create(projectData).catch(err => {
    throw err.errors[0].message;
  });
}



module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  addProject,
  getAllSectors,
  editProject,
  deleteProject,
   addProject,
  getAllSectors
};

