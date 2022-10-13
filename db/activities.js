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
  try {
    if (!routines.length) {
      return;
    }
    const result = await Promise.all(
      routines.map(async routine => {
        const { rows } = await client.query(
          `
        SELECT activities.*, routine_activities.id AS "routineActivityId", "routineId", duration, count
        FROM activities
        JOIN routine_activities ON activities.id=routine_activities."activityId"
        WHERE routine_activities."routineId"=$1;`,
          [routine.id]
        );
        routine.activities = rows;
        return routine;
      })
    );
    return result;
  } catch (err) {
    console.error('error during attachActivitiesToRoutines');
    throw err;
  }
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
