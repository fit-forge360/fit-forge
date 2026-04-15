const express = require('express');
const Profile = require('../models/Profile');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Protect all routes below with JWT verification
router.use(verifyToken);

// GET /users/:userId
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /users  — create profile after signup
router.post('/', async (req, res) => {
  try {
    const profile = await Profile.create(req.body);
    res.status(201).json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /users/:userId
router.put('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
