const form = document.getElementById('workout-form');
const formError = document.getElementById('form-error');
const listEl = document.getElementById('workout-list');
const windowInput = document.getElementById('window-input');
const chartPlaceholder = document.getElementById('chart-placeholder');
const canvas = document.getElementById('glucose-chart');

let workouts = [];
let selectedWorkoutId = null;
let chart = null;

const CATEGORY_LABELS = {
  strength: 'Силовая',
  cardio: 'Кардио',
  mobility: 'Мобильность',
  other: 'Другое',
};

// Плагин: подсвечивает интервал тренировки на графике глюкозы.
const workoutRangePlugin = {
  id: 'workoutRange',
  beforeDatasetsDraw(chartInstance, _args, opts) {
    if (!opts?.start || !opts?.end) return;
    const { ctx, chartArea, scales } = chartInstance;
    const xScale = scales.x;
    const x1 = xScale.getPixelForValue(opts.start);
    const x2 = xScale.getPixelForValue(opts.end);

    ctx.save();
    ctx.fillStyle = 'rgba(53, 104, 212, 0.15)';
    ctx.fillRect(x1, chartArea.top, x2 - x1, chartArea.bottom - chartArea.top);
    ctx.restore();
  },
};

function fmtDateTimeLocal(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDisplay(iso) {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function loadWorkouts() {
  const res = await fetch('/api/workouts');
  workouts = await res.json();
  renderList();
}

function renderList() {
  listEl.innerHTML = '';
  if (workouts.length === 0) {
    listEl.innerHTML = '<li class="meta">Пока нет тренировок</li>';
    return;
  }

  for (const w of workouts) {
    const li = document.createElement('li');
    li.className = 'workout-item' + (w.id === selectedWorkoutId ? ' selected' : '');
    li.innerHTML = `
      <div class="category">${CATEGORY_LABELS[w.category] || w.category}</div>
      <div class="meta">${fmtDisplay(w.start_time)} → ${fmtDisplay(w.end_time)}</div>
      ${w.tags.length ? `<div class="meta">${w.tags.join(', ')}</div>` : ''}
    `;
    li.addEventListener('click', () => selectWorkout(w.id));
    listEl.appendChild(li);
  }
}

async function selectWorkout(id) {
  selectedWorkoutId = id;
  renderList();
  await loadGlucoseForSelected();
}

async function loadGlucoseForSelected() {
  if (selectedWorkoutId == null) return;

  const windowHours = Number(windowInput.value) || 0;
  const res = await fetch(`/api/workouts/${selectedWorkoutId}/glucose?window=${windowHours}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    chartPlaceholder.hidden = false;
    chartPlaceholder.textContent = body.error || 'Не удалось загрузить данные глюкозы';
    canvas.style.display = 'none';
    return;
  }

  const { workout, entries } = await res.json();
  renderChart(workout, entries);
}

function renderChart(workout, entries) {
  chartPlaceholder.hidden = true;
  canvas.style.display = 'block';

  const points = entries.map((e) => ({ x: e.date, y: e.sgv }));

  if (chart) chart.destroy();
  chart = new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Глюкоза (mg/dL)',
          data: points,
          borderColor: '#3568d4',
          backgroundColor: 'rgba(53, 104, 212, 0.1)',
          pointRadius: 2,
          tension: 0.2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'hour', tooltipFormat: 'dd.MM HH:mm' },
          title: { display: true, text: 'Время' },
        },
        y: {
          title: { display: true, text: 'mg/dL' },
          suggestedMin: 60,
          suggestedMax: 200,
        },
      },
      plugins: {
        workoutRange: {
          start: new Date(workout.start_time).getTime(),
          end: new Date(workout.end_time).getTime(),
        },
      },
    },
    plugins: [workoutRangePlugin],
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.hidden = true;

  const data = new FormData(form);
  const payload = {
    category: data.get('category'),
    start_time: data.get('start_time'),
    end_time: data.get('end_time'),
    intensity: data.get('intensity') ? Number(data.get('intensity')) : null,
    tags: String(data.get('tags') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    notes: data.get('notes') || null,
  };

  const res = await fetch('/api/workouts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    formError.textContent = body.error || 'Ошибка сохранения';
    formError.hidden = false;
    return;
  }

  const created = await res.json();
  form.reset();
  await loadWorkouts();
  selectWorkout(created.id);
});

windowInput.addEventListener('change', () => {
  if (selectedWorkoutId != null) loadGlucoseForSelected();
});

loadWorkouts();
