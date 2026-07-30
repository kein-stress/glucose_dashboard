import { CATEGORY_ORDER } from '../i18n/translations.js';

export function localizeApiError(t, err) {
  if (!err) return '';
  if (!err.code) return err.message || '';

  if (err.code === 'VALIDATION_CATEGORY') {
    const categories = CATEGORY_ORDER.map((c) => t(`category.${c}`)).join(', ');
    return t('error.VALIDATION_CATEGORY', { categories }, err.message);
  }

  return t(`error.${err.code}`, undefined, err.message);
}
