export const SUPPORTED_LOCALES = ['ru', 'en', 'es', 'de', 'fr'];

export const CATEGORY_ORDER = ['strength', 'cardio', 'mobility', 'other'];

export const LOCALE_LABELS = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

export const LOCALE_FLAGS = {
  ru: '🇷🇺',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
};

// Used for Date#toLocaleString and for the default glucose unit.
export const LOCALE_INTL_TAG = {
  ru: 'ru-RU',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  fr: 'fr-FR',
};

export const DEFAULT_GLUCOSE_UNIT_BY_LOCALE = {
  ru: 'mmol',
};

const translations = {
  ru: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'Наблюдательный дашборд. Не источник рекомендаций по дозировке.',
    'app.unitLabel': 'Единицы глюкозы:',
    'form.title': 'Новая тренировка',
    'form.category': 'Категория',
    'form.start': 'Начало',
    'form.end': 'Конец',
    'form.intensity': 'Интенсивность (1–10)',
    'form.tags': 'Теги (через запятую)',
    'form.tagsPlaceholder': 'ноги, база, зал',
    'form.notes': 'Заметки',
    'form.submit': 'Сохранить тренировку',
    'category.strength': 'Силовая',
    'category.cardio': 'Кардио',
    'category.mobility': 'Мобильность/растяжка',
    'category.other': 'Другое',
    'list.title': 'Тренировки',
    'list.empty': 'Пока нет тренировок',
    'list.delete': 'Удалить тренировку',
    'list.confirmDelete': 'Удалить эту тренировку?',
    'chart.title': 'Глюкоза вокруг тренировки',
    'chart.windowLabel': 'Окно вокруг тренировки, часы:',
    'chart.selectWorkout': 'Выбери тренировку из списка слева.',
    'chart.loading': 'Загрузка…',
    'chart.datasetLabel': 'Глюкоза ({{unit}})',
    'chart.timeAxis': 'Время',
    'error.VALIDATION_CATEGORY': 'Категория должна быть одной из: {{categories}}',
    'error.VALIDATION_START_TIME': 'Начало обязательно и должно быть валидной датой',
    'error.VALIDATION_END_TIME': 'Конец обязателен и должен быть валидной датой',
    'error.VALIDATION_TIME_ORDER': 'Время окончания не может быть раньше времени начала',
    'error.WORKOUT_NOT_FOUND': 'Тренировка не найдена',
    'error.VALIDATION_WINDOW': 'Окно должно быть числом от 0 до 24',
    'error.NIGHTSCOUT_UNAVAILABLE': 'Не удалось получить данные из Nightscout',
  },
  en: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'An observational dashboard. Not a source of dosing recommendations.',
    'app.unitLabel': 'Glucose units:',
    'form.title': 'New workout',
    'form.category': 'Category',
    'form.start': 'Start',
    'form.end': 'End',
    'form.intensity': 'Intensity (1–10)',
    'form.tags': 'Tags (comma-separated)',
    'form.tagsPlaceholder': 'legs, compound, gym',
    'form.notes': 'Notes',
    'form.submit': 'Save workout',
    'category.strength': 'Strength',
    'category.cardio': 'Cardio',
    'category.mobility': 'Mobility/stretching',
    'category.other': 'Other',
    'list.title': 'Workouts',
    'list.empty': 'No workouts yet',
    'list.delete': 'Delete workout',
    'list.confirmDelete': 'Delete this workout?',
    'chart.title': 'Glucose around the workout',
    'chart.windowLabel': 'Window around workout, hours:',
    'chart.selectWorkout': 'Select a workout from the list on the left.',
    'chart.loading': 'Loading…',
    'chart.datasetLabel': 'Glucose ({{unit}})',
    'chart.timeAxis': 'Time',
    'error.VALIDATION_CATEGORY': 'Category must be one of: {{categories}}',
    'error.VALIDATION_START_TIME': 'Start time is required and must be a valid date',
    'error.VALIDATION_END_TIME': 'End time is required and must be a valid date',
    'error.VALIDATION_TIME_ORDER': 'End time cannot be before start time',
    'error.WORKOUT_NOT_FOUND': 'Workout not found',
    'error.VALIDATION_WINDOW': 'Window must be a number between 0 and 24',
    'error.NIGHTSCOUT_UNAVAILABLE': 'Could not fetch data from Nightscout',
  },
  es: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'Panel observacional. No es una fuente de recomendaciones de dosificación.',
    'app.unitLabel': 'Unidades de glucosa:',
    'form.title': 'Nuevo entrenamiento',
    'form.category': 'Categoría',
    'form.start': 'Inicio',
    'form.end': 'Fin',
    'form.intensity': 'Intensidad (1–10)',
    'form.tags': 'Etiquetas (separadas por comas)',
    'form.tagsPlaceholder': 'piernas, base, gimnasio',
    'form.notes': 'Notas',
    'form.submit': 'Guardar entrenamiento',
    'category.strength': 'Fuerza',
    'category.cardio': 'Cardio',
    'category.mobility': 'Movilidad/estiramiento',
    'category.other': 'Otro',
    'list.title': 'Entrenamientos',
    'list.empty': 'Aún no hay entrenamientos',
    'list.delete': 'Eliminar entrenamiento',
    'list.confirmDelete': '¿Eliminar este entrenamiento?',
    'chart.title': 'Glucosa alrededor del entrenamiento',
    'chart.windowLabel': 'Ventana alrededor del entrenamiento, horas:',
    'chart.selectWorkout': 'Selecciona un entrenamiento de la lista de la izquierda.',
    'chart.loading': 'Cargando…',
    'chart.datasetLabel': 'Glucosa ({{unit}})',
    'chart.timeAxis': 'Tiempo',
    'error.VALIDATION_CATEGORY': 'La categoría debe ser una de: {{categories}}',
    'error.VALIDATION_START_TIME': 'La hora de inicio es obligatoria y debe ser una fecha válida',
    'error.VALIDATION_END_TIME': 'La hora de fin es obligatoria y debe ser una fecha válida',
    'error.VALIDATION_TIME_ORDER': 'La hora de fin no puede ser anterior a la hora de inicio',
    'error.WORKOUT_NOT_FOUND': 'Entrenamiento no encontrado',
    'error.VALIDATION_WINDOW': 'La ventana debe ser un número entre 0 y 24',
    'error.NIGHTSCOUT_UNAVAILABLE': 'No se pudieron obtener los datos de Nightscout',
  },
  de: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'Beobachtendes Dashboard. Keine Grundlage für Dosierungsempfehlungen.',
    'app.unitLabel': 'Glukoseeinheiten:',
    'form.title': 'Neues Training',
    'form.category': 'Kategorie',
    'form.start': 'Beginn',
    'form.end': 'Ende',
    'form.intensity': 'Intensität (1–10)',
    'form.tags': 'Tags (kommagetrennt)',
    'form.tagsPlaceholder': 'Beine, Grundübung, Studio',
    'form.notes': 'Notizen',
    'form.submit': 'Training speichern',
    'category.strength': 'Kraft',
    'category.cardio': 'Cardio',
    'category.mobility': 'Mobilität/Dehnen',
    'category.other': 'Sonstiges',
    'list.title': 'Trainings',
    'list.empty': 'Noch keine Trainings',
    'list.delete': 'Training löschen',
    'list.confirmDelete': 'Dieses Training löschen?',
    'chart.title': 'Glukose rund um das Training',
    'chart.windowLabel': 'Fenster um das Training, Stunden:',
    'chart.selectWorkout': 'Wähle ein Training aus der Liste links.',
    'chart.loading': 'Lädt…',
    'chart.datasetLabel': 'Glukose ({{unit}})',
    'chart.timeAxis': 'Zeit',
    'error.VALIDATION_CATEGORY': 'Kategorie muss eine der folgenden sein: {{categories}}',
    'error.VALIDATION_START_TIME': 'Startzeit ist erforderlich und muss ein gültiges Datum sein',
    'error.VALIDATION_END_TIME': 'Endzeit ist erforderlich und muss ein gültiges Datum sein',
    'error.VALIDATION_TIME_ORDER': 'Die Endzeit darf nicht vor der Startzeit liegen',
    'error.WORKOUT_NOT_FOUND': 'Training nicht gefunden',
    'error.VALIDATION_WINDOW': 'Das Fenster muss eine Zahl zwischen 0 und 24 sein',
    'error.NIGHTSCOUT_UNAVAILABLE': 'Daten von Nightscout konnten nicht abgerufen werden',
  },
  fr: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': "Tableau de bord observationnel. Ne constitue pas une recommandation de dosage.",
    'app.unitLabel': 'Unités de glucose :',
    'form.title': 'Nouvelle séance',
    'form.category': 'Catégorie',
    'form.start': 'Début',
    'form.end': 'Fin',
    'form.intensity': 'Intensité (1–10)',
    'form.tags': 'Tags (séparés par des virgules)',
    'form.tagsPlaceholder': 'jambes, base, salle',
    'form.notes': 'Notes',
    'form.submit': "Enregistrer la séance",
    'category.strength': 'Force',
    'category.cardio': 'Cardio',
    'category.mobility': 'Mobilité/étirement',
    'category.other': 'Autre',
    'list.title': 'Séances',
    'list.empty': "Pas encore de séance",
    'list.delete': 'Supprimer la séance',
    'list.confirmDelete': 'Supprimer cette séance ?',
    'chart.title': 'Glucose autour de la séance',
    'chart.windowLabel': 'Fenêtre autour de la séance, heures :',
    'chart.selectWorkout': 'Sélectionne une séance dans la liste à gauche.',
    'chart.loading': 'Chargement…',
    'chart.datasetLabel': 'Glucose ({{unit}})',
    'chart.timeAxis': 'Temps',
    'error.VALIDATION_CATEGORY': "La catégorie doit être l'une des suivantes : {{categories}}",
    'error.VALIDATION_START_TIME': 'L\'heure de début est requise et doit être une date valide',
    'error.VALIDATION_END_TIME': "L'heure de fin est requise et doit être une date valide",
    'error.VALIDATION_TIME_ORDER': "L'heure de fin ne peut pas être antérieure à l'heure de début",
    'error.WORKOUT_NOT_FOUND': 'Séance introuvable',
    'error.VALIDATION_WINDOW': 'La fenêtre doit être un nombre entre 0 et 24',
    'error.NIGHTSCOUT_UNAVAILABLE': 'Impossible de récupérer les données depuis Nightscout',
  },
};

export function translate(locale, key, vars, fallback) {
  const dict = translations[locale] || translations.en;
  let str = dict[key] ?? translations.en[key] ?? fallback ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      str = str.replaceAll(`{{${name}}}`, value);
    }
  }
  return str;
}

export function detectLocale() {
  const candidates = (navigator.languages && navigator.languages.length > 0)
    ? navigator.languages
    : [navigator.language || 'en'];

  for (const candidate of candidates) {
    const short = candidate.slice(0, 2).toLowerCase();
    if (SUPPORTED_LOCALES.includes(short)) return short;
  }
  return 'en';
}
