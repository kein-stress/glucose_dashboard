const express = require('express');
const db = require('../db');
const nightscout = require('../nightscout');

const router = express.Router();

const CATEGORIES = new Set(['strength', 'cardio', 'mobility', 'other']);

function serializeWorkout(row) {
  return { ...row, tags: JSON.parse(row.tags) };
}

router.post('/', (req, res) => {
  const { category, start_time, end_time, tags, intensity, notes, source } = req.body || {};

  if (!category || !CATEGORIES.has(category)) {
    return res.status(400).json({
      error: `category должна быть одной из: ${[...CATEGORIES].join(', ')}`,
      code: 'VALIDATION_CATEGORY',
    });
  }
  if (!start_time || Number.isNaN(Date.parse(start_time))) {
    return res.status(400).json({
      error: 'start_time обязателен и должен быть валидной датой (ISO 8601)',
      code: 'VALIDATION_START_TIME',
    });
  }
  if (!end_time || Number.isNaN(Date.parse(end_time))) {
    return res.status(400).json({
      error: 'end_time обязателен и должен быть валидной датой (ISO 8601)',
      code: 'VALIDATION_END_TIME',
    });
  }
  if (Date.parse(end_time) < Date.parse(start_time)) {
    return res.status(400).json({
      error: 'end_time не может быть раньше start_time',
      code: 'VALIDATION_TIME_ORDER',
    });
  }

  const stmt = db.prepare(`
    INSERT INTO workouts (source, category, tags, start_time, end_time, intensity, notes)
    VALUES (@source, @category, @tags, @start_time, @end_time, @intensity, @notes)
  `);

  const info = stmt.run({
    source: source || 'manual',
    category,
    tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    start_time: new Date(start_time).toISOString(),
    end_time: new Date(end_time).toISOString(),
    intensity: intensity ?? null,
    notes: notes || null,
  });

  const row = db.prepare('SELECT * FROM workouts WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serializeWorkout(row));
});

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM workouts ORDER BY start_time DESC').all();
  res.json(rows.map(serializeWorkout));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM workouts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Тренировка не найдена', code: 'WORKOUT_NOT_FOUND' });
  res.json(serializeWorkout(row));
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM workouts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Тренировка не найдена', code: 'WORKOUT_NOT_FOUND' });

  db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

router.get('/:id/glucose', async (req, res) => {
  const row = db.prepare('SELECT * FROM workouts WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Тренировка не найдена', code: 'WORKOUT_NOT_FOUND' });

  const windowHours = req.query.window === undefined ? 2 : Number(req.query.window);
  if (!Number.isFinite(windowHours) || windowHours < 0 || windowHours > 24) {
    return res.status(400).json({ error: 'window должен быть числом от 0 до 24', code: 'VALIDATION_WINDOW' });
  }
  const windowMs = windowHours * 60 * 60 * 1000;

  const fromMs = new Date(row.start_time).getTime() - windowMs;
  const toMs = new Date(row.end_time).getTime() + windowMs;

  try {
    const entries = await nightscout.getEntriesInRange(fromMs, toMs);
    res.json({
      workout: serializeWorkout(row),
      window_hours: windowHours,
      entries,
    });
  } catch (err) {
    console.error('Nightscout request failed:', err);
    res.status(502).json({ error: 'Не удалось получить данные из Nightscout', code: 'NIGHTSCOUT_UNAVAILABLE' });
  }
});

module.exports = router;
