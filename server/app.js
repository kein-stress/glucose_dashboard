const path = require('node:path');
const express = require('express');
const workoutsRouter = require('./routes/workouts');
const authRouter = require('./routes/auth');
const { requireAuth } = require('./auth');

if (!process.env.AUTH_PASSWORD_HASH) {
  console.warn(
    'AUTH_PASSWORD_HASH не задан — вход невозможен, все защищённые эндпоинты вернут 401. ' +
      'Сгенерируйте хэш через `npm run hash-password -- "<пароль>"` и добавьте в .env.',
  );
}

const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use('/api', authRouter);
app.use('/api/workouts', requireAuth, workoutsRouter);
app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = app;
