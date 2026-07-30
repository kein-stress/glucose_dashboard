export const CATEGORY_LABELS = {
  strength: 'Силовая',
  cardio: 'Кардио',
  mobility: 'Мобильность',
  other: 'Другое',
};

const MGDL_PER_MMOL = 18.0182;

export const GLUCOSE_UNIT_LABELS = {
  mgdl: 'mg/dL',
  mmol: 'ммоль/л',
};

// Nightscout всегда отдаёт sgv в mg/dL — конвертируем только для отображения.
export function convertGlucose(mgdl, unit) {
  if (unit === 'mmol') return Math.round((mgdl / MGDL_PER_MMOL) * 10) / 10;
  return mgdl;
}

// Обратная конвертация — из отображаемых единиц обратно в mg/dL.
export function convertToMgdl(value, unit) {
  if (unit === 'mmol') return Math.round(value * MGDL_PER_MMOL);
  return value;
}

export function fmtDateTimeLocal(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtDisplay(iso) {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
