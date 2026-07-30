import { Line } from 'react-chartjs-2';
import { useGlucoseData } from '../hooks/useGlucoseData.js';
import { convertGlucose, glucoseUnitLabel } from '../lib/format.js';
import { useI18n } from '../i18n/I18nContext.jsx';

const SUGGESTED_RANGE_MGDL = { min: 60, max: 200 };

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

export function GlucoseChart({ workoutId, windowHours, onWindowHoursChange, unit }) {
  const { t, locale } = useI18n();
  const { data, error } = useGlucoseData(workoutId, windowHours);
  const unitLabel = glucoseUnitLabel(unit, locale);

  let placeholder = null;
  if (workoutId == null) placeholder = t('chart.selectWorkout');
  else if (error) placeholder = error;
  else if (!data) placeholder = t('chart.loading');

  return (
    <>
      <label className="window-control">
        {t('chart.windowLabel')}
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
                  label: t('chart.datasetLabel', { unit: unitLabel }),
                  data: data.entries.map((e) => ({ x: e.date, y: convertGlucose(e.sgv, unit) })),
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
                  title: { display: true, text: t('chart.timeAxis') },
                },
                y: {
                  title: { display: true, text: unitLabel },
                  suggestedMin: convertGlucose(SUGGESTED_RANGE_MGDL.min, unit),
                  suggestedMax: convertGlucose(SUGGESTED_RANGE_MGDL.max, unit),
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
