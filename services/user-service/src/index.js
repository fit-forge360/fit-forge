require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/user_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('[user-service] MongoDB connected'))
  .catch((err) => { console.error(err.message); process.exit(1); });

app.use('/users', userRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'user-service' }));
app.listen(PORT, () => console.log(`[user-service] Running on port ${PORT}`));


// I added a new line