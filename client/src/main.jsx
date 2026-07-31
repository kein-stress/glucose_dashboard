import { createRoot } from 'react-dom/client';
import './index.css';
import './chartSetup.js';
import { App } from './App.jsx';
import { I18nProvider } from './i18n/I18nContext.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <I18nProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </I18nProvider>
);
