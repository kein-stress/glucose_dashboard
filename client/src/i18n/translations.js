export const SUPPORTED_LOCALES = ['ru', 'en', 'es', 'de', 'fr'];

export const LOCALE_LABELS = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
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
    'app.languageLabel': 'Язык:',
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
    'chart.title': 'Глюкоза вокруг тренировки',
    'chart.windowLabel': 'Окно вокруг тренировки, часы:',
    'chart.selectWorkout': 'Выбери тренировку из списка слева.',
    'chart.loading': 'Загрузка…',
    'chart.datasetLabel': 'Глюкоза ({{unit}})',
    'chart.timeAxis': 'Время',
  },
  en: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'An observational dashboard. Not a source of dosing recommendations.',
    'app.languageLabel': 'Language:',
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
    'chart.title': 'Glucose around the workout',
    'chart.windowLabel': 'Window around workout, hours:',
    'chart.selectWorkout': 'Select a workout from the list on the left.',
    'chart.loading': 'Loading…',
    'chart.datasetLabel': 'Glucose ({{unit}})',
    'chart.timeAxis': 'Time',
  },
  es: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'Panel observacional. No es una fuente de recomendaciones de dosificación.',
    'app.languageLabel': 'Idioma:',
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
    'chart.title': 'Glucosa alrededor del entrenamiento',
    'chart.windowLabel': 'Ventana alrededor del entrenamiento, horas:',
    'chart.selectWorkout': 'Selecciona un entrenamiento de la lista de la izquierda.',
    'chart.loading': 'Cargando…',
    'chart.datasetLabel': 'Glucosa ({{unit}})',
    'chart.timeAxis': 'Tiempo',
  },
  de: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': 'Beobachtendes Dashboard. Keine Grundlage für Dosierungsempfehlungen.',
    'app.languageLabel': 'Sprache:',
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
    'chart.title': 'Glukose rund um das Training',
    'chart.windowLabel': 'Fenster um das Training, Stunden:',
    'chart.selectWorkout': 'Wähle ein Training aus der Liste links.',
    'chart.loading': 'Lädt…',
    'chart.datasetLabel': 'Glukose ({{unit}})',
    'chart.timeAxis': 'Zeit',
  },
  fr: {
    'app.title': 'Glucose × Workout Dashboard',
    'app.subtitle': "Tableau de bord observationnel. Ne constitue pas une recommandation de dosage.",
    'app.languageLabel': 'Langue :',
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
    'chart.title': 'Glucose autour de la séance',
    'chart.windowLabel': 'Fenêtre autour de la séance, heures :',
    'chart.selectWorkout': 'Sélectionne une séance dans la liste à gauche.',
    'chart.loading': 'Chargement…',
    'chart.datasetLabel': 'Glucose ({{unit}})',
    'chart.timeAxis': 'Temps',
  },
};

export function translate(locale, key, vars) {
  const dict = translations[locale] || translations.en;
  let str = dict[key] ?? translations.en[key] ?? key;
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
