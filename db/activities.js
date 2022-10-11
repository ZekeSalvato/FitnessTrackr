const client = require("./client")

// database functions
async function getAllActivities() {
  try{
    const {rows} = await client.query(`
    SELECT * FROM activities;
    `)
    ;
    return rows;
   } 
   catch (error) {
    console.log("error")
  throw error;
  }
}

async function getActivityById(id) {
  
}

async function getActivityByName(name) {

}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {

}

// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, ...fields }) {

}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
