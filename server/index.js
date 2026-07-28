require('dotenv').config();

const path = require('node:path');
const express = require('express');
const workoutsRouter = require('./routes/workouts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/workouts', workoutsRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Glucose Workout Dashboard listening on http://localhost:${PORT}`);
});
