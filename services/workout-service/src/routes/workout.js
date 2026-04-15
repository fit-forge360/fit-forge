const express = require('express');
const WorkoutPlan = require('../models/WorkoutPlan');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Protect all routes below with JWT verification
router.use(verifyToken);

// GET /workout/plans/:userId
router.get('/plans/:userId', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.params.userId });
    res.json(plans);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /workout/plans
router.post('/plans', async (req, res) => {
  try {
    const plan = await WorkoutPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /workout/plans/:planId
router.put('/plans/:planId', async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(req.params.planId, req.body, { new: true });
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /workout/plans/:planId
router.delete('/plans/:planId', async (req, res) => {
  try {
    await WorkoutPlan.findByIdAndDelete(req.params.planId);
    res.json({ message: 'Plan deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
