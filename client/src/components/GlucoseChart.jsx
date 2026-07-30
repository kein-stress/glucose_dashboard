import { Line } from 'react-chartjs-2';
import { useGlucoseData } from '../hooks/useGlucoseData.js';

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

export function GlucoseChart({ workoutId, windowHours, onWindowHoursChange }) {
  const { data, error } = useGlucoseData(workoutId, windowHours);

  let placeholder = null;
  if (workoutId == null) placeholder = 'Выбери тренировку из списка слева.';
  else if (error) placeholder = error;
  else if (!data) placeholder = 'Загрузка…';

  return (
    <>
      <label className="window-control">
        Окно вокруг тренировки, часы:
        <input
          type="number"
          min="0"
          max="12"
          step="0.5"
          value={windowHours}
          onChange={(e) => onWindowHoursChange(Number(e.target.value) || 0)}
        />
      </label>

      {placeholder ? (
        <p id="chart-placeholder">{placeholder}</p>
      ) : (
        <div className="chart-wrap">
          <Line
            data={{
              datasets: [
                {
                  label: 'Глюкоза (mg/dL)',
                  data: data.entries.map((e) => ({ x: e.date, y: e.sgv })),
                  borderColor: '#3568d4',
                  backgroundColor: 'rgba(53, 104, 212, 0.1)',
                  pointRadius: 2,
                  tension: 0.2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
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
                  start: new Date(data.workout.start_time).getTime(),
                  end: new Date(data.workout.end_time).getTime(),
                },
              },
            }}
            plugins={[workoutRangePlugin]}
          />
        </div>
      )}
    </>
  );
}
