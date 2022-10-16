const express = require('express');
const {
  updateRoutineActivity,
  getRoutineActivityById,
  canEditRoutineActivity,
  getRoutineById,
  destroyRoutineActivity,
} = require('../db');
const {
  UnauthorizedUpdateError,
  UnauthorizedDeleteError,
} = require('../errors');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;

    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);

    const userCanEditRoutine = await canEditRoutineActivity(
      routineActivityId,
      req.user.id
    );

    if (userCanEditRoutine) {
      const { count, duration } = req.body;
      const updatedRoutineActivity = {};

      if (count) {
        updatedRoutineActivity.count = count;
      }

      if (duration) {
        updatedRoutineActivity.duration = duration;
      }

      if (routineActivityId) {
        updatedRoutineActivity.id = routineActivityId;
        const result = await updateRoutineActivity(updatedRoutineActivity);
        res.send(result);
      }
    } else {
      res.send({
        error: 'UserUnauthorized',
        name: 'User unauthorized to update this routine',
        message: UnauthorizedUpdateError(req.user.username, routine.name),
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
  try {
    const { routineActivityId } = req.params;

    const routineActivity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routineActivity.routineId);

    const userCanEditRoutine = await canEditRoutineActivity(
      routineActivityId,
      req.user.id
    );

    if (userCanEditRoutine) {
      const result = await destroyRoutineActivity(routineActivity.id);
      res.send(result);
    } else {
      res.status(403).send({
        error: 'UserUnauthorized',
        name: 'User unauthorized to update this routine',
        message: UnauthorizedDeleteError(req.user.username, routine.name),
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;