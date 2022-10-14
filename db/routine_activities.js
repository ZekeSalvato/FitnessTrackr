const client = require('./client')

async function getRoutineActivityById(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT * FROM routine_activities
      WHERE id=$1;`,[id]);
    return routineActivity;
  } catch (error) {
    console.error('error during getROutineActivityByID');
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}){
    const { rows: [routineActivity] } = await client.query(`
    INSERT INTO routine_activities ( "routineId", "activityId", count , duration)
    VALUES($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;`, [ routineId, activityId, count, duration]);
    return routineActivity;
} 

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM routine_activities
      WHERE "routineId"=${id};`);
    return rows;
  } catch (error) {
    console.error('error during getRoutineActivitiesByRoutine');
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    const indexString = Object.keys(fields).map((key, index) => {
      return `"${key}"=$${index + 1}`;
    });
    const { rows: [routineActivity]} = await client.query(`
      UPDATE routine_activities
      SET ${indexString}
      WHERE id=${id}
      RETURNING *;`, Object.values(fields));
    return routineActivity;
  } catch (error) {
    console.error('error during updateRoutineActivity');
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {rows: [routineActivity]} = await client.query(`
        DELETE FROM routine_activities 
        WHERE id = $1
        RETURNING *;`, [id]);
    return routineActivity;
  } catch (error) {
    console.log('error during destroyRoutineActivity')
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=$1;`, [routineActivityId]);
  
    const { rows: [routine] } = await client.query(`
      SELECT *
      FROM routines
      WHERE id=$1;`, [routineActivity.routineId]);
    if (userId === routine.creatorId) {
      return true;
    }
    return false;
  } catch (error) {
    console.log('error during canEditROutineActivity')
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
