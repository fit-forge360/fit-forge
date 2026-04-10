require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/auth_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('[auth-service] MongoDB connected'))
  .catch((err) => {
    console.error('[auth-service] MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/auth', authRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK', service: 'auth-service' }));

app.listen(PORT, () => console.log(`[auth-service] Running on port ${PORT}`));
