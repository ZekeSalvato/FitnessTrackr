const client = require("./client")

// database functions
async function getAllActivities() {
  try{
    const {rows} = await client.query(`
    SELECT * FROM activities;`);
    return rows;
   } catch (error) {
    console.log("error during getAllActivities")
    throw error;
  }
}

async function getActivityById(id) {
  const { rows: [activity] } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=$1;`, [id]);
  return activity;

}

async function getActivityByName(name) {
  const { rows: [user] } = await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1;`, [name]);
  return user;
}

async function attachActivitiesToRoutines(routines) {
  try {
    if (!routines.length) {
      return;
    }
    const result = await Promise.all(
      routines.map(async routine => {
        const { rows } = await client.query(`
        SELECT activities.*, routine_activities.id AS "routineActivityId", "routineId", duration, count
        FROM activities
        JOIN routine_activities ON activities.id=routine_activities."activityId"
        WHERE routine_activities."routineId"=$1;`, [routine.id]);
        routine.activities = rows;
        return routine;
      })
    );
    return result;
  } catch (error) {
    console.error('error during attachActivitiesToRoutines');
    throw error;
  }
}

async function createActivity({ name, description }) {
  const { rows: [activity] } = await client.query(`
  INSERT INTO activities(name, description) 
  VALUES($1, $2) 
  RETURNING *;
`, [name, description]);

  return activity;
}

async function updateActivity({ id, ...fields }) {
  try {
    const setString = Object.keys(fields).map((key, index) => {
      return `"${key}"=$${index + 1}`});
    const {rows: [activity]} = await client.query(`
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;`, Object.values(fields));
    return activity;
  } catch (error) {
    console.error('error during updateActivity');
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
