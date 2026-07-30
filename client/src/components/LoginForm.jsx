import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { localizeApiError } from '../lib/apiError.js';

export function LoginForm() {
  const { t } = useI18n();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(password);
    } catch (err) {
      setError(localizeApiError(t, err));
      setSubmitting(false);
    }
  }

  return (
    <main className="login-panel">
      <form onSubmit={handleSubmit}>
        <h1>{t('login.title')}</h1>
        <label>
          {t('login.password')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {t('login.submit')}
        </button>
        <p className="error" hidden={!error}>{error}</p>
      </form>
    </main>
  );
}
