const path = require('node:path');
const express = require('express');
const workoutsRouter = require('./routes/workouts');

const app = express();

app.use(express.json());
app.use('/api/workouts', workoutsRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = app;
