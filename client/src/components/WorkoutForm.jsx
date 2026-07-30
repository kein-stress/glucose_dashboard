import { useState } from 'react';
import { buildWorkoutPayload } from '../api/workouts.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { localizeApiError } from '../lib/apiError.js';

const initialFields = {
  category: 'strength',
  start_time: '',
  end_time: '',
  intensity: '',
  tags: '',
  notes: '',
};

export function WorkoutForm({ onCreate }) {
  const { t } = useI18n();
  const [fields, setFields] = useState(initialFields);
  const [error, setError] = useState(null);

  function update(key) {
    return (event) => setFields((f) => ({ ...f, [key]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      await onCreate(buildWorkoutPayload(fields));
      setFields(initialFields);
    } catch (err) {
      setError(localizeApiError(t, err));
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          {t('form.category')}
          <select value={fields.category} onChange={update('category')} required>
            <option value="strength">{t('category.strength')}</option>
            <option value="cardio">{t('category.cardio')}</option>
            <option value="mobility">{t('category.mobility')}</option>
            <option value="other">{t('category.other')}</option>
          </select>
        </label>

        <label>
          {t('form.start')}
          <input type="datetime-local" value={fields.start_time} onChange={update('start_time')} required />
        </label>

        <label>
          {t('form.end')}
          <input type="datetime-local" value={fields.end_time} onChange={update('end_time')} required />
        </label>

        <label>
          {t('form.intensity')}
          <input type="number" min="1" max="10" value={fields.intensity} onChange={update('intensity')} />
        </label>

        <label>
          {t('form.tags')}
          <input type="text" placeholder={t('form.tagsPlaceholder')} value={fields.tags} onChange={update('tags')} />
        </label>

        <label>
          {t('form.notes')}
          <textarea rows="2" value={fields.notes} onChange={update('notes')} />
        </label>

        <button type="submit">{t('form.submit')}</button>
      </form>
      <p className="error" hidden={!error}>{error}</p>
    </>
  );
}
