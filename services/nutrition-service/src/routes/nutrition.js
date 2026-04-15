const express = require('express');
const DietEntry = require('../models/DietEntry');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Protect all routes below with JWT verification
router.use(verifyToken);

// GET /nutrition/diet/:userId
router.get('/diet/:userId', async (req, res) => {
  try {
    const entries = await DietEntry.find({ userId: req.params.userId }).sort({ date: -1 }).limit(30);
    res.json(entries);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /nutrition/diet
router.post('/diet', async (req, res) => {
  try {
    const entry = await DietEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /nutrition/diet/:entryId
router.delete('/diet/:entryId', async (req, res) => {
  try {
    await DietEntry.findByIdAndDelete(req.params.entryId);
    res.json({ message: 'Entry deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
