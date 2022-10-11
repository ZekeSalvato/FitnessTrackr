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
  const { rows: [activity] } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=$1;
  `, [id])
  return activity;

}

async function getActivityByName(name) {
  const { rows: [user] } = await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1;
      `, [name]);
  return user;
}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
}

// return the new activity
async function createActivity({ name, description }) {
  const { rows: [activity] } = await client.query(`
  INSERT INTO activities(name, description) 
  VALUES($1, $2) 
  RETURNING *;
`, [name, description]);

  return activity;
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
