require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nutritionRoutes = require('./routes/nutrition');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/nutrition_db';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('[nutrition-service] MongoDB connected'))
  .catch((err) => { console.error(err.message); process.exit(1); });

app.use('/nutrition', nutritionRoutes);
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'nutrition-service' }));
app.listen(PORT, () => console.log(`[nutrition-service] Running on port ${PORT}`));
//