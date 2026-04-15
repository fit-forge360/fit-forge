const express = require('express');
const ProgressLog = require('../models/ProgressLog');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Protect all routes below with JWT verification
router.use(verifyToken);

// GET /progress/summary/:userId  — last 10 entries
router.get('/summary/:userId', async (req, res) => {
  try {
    const logs = await ProgressLog.find({ userId: req.params.userId })
      .sort({ date: -1 })
      .limit(10);
    res.json(logs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /progress/log  — log new progress entry + push Redis event
router.post('/log', async (req, res) => {
  try {
    const log = await ProgressLog.create(req.body);

    res.status(201).json(log);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
