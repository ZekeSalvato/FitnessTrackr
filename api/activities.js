const express = require('express');
const router = express.Router();
const {
  getAllActivities,
  getPublicRoutinesByActivity,
  createActivity,
  getActivityByName,
  updateActivity,
  getActivityById,
} = require(`../db`);
const { ActivityExistsError, ActivityNotFoundError } = require(`../errors`);
const {requireUser} = require(`./utils`);

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res) => {
  const { activityId, } = req.params;
  const _activity = await getActivityById(activityId);
  const allPublicRoutineActivities = await getPublicRoutinesByActivity({
    id: activityId,
  });

  if (!_activity) {
    res.send({
      error: 'ActivityDoesNotExists',
      name: 'Activity does not exists',
      message: ActivityNotFoundError(activityId),
    });
  } else {
    res.send(allPublicRoutineActivities);
  }
});

// GET /api/activities
router.get('/', async (req, res) => {
  const allActivities = await getAllActivities();

  res.send(allActivities);
});

// POST /api/activities
router.post('/', requireUser, async (req, res) => {
  const { name, description } = req.body;
  const _name = await getActivityByName(name);
  const newActivity = await createActivity({ name, description });

  if (_name) {
    res.send({
      error: 'ActivityAlreadyExists',
      name: 'Activity already exists',
      message: ActivityExistsError(_name.name),
    });
  } else {
    res.send(newActivity);
  }
});

// PATCH /api/activities/:activityId
router.patch('/:activityId', requireUser, async (req, res, next) => {
  const { activityId } = req.params;
 
 try {
  const { name, description } = req.body;

  const updateFields = {};

  if (activityId) {
    updateFields.id = activityId;
  }

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }

  const _activity = await getActivityById(activityId);
  const _name = await getActivityByName(name);

  if (!_activity) {
    res.send({
      error: 'ActivityDoesNotExists',
      name: 'Activity does not exists',
      message: ActivityNotFoundError(activityId),
    });
  } else if (_name) {
    res.send({
      error: 'ActivityAlreadyExists',
      name: 'Activity already exists',
      message: ActivityExistsError(_name.name),
    });
  } else {
    const allCanUpdateActivity = await updateActivity(updateFields);
    res.send(allCanUpdateActivity);
  }
} catch ({ name, message }) {
  next({ name, message });
}

});

module.exports = router;