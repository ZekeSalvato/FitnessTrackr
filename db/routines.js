const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities');

async function getRoutineById(id){
  try {
    const {rows: [routine]} = await client.query(`
      SELECT * FROM routines
      WHERE id = $1`, [id]);
    return routine;
  } catch (error) {
    console.log('error during getRoutineByID')
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try {
    const {rows} = await client.query(`
    SELECT * FROM routines;`);
    return rows;
  } 
  catch (error) {
    console.log('error getroutineswithoutactivities');
    throw error;
  }
}


async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log("error during getAllRoutines func");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE users.username=$1;`, [username]);
    const result = await attachActivitiesToRoutines(routines);
    return result;
  } catch (error) {
    console.error('error during getAllROutinesByUser');
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: routines } = await client.query(`
        SELECT routines.*, users.username AS "creatorName"
        FROM routines
        JOIN users ON routines."creatorId"=users.id
        WHERE "isPublic"='true' AND users.username=$1;`,[username]);
    const result = await attachActivitiesToRoutines(routines);
    return result;
  } catch (error) {
    console.error('error during getPublicRoutinesByUSer func');
    throw error;
  }
}


async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true`);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log('error during getAllPublicRoutines func');
    throw error;
  }
}

async function getPublicRoutinesByActivity({id}) {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routine_activities ON routine_activities."routineId" = routines.id
      WHERE routines."isPublic" = true
      AND routine_activities."activityId" = $1;`, [id]);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.log('error during getPublicROutinesByActivity');
    throw error;
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;`, [creatorId, isPublic, name, goal]);
    return routine;
  } catch (error) {
    console.error('error during createRoutine');
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  try {
    const setString = Object.keys(fields).map(
      (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');
    if (setString.length === 0) {
      return;
    }
    const { rows: [user] } = await client.query(`
  UPDATE routines
  SET ${setString}
  WHERE id=${id}
  RETURNING *;`, Object.values(fields));
    return user;
  } catch (error) {
    console.log('error during updateRoutine');
    throw error;
  }
}
async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId"=$1;`,[id]);
    await client.query(`
    DELETE FROM routines
    WHERE id=$1;`,[id]);
  } catch(error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}