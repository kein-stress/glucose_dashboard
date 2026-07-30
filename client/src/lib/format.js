const MGDL_PER_MMOL = 18.0182;

export function glucoseUnitLabel(unit, locale) {
  if (unit === 'mmol') return locale === 'ru' ? 'ммоль/л' : 'mmol/L';
  return 'mg/dL';
}

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

export function fmtDisplay(iso, intlTag = 'ru-RU') {
  const d = new Date(iso);
  return d.toLocaleString(intlTag, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
