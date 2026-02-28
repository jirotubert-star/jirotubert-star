/*
OneStep – Projekt-Überblick
---------------------------
Diese App unterstützt nachhaltigen Fortschritt durch kleine tägliche Schritte.
Sie organisiert Ziele (Life Goals) als Aufgaben-Pool, erzeugt daraus eine
minimalistische Tages-Checkliste und visualisiert den Fortschritt.

Kernideen:
- Jeden Tag kleine, machbare Aufgaben statt überfordernder Pläne.
- Eine neue Aufgabe wird alle 3 Tage freigeschaltet (sanfte Steigerung).
- Alles wird lokal im Browser (LocalStorage) gespeichert.

Aufbau der App:
- UI ist in drei Bereiche gegliedert: Today, Life Goals, Progress.
- JavaScript verwaltet Zustand + LocalStorage und rendert das UI.
- CSS sorgt für ruhiges, reduziertes Design (Beige/Grün, sanfte Animationen).
*/

// ---------------------------
// LocalStorage Schlüssel
// ---------------------------
const STORAGE_KEY = "onestep_state_v1";
const APP_VERSION = "1.8.7";
const BACKUP_SCHEMA_VERSION = 2;
const LANGUAGE_KEY = "onestep_language_v1";
const ERROR_LOG_KEY = "onestep_error_log_v1";
const SUPPORTED_LANGS = ["de", "en", "ru", "es", "fr"];
const FAST_ONBOARDING_ENABLED = false;
const FAST_ONBOARDING_TOTAL_DAYS = 12;
const INTRO_VARIANT_KEY = "onestep_intro_variant_v1";
const LAST_BACKUP_KEY = "onestep_last_backup_v1";
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "";
const VOCAB_SEED_URL = "./data/vocab.fr-de.a2.json";
const VocabLogic = (typeof window !== "undefined" && window.VocabLogic) ? window.VocabLogic : null;

const I18N = {
  de: {
    appTitle: "OneStep – Jeden Tag ein kleiner Schritt",
    appDescription: "OneStep ist eine minimalistische Web-App für tägliche kleine Aufgaben.",
    chooseLanguage: "Sprache wählen",
    chooseLanguageText: "Bitte wähle eine Sprache.",
    languageSaved: "Sprache gespeichert",
    tagline: "Ein kleiner Schritt pro Tag ist besser als ein perfekter Plan.",
    todayCountWord: "Aufgaben",
    quickTaskPlaceholder: "Einmalige Aufgabe",
    goalPlaceholder: "z. B. 15 Minuten lesen",
    planTaskPlaceholder: "z. B. 5 km Lauf / Schwimmen",
    timePickerTitle: "Uhrzeit auswählen",
    timePickerHour: "Stunde",
    timePickerMinute: "Minute",
    timePickerApply: "Übernehmen",
    timePrefix: "Zeit",
    btnAdd: "Hinzufügen",
    btnTomorrow: "Für morgen",
    btnSideQuestAdd: "Nebenaufgabe hinzufügen",
    sideQuestSelectLabel: "Nebenaufgabe auswählen",
    btnRandom: "Zufällig auswählen",
    emptyToday: "Noch keine Tagesaufgaben – füge ein Ziel hinzu.",
    emptyGoals: "Noch keine Ziele – beginne mit einem kleinen Schritt.",
    sideQuestHead: "Nebenaufgaben",
    tomorrowHead: "Morgen",
    badgeOneTime: "Einmalig",
    badgeTomorrow: "Morgen",
    maxSideQuest: "Maximal 3 Nebenaufgaben erreicht",
    noGoalsAvailable: "Keine weiteren Ziele verfügbar",
    unlockIntro: "3 Tage sind vorbei – du kannst eine weitere Aufgabe hinzufügen oder zufällig auswählen.",
    unlockIntroDaily: "Onboarding Fast: Heute ist eine weitere Aufgabe freigeschaltet.",
    resetConfirm: "Möchtest du wirklich alles zurücksetzen?",
    toastGoalAdded: "Ziel hinzugefügt",
    toastGoalTimeUpdated: "Zeit aktualisiert",
    toastTaskAdded: "Neue Tagesaufgabe hinzugefügt",
    toastTodayAdded: "Aufgabe für heute hinzugefügt",
    toastTomorrowAdded: "Aufgabe für morgen geplant",
    toastSideAdded: "Nebenaufgabe hinzugefügt",
    toastSideRemoved: "Nebenaufgabe entfernt",
    toastReset: "App wurde zurückgesetzt",
    toastOffset: "Tag-Offset gesetzt",
    toastProOn: "Pro-Modus aktiv",
    toastProOff: "Pro-Modus deaktiviert",
    toastWeightSaved: "Gewicht gespeichert",
    toastWeightInvalid: "Bitte ein gültiges Gewicht zwischen 20 und 400 eingeben",
    planNeed: "Bitte mindestens 4 Tage eintragen",
    planWeek: "Woche geplant",
    planRestDayInfo: "Nicht ausgefüllte Tage gelten als Rest Day.",
    restDayPrefix: "Rest Day",
    tutorialStart: "Start",
    tutorialStep: "Schritt",
    dayWord: "Tag",
    tutorialS1: "Lege dein erstes Ziel an.",
    tutorialS2: "Hake heute eine Aufgabe ab.",
    tutorialDone: "Super! Alles ist freigeschaltet.",
    unlockWeekTitle: "Neu: Wochenplan",
    unlockWeekText: "Schau dir jetzt den Wochenplan an. Er befindet sich im Bereich Ziele ganz unten.",
    unlockQuickTitle: "Neu: Einmalige Aufgaben",
    unlockQuickText: "Einmalige Aufgaben sind jetzt aktiv.",
    unlockSideTitle: "Neu: Nebenaufgaben",
    unlockSideText: "Nebenaufgaben sind jetzt verfügbar. Dafür musst du zuerst alle Hauptaufgaben erledigen.",
    onboardingTitle: "Onboarding aktiv",
    onboardingText: "Bleib bei kleinen, täglichen Schritten.",
    onboardingTextEarly: "Tag 1-3: Starte ruhig mit nur einem klaren Schritt.",
    onboardingTextWeekPlan: "Schau dir jetzt den Wochenplan an. Er befindet sich im Bereich Ziele ganz unten.",
    onboardingTextMid: "Tag 4-8: Stabilisiere deinen Rhythmus und bleib konstant.",
    onboardingTextLate: "Tag 9-12: Wenn du alle Aufgaben erledigst, kannst du Extra-Aufgaben machen.",
    record: "Rekord",
    difficultyMorning: "🌅 Morgens",
    difficultyNoon: "☀️ Mittags",
    difficultyEvening: "🌙 Abends",
    motivation: [
      "Klein, ruhig, konstant.",
      "Ein Schritt zählt.",
      "Heute reicht ein kleines Ziel.",
      "Langsam ist okay.",
      "Du bleibst dran.",
    ],
  },
  en: {
    appTitle: "OneStep – One small step each day",
    appDescription: "OneStep is a minimalist web app for small daily tasks.",
    chooseLanguage: "Choose language",
    chooseLanguageText: "Please choose a language.",
    languageSaved: "Language saved",
    tagline: "One small step each day beats a perfect plan.",
    todayCountWord: "tasks",
    quickTaskPlaceholder: "One-time task",
    goalPlaceholder: "e.g. read 15 minutes",
    planTaskPlaceholder: "e.g. 5 km run / swim",
    timePickerTitle: "Choose time",
    timePickerHour: "Hour",
    timePickerMinute: "Minute",
    timePickerApply: "Apply",
    timePrefix: "Time",
    btnAdd: "Add",
    btnTomorrow: "For tomorrow",
    btnSideQuestAdd: "Add side quest",
    sideQuestSelectLabel: "Select side quest",
    btnRandom: "Random",
    emptyToday: "No tasks yet – add one goal.",
    emptyGoals: "No goals yet – start small.",
    sideQuestHead: "Side Quest",
    tomorrowHead: "Tomorrow",
    badgeOneTime: "One-time",
    badgeTomorrow: "Tomorrow",
    maxSideQuest: "Max 3 side quests reached",
    noGoalsAvailable: "No more goals available",
    unlockIntro: "3 days passed – add one more task or pick random.",
    unlockIntroDaily: "Fast onboarding: one more task is unlocked today.",
    resetConfirm: "Reset all app data?",
    toastGoalAdded: "Goal added",
    toastGoalTimeUpdated: "Time updated",
    toastTaskAdded: "Daily task added",
    toastTodayAdded: "Task added for today",
    toastTomorrowAdded: "Task planned for tomorrow",
    toastSideAdded: "Side quest added",
    toastSideRemoved: "Side quest removed",
    toastReset: "App reset",
    toastOffset: "Day offset set",
    toastProOn: "Pro mode on",
    toastProOff: "Pro mode off",
    toastWeightSaved: "Weight saved",
    toastWeightInvalid: "Please enter a valid weight between 20 and 400",
    planNeed: "Please set at least 4 days",
    planWeek: "Week planned",
    planRestDayInfo: "Days left empty are treated as rest days.",
    restDayPrefix: "Rest Day",
    tutorialStart: "Start",
    tutorialStep: "Step",
    dayWord: "Day",
    tutorialS1: "Create your first goal.",
    tutorialS2: "Complete one task today.",
    tutorialDone: "Great! All sections unlocked.",
    unlockWeekTitle: "New: Weekly plan",
    unlockWeekText: "Check the weekly plan now. You can find it at the bottom of the Goals section.",
    unlockQuickTitle: "New: One-time tasks",
    unlockQuickText: "One-time tasks are now unlocked.",
    unlockSideTitle: "New: Side Quest",
    unlockSideText: "Side quests are now available. To use them, complete all main tasks first.",
    onboardingTitle: "Onboarding active",
    onboardingText: "Keep it small and daily.",
    onboardingTextEarly: "Day 1-3: Start calm with one clear step.",
    onboardingTextWeekPlan: "Check the weekly plan now. You can find it at the bottom of the Goals section.",
    onboardingTextMid: "Day 4-8: Stabilize your rhythm and stay consistent.",
    onboardingTextLate: "Day 9-12: If you finish all tasks, you can do extra tasks.",
    record: "Record",
    difficultyMorning: "🌅 Morning",
    difficultyNoon: "☀️ Noon",
    difficultyEvening: "🌙 Evening",
    motivation: ["Small steps win.", "One task matters.", "Keep it simple.", "Slow is fine.", "Stay consistent."],
  },
  ru: {
    appTitle: "OneStep — маленький шаг каждый день",
    appDescription: "OneStep — минималистичное приложение для маленьких ежедневных задач.",
    chooseLanguage: "Выберите язык",
    chooseLanguageText: "Пожалуйста, выберите язык.",
    languageSaved: "Язык сохранён",
    tagline: "Маленький шаг каждый день лучше идеального плана.",
    todayCountWord: "задач",
    quickTaskPlaceholder: "Разовая задача",
    goalPlaceholder: "например: чтение 15 минут",
    planTaskPlaceholder: "например: бег 5 км / плавание",
    timePickerTitle: "Выберите время",
    timePickerHour: "Час",
    timePickerMinute: "Минута",
    timePickerApply: "Применить",
    timePrefix: "Время",
    btnAdd: "Добавить",
    btnTomorrow: "На завтра",
    btnSideQuestAdd: "Добавить побочную задачу",
    sideQuestSelectLabel: "Выбрать побочную задачу",
    btnRandom: "Случайно",
    emptyToday: "Пока нет задач — добавьте цель.",
    emptyGoals: "Пока нет целей — начните с малого.",
    sideQuestHead: "Побочные задачи",
    tomorrowHead: "Завтра",
    badgeOneTime: "Разово",
    badgeTomorrow: "Завтра",
    maxSideQuest: "Достигнут лимит: 3 побочные задачи",
    noGoalsAvailable: "Больше целей нет",
    unlockIntro: "Прошло 3 дня — добавьте задачу или выберите случайно.",
    unlockIntroDaily: "Быстрый онбординг: сегодня открыта еще одна задача.",
    resetConfirm: "Сбросить все данные?",
    toastGoalAdded: "Цель добавлена",
    toastGoalTimeUpdated: "Время обновлено",
    toastTaskAdded: "Задача дня добавлена",
    toastTodayAdded: "Задача на сегодня добавлена",
    toastTomorrowAdded: "Задача на завтра запланирована",
    toastSideAdded: "Побочная задача добавлена",
    toastSideRemoved: "Побочная задача удалена",
    toastReset: "Приложение сброшено",
    toastOffset: "Смещение дня установлено",
    toastProOn: "Pro режим включён",
    toastProOff: "Pro режим выключен",
    toastWeightSaved: "Вес сохранён",
    toastWeightInvalid: "Укажи корректный вес от 20 до 400",
    planNeed: "Укажите минимум 4 дня",
    planWeek: "Неделя запланирована",
    planRestDayInfo: "Незаполненные дни считаются днями отдыха.",
    restDayPrefix: "День отдыха",
    tutorialStart: "Старт",
    tutorialStep: "Шаг",
    dayWord: "День",
    tutorialS1: "Создайте первую цель.",
    tutorialS2: "Отметьте одну задачу сегодня.",
    tutorialDone: "Отлично! Всё разблокировано.",
    unlockWeekTitle: "Новое: план недели",
    unlockWeekText: "Проверь план недели. Он находится внизу раздела «Цели».",
    unlockQuickTitle: "Новое: разовые задачи",
    unlockQuickText: "Разовые задачи теперь доступны.",
    unlockSideTitle: "Новое: побочные задачи",
    unlockSideText: "Побочные задачи теперь доступны. Сначала выполни все основные задачи.",
    onboardingTitle: "Онбординг активен",
    onboardingText: "Маленькие шаги каждый день.",
    onboardingTextEarly: "День 1-3: начни спокойно с одного шага.",
    onboardingTextWeekPlan: "Проверь план недели. Он находится внизу раздела «Цели».",
    onboardingTextMid: "День 4-8: закрепи ритм и держи стабильность.",
    onboardingTextLate: "День 9-12: если выполнишь все задачи, сможешь делать дополнительные задачи.",
    record: "Рекорд",
    difficultyMorning: "🌅 Утром",
    difficultyNoon: "☀️ Днём",
    difficultyEvening: "🌙 Вечером",
    motivation: ["Маленькие шаги работают.", "Одна задача важна.", "Просто и стабильно.", "Медленно — нормально.", "Держи ритм."],
  },
  es: {
    appTitle: "OneStep – un pequeño paso cada día",
    appDescription: "OneStep es una app minimalista para pequeñas tareas diarias.",
    chooseLanguage: "Elige idioma",
    chooseLanguageText: "Por favor, elige un idioma.",
    languageSaved: "Idioma guardado",
    tagline: "Un pequeño paso al día vale más que un plan perfecto.",
    todayCountWord: "tareas",
    quickTaskPlaceholder: "Tarea puntual",
    goalPlaceholder: "ej.: leer 15 minutos",
    planTaskPlaceholder: "ej.: correr 5 km / nadar",
    timePickerTitle: "Elegir hora",
    timePickerHour: "Hora",
    timePickerMinute: "Minuto",
    timePickerApply: "Aplicar",
    timePrefix: "Hora",
    btnAdd: "Añadir",
    btnTomorrow: "Para mañana",
    btnSideQuestAdd: "Añadir tarea secundaria",
    sideQuestSelectLabel: "Seleccionar tarea secundaria",
    btnRandom: "Aleatorio",
    emptyToday: "Aún no hay tareas: añade una meta.",
    emptyGoals: "Aún no hay metas: empieza pequeño.",
    sideQuestHead: "Tareas secundarias",
    tomorrowHead: "Mañana",
    badgeOneTime: "Puntual",
    badgeTomorrow: "Mañana",
    maxSideQuest: "Máximo 3 tareas secundarias alcanzado",
    noGoalsAvailable: "No hay más metas",
    unlockIntro: "Pasaron 3 días: añade una tarea o elige al azar.",
    unlockIntroDaily: "Onboarding rápido: hoy se desbloqueó una tarea más.",
    resetConfirm: "¿Restablecer todos los datos?",
    toastGoalAdded: "Meta añadida",
    toastGoalTimeUpdated: "Hora actualizada",
    toastTaskAdded: "Tarea diaria añadida",
    toastTodayAdded: "Tarea añadida para hoy",
    toastTomorrowAdded: "Tarea planificada para mañana",
    toastSideAdded: "Tarea secundaria añadida",
    toastSideRemoved: "Tarea secundaria eliminada",
    toastReset: "App reiniciada",
    toastOffset: "Desfase de día aplicado",
    toastProOn: "Modo Pro activado",
    toastProOff: "Modo Pro desactivado",
    toastWeightSaved: "Peso guardado",
    toastWeightInvalid: "Introduce un peso válido entre 20 y 400",
    planNeed: "Añade al menos 4 días",
    planWeek: "Semana planificada",
    planRestDayInfo: "Los días sin completar se consideran días de descanso.",
    restDayPrefix: "Día de descanso",
    tutorialStart: "Inicio",
    tutorialStep: "Paso",
    dayWord: "Día",
    tutorialS1: "Crea tu primera meta.",
    tutorialS2: "Marca una tarea hoy.",
    tutorialDone: "¡Perfecto! Todo desbloqueado.",
    unlockWeekTitle: "Nuevo: plan semanal",
    unlockWeekText: "Revisa ahora el plan semanal. Está al final de la sección Metas.",
    unlockQuickTitle: "Nuevo: tareas puntuales",
    unlockQuickText: "Las tareas puntuales ya están activas.",
    unlockSideTitle: "Nuevo: tareas secundarias",
    unlockSideText: "Las tareas secundarias ya están disponibles. Para usarlas, completa primero todas las tareas principales.",
    onboardingTitle: "Onboarding activo",
    onboardingText: "Pequeños pasos cada día.",
    onboardingTextEarly: "Día 1-3: empieza con calma con un paso claro.",
    onboardingTextWeekPlan: "Revisa ahora el plan semanal. Está al final de la sección Metas.",
    onboardingTextMid: "Día 4-8: estabiliza tu ritmo y sé constante.",
    onboardingTextLate: "Día 9-12: si completas todas las tareas, podrás hacer tareas extra.",
    record: "Récord",
    difficultyMorning: "🌅 Mañana",
    difficultyNoon: "☀️ Mediodía",
    difficultyEvening: "🌙 Noche",
    motivation: ["Pequeños pasos ganan.", "Una tarea cuenta.", "Sigue simple.", "Lento está bien.", "Sé constante."],
  },
  fr: {
    appTitle: "OneStep – un petit pas chaque jour",
    appDescription: "OneStep est une app minimaliste pour de petites tâches quotidiennes.",
    chooseLanguage: "Choisir la langue",
    chooseLanguageText: "Merci de choisir une langue.",
    languageSaved: "Langue enregistrée",
    tagline: "Un petit pas par jour vaut mieux qu'un plan parfait.",
    todayCountWord: "tâches",
    quickTaskPlaceholder: "Tâche ponctuelle",
    goalPlaceholder: "ex. : lire 15 minutes",
    planTaskPlaceholder: "ex. : course 5 km / natation",
    timePickerTitle: "Choisir l'heure",
    timePickerHour: "Heure",
    timePickerMinute: "Minute",
    timePickerApply: "Appliquer",
    timePrefix: "Heure",
    btnAdd: "Ajouter",
    btnTomorrow: "Pour demain",
    btnSideQuestAdd: "Ajouter une quête secondaire",
    sideQuestSelectLabel: "Choisir une quête secondaire",
    btnRandom: "Aléatoire",
    emptyToday: "Pas encore de tâches : ajoute un objectif.",
    emptyGoals: "Pas encore d'objectifs : commence petit.",
    sideQuestHead: "Quêtes secondaires",
    tomorrowHead: "Demain",
    badgeOneTime: "Ponctuel",
    badgeTomorrow: "Demain",
    maxSideQuest: "Maximum 3 quêtes secondaires atteint",
    noGoalsAvailable: "Plus d'objectifs disponibles",
    unlockIntro: "3 jours passés : ajoute une tâche ou choisis au hasard.",
    unlockIntroDaily: "Onboarding rapide : une tâche de plus est débloquée aujourd'hui.",
    resetConfirm: "Réinitialiser toutes les données ?",
    toastGoalAdded: "Objectif ajouté",
    toastGoalTimeUpdated: "Heure mise à jour",
    toastTaskAdded: "Tâche du jour ajoutée",
    toastTodayAdded: "Tâche ajoutée pour aujourd'hui",
    toastTomorrowAdded: "Tâche planifiée pour demain",
    toastSideAdded: "Quête secondaire ajoutée",
    toastSideRemoved: "Quête secondaire retirée",
    toastReset: "App réinitialisée",
    toastOffset: "Décalage de jour défini",
    toastProOn: "Mode Pro activé",
    toastProOff: "Mode Pro désactivé",
    toastWeightSaved: "Poids enregistré",
    toastWeightInvalid: "Entre un poids valide entre 20 et 400",
    planNeed: "Ajoute au moins 4 jours",
    planWeek: "Semaine planifiée",
    planRestDayInfo: "Les jours non remplis sont considérés comme jours de repos.",
    restDayPrefix: "Jour de repos",
    tutorialStart: "Début",
    tutorialStep: "Étape",
    dayWord: "Jour",
    tutorialS1: "Crée ton premier objectif.",
    tutorialS2: "Coche une tâche aujourd'hui.",
    tutorialDone: "Super ! Tout est débloqué.",
    unlockWeekTitle: "Nouveau : plan hebdo",
    unlockWeekText: "Regarde maintenant le plan hebdo. Il se trouve tout en bas de la section Objectifs.",
    unlockQuickTitle: "Nouveau : tâches ponctuelles",
    unlockQuickText: "Les tâches ponctuelles sont actives.",
    unlockSideTitle: "Nouveau : quêtes secondaires",
    unlockSideText: "Les quêtes secondaires sont maintenant disponibles. Pour les utiliser, termine d'abord toutes les tâches principales.",
    onboardingTitle: "Onboarding actif",
    onboardingText: "Petits pas chaque jour.",
    onboardingTextEarly: "Jour 1-3 : commence calmement avec un seul pas clair.",
    onboardingTextWeekPlan: "Regarde maintenant le plan hebdo. Il se trouve tout en bas de la section Objectifs.",
    onboardingTextMid: "Jour 4-8 : stabilise ton rythme et reste régulier.",
    onboardingTextLate: "Jour 9-12 : si tu termines toutes les tâches, tu peux faire des tâches extra.",
    record: "Record",
    difficultyMorning: "🌅 Matin",
    difficultyNoon: "☀️ Midi",
    difficultyEvening: "🌙 Soir",
    motivation: ["Les petits pas gagnent.", "Une tâche compte.", "Reste simple.", "Lent, c'est bien.", "Sois régulier."],
  },
};

I18N.de.weekdays = {
  mon: "Montag",
  tue: "Dienstag",
  wed: "Mittwoch",
  thu: "Donnerstag",
  fri: "Freitag",
  sat: "Samstag",
  sun: "Sonntag",
};
I18N.en.weekdays = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};
I18N.ru.weekdays = {
  mon: "Понедельник",
  tue: "Вторник",
  wed: "Среда",
  thu: "Четверг",
  fri: "Пятница",
  sat: "Суббота",
  sun: "Воскресенье",
};
I18N.es.weekdays = {
  mon: "Lunes",
  tue: "Martes",
  wed: "Miércoles",
  thu: "Jueves",
  fri: "Viernes",
  sat: "Sábado",
  sun: "Domingo",
};
I18N.fr.weekdays = {
  mon: "Lundi",
  tue: "Mardi",
  wed: "Mercredi",
  thu: "Jeudi",
  fri: "Vendredi",
  sat: "Samedi",
  sun: "Dimanche",
};

I18N.de.templates = [
  { title: "Fitness & Bewegung", items: ["10.000 Schritte", "5 km Lauf", "Krafttraining 20 Min", "Mobility 10 Min", "2 L Wasser täglich", "Treppen statt Aufzug", "Dehnen 8 Min", "Radfahren 30 Min", "Schwimmen 30 Min", "Spaziergang 20 Min"] },
  { title: "Ausdauer & Cardio", items: ["Intervalltraining 15 Min", "Zügiger Walk 30 Min", "Rudern 20 Min", "Treppenläufe 10 Min", "Seilspringen 5 Min", "2 L Wasser täglich", "Ergometer 20 Min", "Joggen 20 Min", "Atemtraining 5 Min", "Cooldown 5 Min"] },
  { title: "Ernährung", items: ["Proteinreiche Mahlzeit", "Gemüse zu jeder Mahlzeit", "Zuckerfrei heute", "2 L Wasser täglich", "Intervallfasten 14/10", "Kein Softdrink", "Gesundes Frühstück", "Küchen-Reset 10 Min", "Supplements morgens", "Spätessen vermeiden"] },
  { title: "Schlaf & Erholung", items: ["22:30 ins Bett", "Abendroutine 15 Min", "Bildschirmfrei 30 Min", "Nickerchen 20 Min", "Tagebuch 5 Min", "Stretching 10 Min", "Koffein nur bis 14 Uhr", "Schlafraum lüften", "Wasser neben Bett", "Atemübung 5 Min"] },
  { title: "Lernen", items: ["20 Min Lesen", "1 Kapitel Kurs", "Vokabeln 15 Min", "Notizen ordnen", "1 Übungsaufgabe", "Wiederholung 10 Min", "Lernziel definieren", "Karteikarten 10 Min", "Podcast 15 Min", "Zusammenfassung schreiben"] },
  { title: "Fokus & Produktivität", items: ["1 Deep-Work-Block", "Inbox auf Null", "Top-3 Aufgaben", "Meeting-Notizen", "Ablenkungen aus", "5-Minuten Planung", "1 schwierige Aufgabe", "Dateien sortieren", "Arbeitsplatz reset", "Pomodoro x2"] },
  { title: "Mindset", items: ["Dankbarkeit 3 Punkte", "Kurze Meditation", "Affirmation schreiben", "1 Erkenntnis notieren", "Negatives reframen", "Zielvisualisierung", "Mini-Reflexion", "Atemübung 4-7-8", "Heute stolz sein", "Abendlicher Rückblick"] },
  { title: "Haushalt", items: ["10 Min Aufräumen", "Wäsche starten", "Bad kurz reinigen", "Geschirr sofort", "Müll rausbringen", "Küche wischen", "Bett machen", "Oberflächen abwischen", "Schreibtisch clean", "Einkaufsliste"] },
  { title: "Soziales", items: ["Nachricht an Freund", "Anruf Familie", "Danke sagen", "Treffen planen", "Kurzes Check-in", "Kompliment geben", "Hilfsangebot", "Antworten auf Mails", "Geburtstag merken", "Zeit bewusst teilen"] },
  { title: "Selbstentwicklung", items: ["Neue Gewohnheit testen", "Skill 20 Min üben", "1 kleiner Mut-Schritt", "Feedback einholen", "Lernziel definieren", "Plan für morgen", "Eigenes Projekt 30 Min", "Ziel reviewen", "Fortschritt tracken", "Mini-Challenge"] },
];
I18N.en.templates = [
  { title: "Fitness & Movement", items: ["10,000 steps", "5 km run", "Strength training 20 min", "Mobility 10 min", "2 L water daily", "Take stairs", "Stretch 8 min", "Cycling 30 min", "Swim 30 min", "Walk 20 min"] },
  { title: "Endurance & Cardio", items: ["Intervals 15 min", "Brisk walk 30 min", "Rowing 20 min", "Stair runs 10 min", "Jump rope 5 min", "2 L water daily", "Bike trainer 20 min", "Jog 20 min", "Breathing 5 min", "Cooldown 5 min"] },
  { title: "Nutrition", items: ["Protein-rich meal", "Veggies every meal", "No sugar today", "2 L water daily", "Intermittent fasting 14/10", "No soda", "Healthy breakfast", "Kitchen reset 10 min", "Morning supplements", "No late eating"] },
  { title: "Sleep & Recovery", items: ["Bed at 10:30 PM", "Evening routine 15 min", "No screens 30 min", "Nap 20 min", "Journal 5 min", "Stretch 10 min", "Caffeine only until 2 PM", "Air out bedroom", "Water by bed", "Breathing 5 min"] },
  { title: "Learning", items: ["Read 20 min", "1 course chapter", "Vocabulary 15 min", "Organize notes", "1 practice task", "Review 10 min", "Define learning goal", "Flashcards 10 min", "Podcast 15 min", "Write summary"] },
  { title: "Focus & Productivity", items: ["1 deep work block", "Inbox zero", "Top 3 tasks", "Meeting notes", "Turn off distractions", "5-minute planning", "1 hard task", "Sort files", "Desk reset", "Pomodoro x2"] },
  { title: "Mindset", items: ["3 gratitude points", "Short meditation", "Write affirmation", "Note 1 insight", "Reframe negative thought", "Visualize goal", "Mini reflection", "Breathing 4-7-8", "Be proud today", "Evening review"] },
  { title: "Home", items: ["Tidy 10 min", "Start laundry", "Quick bathroom clean", "Do dishes now", "Take out trash", "Wipe kitchen", "Make bed", "Wipe surfaces", "Clean desk", "Shopping list"] },
  { title: "Social", items: ["Message a friend", "Call family", "Say thank you", "Plan meetup", "Quick check-in", "Give a compliment", "Offer help", "Reply to emails", "Remember birthdays", "Share time mindfully"] },
  { title: "Self Development", items: ["Test new habit", "Practice skill 20 min", "1 brave small step", "Ask for feedback", "Define learning goal", "Plan for tomorrow", "Own project 30 min", "Review goals", "Track progress", "Mini challenge"] },
];
I18N.ru.templates = [
  { title: "Фитнес и движение", items: ["10 000 шагов", "Бег 5 км", "Силовая 20 мин", "Мобилити 10 мин", "2 л воды в день", "Лестница вместо лифта", "Растяжка 8 мин", "Велосипед 30 мин", "Плавание 30 мин", "Прогулка 20 мин"] },
  { title: "Выносливость и кардио", items: ["Интервалы 15 мин", "Быстрая ходьба 30 мин", "Гребля 20 мин", "Лестничные забеги 10 мин", "Скакалка 5 мин", "2 л воды в день", "Велотренажер 20 мин", "Джоггинг 20 мин", "Дыхание 5 мин", "Заминка 5 мин"] },
  { title: "Питание", items: ["Белковый прием пищи", "Овощи в каждый прием", "Без сахара сегодня", "2 л воды в день", "Интервальное голодание 14/10", "Без газировки", "Полезный завтрак", "Кухня: ресет 10 мин", "Утренние добавки", "Без позднего ужина"] },
  { title: "Сон и восстановление", items: ["Лечь в 22:30", "Вечерний ритуал 15 мин", "Без экрана 30 мин", "Сон 20 мин", "Дневник 5 мин", "Растяжка 10 мин", "Кофеин до 14:00", "Проветрить спальню", "Вода у кровати", "Дыхание 5 мин"] },
  { title: "Обучение", items: ["Чтение 20 мин", "1 глава курса", "Слова 15 мин", "Разобрать заметки", "1 практическая задача", "Повторение 10 мин", "Определить учебную цель", "Карточки 10 мин", "Подкаст 15 мин", "Написать кратко"] },
  { title: "Фокус и продуктивность", items: ["1 блок глубокой работы", "Inbox zero", "Топ-3 задачи", "Заметки по встречам", "Отключить отвлечения", "План 5 минут", "1 сложная задача", "Разобрать файлы", "Ресет рабочего места", "Pomodoro x2"] },
  { title: "Майндсет", items: ["3 пункта благодарности", "Короткая медитация", "Записать аффирмацию", "1 инсайт дня", "Переосмыслить негатив", "Визуализация цели", "Мини-рефлексия", "Дыхание 4-7-8", "Похвалить себя", "Вечерний итог"] },
  { title: "Дом", items: ["Уборка 10 мин", "Запустить стирку", "Быстро убрать ванную", "Помыть посуду сразу", "Вынести мусор", "Протереть кухню", "Заправить кровать", "Протереть поверхности", "Чистый стол", "Список покупок"] },
  { title: "Социальное", items: ["Написать другу", "Позвонить семье", "Сказать спасибо", "Запланировать встречу", "Короткий check-in", "Сделать комплимент", "Предложить помощь", "Ответить на письма", "Помнить дни рождения", "Провести время осознанно"] },
  { title: "Саморазвитие", items: ["Тест новой привычки", "Практика навыка 20 мин", "1 маленький смелый шаг", "Попросить обратную связь", "Определить цель обучения", "План на завтра", "Свой проект 30 мин", "Пересмотреть цели", "Отслеживать прогресс", "Мини-челлендж"] },
];
I18N.es.templates = [
  { title: "Fitness y movimiento", items: ["10.000 pasos", "Correr 5 km", "Fuerza 20 min", "Movilidad 10 min", "2 L de agua al día", "Escaleras en vez de ascensor", "Estirar 8 min", "Bici 30 min", "Nadar 30 min", "Caminar 20 min"] },
  { title: "Resistencia y cardio", items: ["Intervalos 15 min", "Caminata rápida 30 min", "Remo 20 min", "Escaleras 10 min", "Comba 5 min", "2 L de agua al día", "Bici estática 20 min", "Trote 20 min", "Respiración 5 min", "Vuelta a la calma 5 min"] },
  { title: "Nutrición", items: ["Comida rica en proteína", "Verdura en cada comida", "Sin azúcar hoy", "2 L de agua al día", "Ayuno 14/10", "Sin refrescos", "Desayuno saludable", "Reset de cocina 10 min", "Suplementos por la mañana", "Evitar cena tarde"] },
  { title: "Sueño y recuperación", items: ["Dormir 22:30", "Rutina nocturna 15 min", "Sin pantallas 30 min", "Siesta 20 min", "Diario 5 min", "Estirar 10 min", "Cafeína solo hasta 14:00", "Ventilar habitación", "Agua junto a la cama", "Respiración 5 min"] },
  { title: "Aprendizaje", items: ["Leer 20 min", "1 capítulo del curso", "Vocabulario 15 min", "Ordenar apuntes", "1 ejercicio", "Repaso 10 min", "Definir objetivo de estudio", "Tarjetas 10 min", "Podcast 15 min", "Escribir resumen"] },
  { title: "Foco y productividad", items: ["1 bloque de trabajo profundo", "Inbox cero", "Top 3 tareas", "Notas de reuniones", "Quitar distracciones", "Plan de 5 minutos", "1 tarea difícil", "Ordenar archivos", "Reset del escritorio", "Pomodoro x2"] },
  { title: "Mentalidad", items: ["3 agradecimientos", "Meditación corta", "Escribir afirmación", "Anotar 1 aprendizaje", "Reencuadrar lo negativo", "Visualizar objetivo", "Mini reflexión", "Respiración 4-7-8", "Sentirte orgulloso hoy", "Revisión nocturna"] },
  { title: "Hogar", items: ["Ordenar 10 min", "Poner lavadora", "Limpieza rápida del baño", "Fregar platos al momento", "Sacar basura", "Limpiar cocina", "Hacer la cama", "Limpiar superficies", "Escritorio limpio", "Lista de compra"] },
  { title: "Social", items: ["Mensaje a un amigo", "Llamar a la familia", "Dar las gracias", "Planear encuentro", "Check-in rápido", "Dar un cumplido", "Ofrecer ayuda", "Responder correos", "Recordar cumpleaños", "Compartir tiempo consciente"] },
  { title: "Desarrollo personal", items: ["Probar nuevo hábito", "Practicar habilidad 20 min", "1 pequeño paso valiente", "Pedir feedback", "Definir objetivo de aprendizaje", "Plan para mañana", "Proyecto propio 30 min", "Revisar metas", "Registrar progreso", "Mini reto"] },
];
I18N.fr.templates = [
  { title: "Fitness et mouvement", items: ["10 000 pas", "Course 5 km", "Renforcement 20 min", "Mobilité 10 min", "2 L d'eau par jour", "Escaliers au lieu de l'ascenseur", "Étirements 8 min", "Vélo 30 min", "Natation 30 min", "Marche 20 min"] },
  { title: "Endurance et cardio", items: ["Intervalles 15 min", "Marche rapide 30 min", "Rameur 20 min", "Escaliers 10 min", "Corde à sauter 5 min", "2 L d'eau par jour", "Vélo d'appartement 20 min", "Jogging 20 min", "Respiration 5 min", "Retour au calme 5 min"] },
  { title: "Nutrition", items: ["Repas riche en protéines", "Légumes à chaque repas", "Sans sucre aujourd'hui", "2 L d'eau par jour", "Jeûne 14/10", "Pas de soda", "Petit-déjeuner sain", "Reset cuisine 10 min", "Suppléments le matin", "Éviter le dîner tardif"] },
  { title: "Sommeil et récupération", items: ["Au lit à 22h30", "Routine du soir 15 min", "Sans écran 30 min", "Sieste 20 min", "Journal 5 min", "Étirements 10 min", "Caféine jusqu'à 14h", "Aérer la chambre", "Eau près du lit", "Respiration 5 min"] },
  { title: "Apprentissage", items: ["Lire 20 min", "1 chapitre de cours", "Vocabulaire 15 min", "Ranger les notes", "1 exercice", "Révision 10 min", "Définir l'objectif d'étude", "Flashcards 10 min", "Podcast 15 min", "Écrire un résumé"] },
  { title: "Focus et productivité", items: ["1 bloc de deep work", "Inbox zéro", "Top 3 tâches", "Notes de réunion", "Couper les distractions", "Plan 5 minutes", "1 tâche difficile", "Trier les fichiers", "Reset du bureau", "Pomodoro x2"] },
  { title: "Mindset", items: ["3 points de gratitude", "Méditation courte", "Écrire une affirmation", "Noter 1 idée clé", "Reformuler le négatif", "Visualiser l'objectif", "Mini réflexion", "Respiration 4-7-8", "Être fier aujourd'hui", "Bilan du soir"] },
  { title: "Maison", items: ["Ranger 10 min", "Lancer une lessive", "Nettoyage rapide salle de bain", "Faire la vaisselle tout de suite", "Sortir les poubelles", "Nettoyer la cuisine", "Faire le lit", "Essuyer les surfaces", "Bureau propre", "Liste de courses"] },
  { title: "Social", items: ["Message à un ami", "Appeler la famille", "Dire merci", "Planifier une rencontre", "Petit check-in", "Faire un compliment", "Proposer de l'aide", "Répondre aux mails", "Se souvenir des anniversaires", "Partager du temps consciemment"] },
  { title: "Développement personnel", items: ["Tester une nouvelle habitude", "Pratiquer un skill 20 min", "1 petit pas courageux", "Demander un feedback", "Définir l'objectif d'apprentissage", "Plan pour demain", "Projet perso 30 min", "Revoir les objectifs", "Suivre les progrès", "Mini challenge"] },
];

const langPack = () => I18N[currentLanguage] || I18N.de;
const t = (key) => langPack()[key] || I18N.de[key] || key;
const st = (key) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  return s?.[key] ?? STATIC_TEXT.de?.[key] ?? key;
};

const STATIC_TEXT = {
  de: {
    welcomeTitle: "Willkommen bei OneStep",
    welcomeP1: "Kleine Schritte, jeden Tag.",
    welcomeP2: "Starte mit einem Ziel.",
    todayTitle: "Heute",
    trackerChecklist: "Checkliste",
    trackerWeight: "Gewicht",
    trackerSleep: "Schlaf",
    trackerVocab: "Vokabeln",
    vocabTrackerTitle: "Vokabeln (Französisch)",
    vocabTrackerHint: "Schnell lernen: Thema wählen, Modus starten, 10 Karten abschließen.",
    vocabKpiDaily: "Heute",
    vocabKpiStreak: "Streak",
    vocabKpiTheme: "Thema",
    vocabSessionIdle: "Noch keine Session gestartet.",
    vocabSessionReady: "Bereit: Starte dein Training.",
    vocabSessionActive: "Session läuft",
    vocabThemeLabel: "Thema",
    vocabModeLabel: "Modus",
    vocabModeFlashcard: "Flashcards",
    vocabModeQuicktest: "Quick Test (4 Optionen)",
    vocabModeWrite: "Write it",
    vocabDirectionLabel: "Richtung",
    vocabDirectionFrDe: "Französisch -> Deutsch",
    vocabDirectionDeFr: "Deutsch -> Französisch",
    vocabDirectionQuickLabel: "Richtung",
    vocabWriteEnable: "Write Mode erlauben",
    vocabDailyGoalLabel: "Tagesziel (korrekt)",
    vocabStartBtn: "Start",
    vocabRevealBtn: "Aufdecken",
    vocabCorrectBtn: "Richtig",
    vocabWrongBtn: "Falsch",
    vocabSubmitBtn: "Prüfen",
    vocabNextBtn: "Nächste Karte",
    vocabSaveSettings: "Einstellungen speichern",
    vocabQuestionIdle: "Wähle Thema und Modus, dann starte.",
    vocabWritePlaceholder: "Französisches Wort eingeben",
    vocabSummaryPrefix: "Session",
    vocabSummaryCorrect: "Korrekt",
    vocabSummaryWrong: "Falsch",
    vocabSummaryTime: "Zeit",
    vocabSummaryStreak: "Streak",
    vocabDoneToday: "Heute erledigt",
    vocabNotDoneToday: "Heute offen",
    vocabProgressLabel: "Fortschritt",
    vocabLastTrained: "Zuletzt trainiert",
    vocabLibrarySummary: "Alle Vokabeln lernen",
    vocabLibrarySearchPlaceholder: "Vokabel suchen...",
    vocabLibraryMeta: "Einträge",
    vocabLibraryEmpty: "Keine Vokabeln für diesen Filter",
    vocabNoTheme: "Kein Thema verfügbar",
    vocabSeedLoading: "Vokabeln werden geladen...",
    vocabSeedError: "Vokabel-Daten konnten nicht geladen werden",
    toastVocabSettingsSaved: "Vokabel-Einstellungen gespeichert",
    toastVocabSeedLoaded: "Vokabelpaket geladen",
    toastVocabModeWriteDisabled: "Write Mode ist in den Einstellungen deaktiviert",
    weightTrackerTitle: "Gewichts-Tracker",
    weightTrackerHint: "Trage dein Gewicht einmal täglich ein, um den Verlauf zu sehen.",
    weightTrackerMeta: "Gewichts-Tracker",
    weightKpi7d: "7d Ø",
    weightKpi30d: "30d Ø",
    weightKpiDelta: "Start -> heute",
    weightInputLabel: "Gewicht (kg)",
    weightInputPlaceholder: "z. B. 72.4",
    weightSaveBtn: "Speichern",
    weightDatePrefix: "Heute",
    weightChartTitle: "Gewichtsverlauf",
    weightChartEmpty: "Noch keine Einträge.",
    weightTargetLabel: "Zielgewicht (optional)",
    weightTargetPlaceholder: "z. B. 68.0",
    weightTargetSaveBtn: "Ziel speichern",
    weightTargetEmpty: "Noch kein Zielgewicht.",
    weightTargetMeta: "Noch bis Ziel",
    sleepTrackerTitle: "Schlaf-Tracker",
    sleepTrackerHint: "Abends nur die Schlafenszeit eintragen. Aufstehen kannst du später ergänzen.",
    sleepBedLabel: "Schlafenszeit",
    sleepWakeLabel: "Aufstehzeit (optional)",
    sleepSaveBedBtn: "Schlafenszeit speichern",
    sleepSaveWakeBtn: "Aufstehzeit speichern",
    sleepNowBtn: "Jetzt",
    sleepAvg7Label: "Ø Dauer (7d)",
    sleepConsistencyLabel: "Konsistenz",
    sleepStatusLabel: "Status",
    sleepPendingLabel: "Offene Nacht",
    sleepDurationLabel: "Dauer",
    sleepChartTitle: "Schlafdauer Verlauf",
    sleepChartEmpty: "Noch keine vollständigen Schlafdaten.",
    sleepStatusOpen: "Wake-up offen",
    sleepStatusDone: "vollständig",
    toastWeightTargetSaved: "Zielgewicht gespeichert",
    toastSleepBedSaved: "Schlafenszeit gespeichert",
    toastSleepWakeSaved: "Aufstehzeit gespeichert",
    toastSleepInvalid: "Bitte eine gültige Uhrzeit eingeben",
    updateApplied: "Update installiert. App ist jetzt aktuell.",
    backupStatusNever: "Noch kein Backup exportiert.",
    backupStatusToday: "Backup heute exportiert",
    backupStatusDays: "Letztes Backup vor",
    backupStatusSuffix: "Tagen",
    backupReminder: "Bitte Backup aktualisieren",
    identityRecommendationPrefix: "Heute",
    identityRecommendationHigh: "Tempo halten und einen Side-Quest mitnehmen.",
    identityRecommendationMid: "Fokus auf Hauptaufgaben und einen sauberen Abschluss.",
    identityRecommendationLow: "Nur die wichtigste Aufgabe erledigen und Rhythmus sichern.",
    todaySmartPlanPrefix: "Heute",
    outcomeTitle: "Outcome Qualität",
    goalHitRateLabel: "Goal-Hit-Rate (30d)",
    completionTrendLabel: "Trend",
    completionTrendUp: "steigend",
    completionTrendDown: "fallend",
    completionTrendStable: "stabil",
    retentionLabel: "Retention (D1/D7)",
    introText2A: "OneStep zeigt dir täglich, was jetzt wichtig ist, damit du konstant dranbleibst.",
    introText2B: "Kein Motivations-Hype: Du bekommst klare Schritte, die du wirklich wiederholen kannst.",
    goalsTitle: "Ziele",
    progressTitle: "Fortschritt",
    infoTitle: "Einstellungen",
    calLegend: "Tag komplett erledigt",
    statStreak: "Aktive Tage in Folge",
    statTotal: "Erledigte Aufgaben gesamt",
    statActive: "Aktive Tage (Woche)",
    statPerfect: "Perfekte Tage (Woche)",
    modeToggle: "Pro-Version aktivieren",
    settingsLanguage: "Sprache",
    modeHint: "Testphase: Beide Modi sichtbar.",
    testTitle: "Tagesanzahl simulieren",
    applyBtn: "Anwenden",
    resetBtn: "Reset",
    simPrefix: "Heute",
    footer1: "OneStep · Minimalistische Fortschritts-App",
    footer2: "Lokal gespeichert in deinem Browser",
    navSettings: "Einstellungen",
    navToday: "Heute",
    navGoals: "Ziele",
    navProgress: "Fortschritt",
    calWeekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    calDoneTitle: "erledigt",
    btnEdit: "Bearbeiten",
    btnSave: "Speichern",
    btnRemove: "Entfernen",
    deleteGoalTitle: "Ziel entfernen",
    infoSubtitle: "App-Optionen und Hinweise",
    infoMainSummary: "Info",
    infoMainP1: "Kleine Schritte schlagen Perfektion.",
    infoMainP2: "Konstanz ist wichtiger als Intensität.",
    infoListSummary: "So entsteht deine Tagesliste",
    infoList1: "Ziele sind dein Aufgaben-Pool.",
    infoList2: "Zu Beginn startet ein Ziel als Tagesaufgabe.",
    infoList3: "Alle 3 Tage kannst du eine Aufgabe ergänzen.",
    infoList4: "Erledigte Aufgaben bleiben sichtbar.",
    infoBalanceSummary: "Schwierigkeiten & Balance",
    infoBalance1: "Einfach: kleiner, sicherer Schritt.",
    infoBalance2: "Mittel: stabiler Fortschritt.",
    infoBalance3: "Schwer: gezielte Herausforderung.",
    infoPrivacySummary: "Datenschutz",
    infoPrivacyP1: "Alle Daten bleiben lokal im Browser.",
    settingsVersionTitle: "Version",
    settingsSystemTitle: "System",
    backupTitle: "Backup",
    exportData: "Daten exportieren",
    importData: "Daten importieren",
    toastExportSuccess: "Backup exportiert",
    toastImportSuccess: "Backup importiert",
    toastImportError: "Import fehlgeschlagen",
    dayOffsetLabel: "Tag-Offset",
    weeklyPlanTitle: "Wochenplan",
    weeklyPlanHintMinDays: "Mindestens 4 Tage eintragen",
    planGoalLabel: "Ziel",
    templateSummary: "Vorlagen (10 Kategorien)",
    timePickerTitle: "Uhrzeit auswählen",
    timePickerHour: "Stunde",
    timePickerMinute: "Minute",
    timePickerApply: "Übernehmen",
    timePrefix: "Zeit",
    updateAvailable: "Neue Version verfügbar",
    updateNow: "Jetzt aktualisieren",
    updateRetry: "Erneut prüfen",
    updateNote: "Bugfixes und Verbesserungen sind bereit.",
    checkUpdatesBtn: "Auf Updates prüfen",
    toastUpdateCheck: "Update-Prüfung gestartet",
    toastUpdateCheckError: "Update-Prüfung fehlgeschlagen",
    toastUpdateUnsupported: "Update-Prüfung nicht verfügbar",
    identityScoreTitle: "Identity Score",
    identityScoreMeta: "Konsistenz der letzten 14 Tage",
    tutorialCheck1: "Sprache festlegen",
    tutorialCheck2: "Erstes Ziel erstellen",
    tutorialCheck3: "Erste Aufgabe erledigen",
    tutorialCta1: "Zu Einstellungen",
    tutorialCta2: "Ziel erstellen",
    tutorialCta3: "Zu Heute",
    introStepLabel: "Schritt",
    introTitle1: "Willkommen bei OneStep",
    introText1: "Jeder Tag startet mit einem klaren, machbaren Schritt.",
    introTitle2: "Mehr Klarheit, weniger Chaos",
    introText2: "OneStep zeigt dir täglich, was jetzt wichtig ist, damit du konstant dranbleibst.",
    introTitle3: "Dein Alltag wird leichter",
    introText3: "Schwere Aufgaben werden normaler Tagesablauf, wie Schlafen, Essen und Laufen.",
    introExample1: "Schlafen 23:00",
    introExample2: "10 Minuten laufen",
    introExample3: "Proteinreich essen",
    introGoalLabel: "Jahresvorsatz",
    introGoalPlaceholder: "z. B. fitter und energiegeladener werden",
    introGoalHint: "Optional: Dein Hauptziel fuer dieses Jahr.",
    introNextBtn: "Weiter ->",
    introStartBtn: "Los geht's: erstes Ziel erstellen ->",
    introNextAria: "Nächste Seite",
    introStartAria: "Erstes Ziel erstellen",
    annualGoalTitle: "Jahresvorsatz",
    annualGoalEmpty: "Noch nicht gesetzt",
    annualGoalSince: "Seit",
    annualGoalYearDone: "Erledigt dieses Jahr",
    annualGoalYearActiveDays: "Aktive Tage dieses Jahr",
    dayDetailTitle: "Tagesdetails",
    dayDetailEmpty: "Keine gespeicherten Details fuer diesen Tag.",
    dayDetailDone: "Erledigt",
    dayDetailOpen: "Offen",
    dayDetailUnknown: "Keine Detailhistorie verfuegbar.",
    goalsAnnualLabel: "Jahresvorsatz",
    goalsAnnualPlaceholder: "z. B. fitter und energiegeladener werden",
    goalsAnnualSave: "Jahresvorsatz speichern",
    goalLinkAnnual: "Verknuepfen",
    goalUnlinkAnnual: "Loesen",
    goalLinkedTag: "Jahresvorsatz",
    progressWeekRate: "Wochenquote",
    progressMonthRate: "Monatsquote",
    progressBestDay: "Stärkster Wochentag",
    dragHint: "Ziehen zum Sortieren",
    backupOverwritePrompt: "Backup komplett überschreiben?",
    backupMergePrompt: "Nicht überschreiben. Backup mit aktuellen Daten zusammenführen?",
    legalPrivacy: "Datenschutzseite öffnen",
    legalImprint: "Impressum öffnen",
  },
  en: {
    welcomeTitle: "Welcome to OneStep",
    welcomeP1: "Small steps, every day.",
    welcomeP2: "Start with one goal.",
    todayTitle: "Сегодня",
    trackerChecklist: "Checklist",
    trackerWeight: "Weight",
    trackerSleep: "Sleep",
    weightTrackerTitle: "Weight tracker",
    weightTrackerHint: "Enter your weight once per day to see the trend.",
    weightTrackerMeta: "Weight tracker",
    weightKpi7d: "7d avg",
    weightKpi30d: "30d avg",
    weightKpiDelta: "Start -> today",
    weightInputLabel: "Weight (kg)",
    weightInputPlaceholder: "e.g. 72.4",
    weightSaveBtn: "Save",
    weightDatePrefix: "Today",
    weightChartTitle: "Weight trend",
    weightChartEmpty: "No entries yet.",
    weightTargetLabel: "Target weight (optional)",
    weightTargetPlaceholder: "e.g. 68.0",
    weightTargetSaveBtn: "Save target",
    weightTargetEmpty: "No target weight yet.",
    weightTargetMeta: "Left to target",
    sleepTrackerTitle: "Sleep tracker",
    sleepTrackerHint: "Only log bedtime in the evening. Wake-up can be added later.",
    sleepBedLabel: "Bedtime",
    sleepWakeLabel: "Wake-up time (optional)",
    sleepSaveBedBtn: "Save bedtime",
    sleepSaveWakeBtn: "Save wake-up",
    sleepNowBtn: "Now",
    sleepAvg7Label: "Avg duration (7d)",
    sleepConsistencyLabel: "Consistency",
    sleepStatusLabel: "Status",
    sleepPendingLabel: "Open night",
    sleepDurationLabel: "Duration",
    sleepChartTitle: "Sleep duration trend",
    sleepChartEmpty: "No complete sleep entries yet.",
    sleepStatusOpen: "wake-up open",
    sleepStatusDone: "complete",
    toastWeightTargetSaved: "Target weight saved",
    toastSleepBedSaved: "Bedtime saved",
    toastSleepWakeSaved: "Wake-up saved",
    toastSleepInvalid: "Please enter a valid time",
    updateApplied: "Update installed. App is now current.",
    backupStatusNever: "No backup exported yet.",
    backupStatusToday: "Backup exported today",
    backupStatusDays: "Last backup",
    backupStatusSuffix: "days ago",
    backupReminder: "Please refresh your backup",
    identityRecommendationPrefix: "Today",
    identityRecommendationHigh: "Keep the pace and add one side quest.",
    identityRecommendationMid: "Focus on main tasks and a clean finish.",
    identityRecommendationLow: "Do only your most important task and protect your rhythm.",
    todaySmartPlanPrefix: "Today",
    outcomeTitle: "Outcome quality",
    goalHitRateLabel: "Goal hit rate (30d)",
    completionTrendLabel: "Trend",
    completionTrendUp: "up",
    completionTrendDown: "down",
    completionTrendStable: "stable",
    retentionLabel: "Retention (D1/D7)",
    introText2A: "OneStep shows what matters now, so you can stay consistent.",
    introText2B: "No motivation hype: you get clear steps you can actually repeat.",
    goalsTitle: "Цели",
    progressTitle: "Прогресс",
    infoTitle: "Settings",
    calLegend: "Day fully done",
    statStreak: "Active days in a row",
    statTotal: "Total completed tasks",
    statActive: "Active days (week)",
    statPerfect: "Perfect days (week)",
    modeToggle: "Enable Pro version",
    settingsLanguage: "Language",
    modeHint: "Test phase: both modes visible.",
    testTitle: "Simulate day count",
    applyBtn: "Apply",
    resetBtn: "Reset",
    simPrefix: "Today",
    footer1: "OneStep · Minimal progress app",
    footer2: "Stored locally in your browser",
    navSettings: "Settings",
    navToday: "Today",
    navGoals: "Goals",
    navProgress: "Progress",
    calWeekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    calDoneTitle: "done",
    btnEdit: "Edit",
    btnSave: "Save",
    btnRemove: "Remove",
    deleteGoalTitle: "Remove goal",
    infoSubtitle: "App options and notes",
    infoMainSummary: "Info",
    infoMainP1: "Small steps beat perfection.",
    infoMainP2: "Consistency matters more than intensity.",
    infoListSummary: "How your day list is built",
    infoList1: "Life Goals are your task pool.",
    infoList2: "At start, one goal becomes your daily task.",
    infoList3: "Every 3 days you can add another task.",
    infoList4: "Completed tasks stay visible.",
    infoBalanceSummary: "Difficulty & balance",
    infoBalance1: "Easy: small safe step.",
    infoBalance2: "Medium: steady progress.",
    infoBalance3: "Hard: focused challenge.",
    infoPrivacySummary: "Privacy",
    infoPrivacyP1: "All data stays local in your browser.",
    settingsVersionTitle: "Version",
    settingsSystemTitle: "System",
    backupTitle: "Backup",
    exportData: "Export data",
    importData: "Import data",
    toastExportSuccess: "Backup exported",
    toastImportSuccess: "Backup imported",
    toastImportError: "Import failed",
    dayOffsetLabel: "Day offset",
    weeklyPlanTitle: "Weekly plan",
    weeklyPlanHintMinDays: "Set at least 4 days",
    planGoalLabel: "Goal",
    templateSummary: "Templates (10 categories)",
    timePickerTitle: "Choose time",
    timePickerHour: "Hour",
    timePickerMinute: "Minute",
    timePickerApply: "Apply",
    timePrefix: "Time",
    updateAvailable: "New version available",
    updateNow: "Update now",
    updateRetry: "Check again",
    updateNote: "Bug fixes and improvements are ready.",
    checkUpdatesBtn: "Check for updates",
    toastUpdateCheck: "Update check started",
    toastUpdateCheckError: "Update check failed",
    toastUpdateUnsupported: "Update check unavailable",
    identityScoreTitle: "Identity Score",
    identityScoreMeta: "Consistency over the last 14 days",
    tutorialCheck1: "Set language",
    tutorialCheck2: "Create first goal",
    tutorialCheck3: "Complete first task",
    tutorialCta1: "Open settings",
    tutorialCta2: "Create goal",
    tutorialCta3: "Go to Today",
    introStepLabel: "Step",
    introTitle1: "Welcome to OneStep",
    introText1: "Every day starts with one clear and doable step.",
    introTitle2: "More clarity, less chaos",
    introText2: "OneStep shows what matters now, so you can stay consistent.",
    introTitle3: "Your routine gets easier",
    introText3: "Hard tasks become a normal daily rhythm, like sleeping, eating, and running.",
    introExample1: "Sleep at 23:00",
    introExample2: "10-minute run",
    introExample3: "Protein-rich meal",
    introGoalLabel: "Year goal",
    introGoalPlaceholder: "e.g. become fitter and more energetic",
    introGoalHint: "Optional: Your main goal for this year.",
    introNextBtn: "Next ->",
    introStartBtn: "Let's go: create first goal ->",
    introNextAria: "Next page",
    introStartAria: "Create first goal",
    annualGoalTitle: "Year goal",
    annualGoalEmpty: "Not set yet",
    annualGoalSince: "Since",
    annualGoalYearDone: "Done this year",
    annualGoalYearActiveDays: "Active days this year",
    dayDetailTitle: "Day details",
    dayDetailEmpty: "No saved details for this day.",
    dayDetailDone: "Done",
    dayDetailOpen: "Open",
    dayDetailUnknown: "No detailed history available.",
    goalsAnnualLabel: "Year goal",
    goalsAnnualPlaceholder: "e.g. become fitter and more energetic",
    goalsAnnualSave: "Save year goal",
    goalLinkAnnual: "Link",
    goalUnlinkAnnual: "Unlink",
    goalLinkedTag: "Year goal",
    progressWeekRate: "Week rate",
    progressMonthRate: "Month rate",
    progressBestDay: "Strongest weekday",
    dragHint: "Drag to sort",
    backupOverwritePrompt: "Overwrite all current data with backup?",
    backupMergePrompt: "Do not overwrite. Merge backup with current data?",
    legalPrivacy: "Open privacy page",
    legalImprint: "Open imprint",
  },
  ru: {
    welcomeTitle: "Добро пожаловать в OneStep",
    welcomeP1: "Маленькие шаги каждый день.",
    welcomeP2: "Начни с одной цели.",
    todayTitle: "Hoy",
    trackerChecklist: "Список",
    trackerWeight: "Вес",
    trackerSleep: "Сон",
    weightTrackerTitle: "Трекер веса",
    weightTrackerHint: "Вводи вес один раз в день, чтобы видеть динамику.",
    weightTrackerMeta: "Трекер веса",
    weightKpi7d: "7д ср.",
    weightKpi30d: "30д ср.",
    weightKpiDelta: "Старт -> сегодня",
    weightInputLabel: "Вес (кг)",
    weightInputPlaceholder: "например: 72.4",
    weightSaveBtn: "Сохранить",
    weightDatePrefix: "Сегодня",
    weightChartTitle: "Динамика веса",
    weightChartEmpty: "Пока нет записей.",
    weightTargetLabel: "Целевой вес (опционально)",
    weightTargetPlaceholder: "например: 68.0",
    weightTargetSaveBtn: "Сохранить цель",
    weightTargetEmpty: "Цель по весу не задана.",
    weightTargetMeta: "Осталось до цели",
    sleepTrackerTitle: "Трекер сна",
    sleepTrackerHint: "Вечером укажи только время сна. Подъём можно добавить позже.",
    sleepBedLabel: "Время сна",
    sleepWakeLabel: "Время подъёма (опционально)",
    sleepSaveBedBtn: "Сохранить время сна",
    sleepSaveWakeBtn: "Сохранить подъём",
    sleepNowBtn: "Сейчас",
    sleepAvg7Label: "Ср. длительность (7д)",
    sleepConsistencyLabel: "Стабильность",
    sleepStatusLabel: "Статус",
    sleepPendingLabel: "Открытая ночь",
    sleepDurationLabel: "Длительность",
    sleepChartTitle: "Динамика длительности сна",
    sleepChartEmpty: "Пока нет полных записей сна.",
    sleepStatusOpen: "подъём не указан",
    sleepStatusDone: "полная запись",
    toastWeightTargetSaved: "Целевой вес сохранён",
    toastSleepBedSaved: "Время сна сохранено",
    toastSleepWakeSaved: "Время подъёма сохранено",
    toastSleepInvalid: "Укажи корректное время",
    updateApplied: "Обновление установлено. Приложение актуально.",
    backupStatusNever: "Резервная копия ещё не экспортирована.",
    backupStatusToday: "Резервная копия экспортирована сегодня",
    backupStatusDays: "Последняя копия",
    backupStatusSuffix: "дн. назад",
    backupReminder: "Обнови резервную копию",
    identityRecommendationPrefix: "Сегодня",
    identityRecommendationHigh: "Держи темп и добавь одну побочную задачу.",
    identityRecommendationMid: "Фокус на основных задачах и чистом завершении дня.",
    identityRecommendationLow: "Сделай одну ключевую задачу и сохрани ритм.",
    todaySmartPlanPrefix: "Сегодня",
    outcomeTitle: "Качество результата",
    goalHitRateLabel: "Goal-hit rate (30д)",
    completionTrendLabel: "Тренд",
    completionTrendUp: "рост",
    completionTrendDown: "снижение",
    completionTrendStable: "стабильный",
    retentionLabel: "Retention (D1/D7)",
    introText2A: "OneStep показывает, что важно сейчас, чтобы ты держал стабильный ритм.",
    introText2B: "Без мотивационного шума: только чёткие шаги, которые можно повторять каждый день.",
    goalsTitle: "Metas",
    progressTitle: "Progreso",
    infoTitle: "Настройки",
    calLegend: "День выполнен полностью",
    statStreak: "Дни подряд",
    statTotal: "Всего выполнено задач",
    statActive: "Активные дни (неделя)",
    statPerfect: "Идеальные дни (неделя)",
    modeToggle: "Включить Pro",
    settingsLanguage: "Язык",
    modeHint: "Тест: оба режима доступны.",
    testTitle: "Симуляция дней",
    applyBtn: "Применить",
    resetBtn: "Сброс",
    simPrefix: "Сегодня",
    footer1: "OneStep · Минималистичный прогресс",
    footer2: "Данные хранятся локально",
    navSettings: "Настройки",
    navToday: "Сегодня",
    navGoals: "Цели",
    navProgress: "Прогресс",
    calWeekdays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    calDoneTitle: "выполнено",
    btnEdit: "Изменить",
    btnSave: "Сохранить",
    btnRemove: "Удалить",
    deleteGoalTitle: "Удалить цель",
    infoSubtitle: "Параметры и информация",
    infoMainSummary: "Инфо",
    infoMainP1: "Маленькие шаги лучше идеала.",
    infoMainP2: "Регулярность важнее интенсивности.",
    infoListSummary: "Как формируется список дня",
    infoList1: "Цели — это пул задач.",
    infoList2: "Сначала одна цель становится задачей дня.",
    infoList3: "Каждые 3 дня можно добавить задачу.",
    infoList4: "Выполненные задачи остаются видимыми.",
    infoBalanceSummary: "Сложность и баланс",
    infoBalance1: "Легко: маленький шаг.",
    infoBalance2: "Средне: стабильный прогресс.",
    infoBalance3: "Сложно: целевой вызов.",
    infoPrivacySummary: "Конфиденциальность",
    infoPrivacyP1: "Все данные хранятся локально в браузере.",
    settingsVersionTitle: "Версия",
    settingsSystemTitle: "Система",
    backupTitle: "Резервная копия",
    exportData: "Экспорт данных",
    importData: "Импорт данных",
    toastExportSuccess: "Резервная копия экспортирована",
    toastImportSuccess: "Резервная копия импортирована",
    toastImportError: "Ошибка импорта",
    dayOffsetLabel: "Смещение дня",
    weeklyPlanTitle: "План недели",
    weeklyPlanHintMinDays: "Заполни минимум 4 дня",
    planGoalLabel: "Цель",
    templateSummary: "Шаблоны (10 категорий)",
    timePickerTitle: "Выберите время",
    timePickerHour: "Час",
    timePickerMinute: "Минута",
    timePickerApply: "Применить",
    timePrefix: "Время",
    updateAvailable: "Доступна новая версия",
    updateNow: "Обновить сейчас",
    updateRetry: "Проверить снова",
    updateNote: "Исправления и улучшения готовы.",
    checkUpdatesBtn: "Проверить обновления",
    toastUpdateCheck: "Проверка обновлений запущена",
    toastUpdateCheckError: "Ошибка проверки обновлений",
    toastUpdateUnsupported: "Проверка обновлений недоступна",
    identityScoreTitle: "Identity Score",
    identityScoreMeta: "Стабильность за последние 14 дней",
    tutorialCheck1: "Выбрать язык",
    tutorialCheck2: "Создать первую цель",
    tutorialCheck3: "Выполнить первую задачу",
    tutorialCta1: "Открыть настройки",
    tutorialCta2: "Создать цель",
    tutorialCta3: "Открыть Сегодня",
    introStepLabel: "Шаг",
    introTitle1: "Добро пожаловать в OneStep",
    introText1: "Каждый день начинается с одного ясного и посильного шага.",
    introTitle2: "Больше ясности, меньше хаоса",
    introText2: "OneStep показывает, что важно сейчас, чтобы ты держал стабильный ритм.",
    introTitle3: "Рутина становится легче",
    introText3: "Сложные задачи становятся обычной частью дня, как сон, еда и бег.",
    introExample1: "Сон в 23:00",
    introExample2: "Бег 10 минут",
    introExample3: "Белковый прием пищи",
    introGoalLabel: "Годовая цель",
    introGoalPlaceholder: "например: стать выносливее и энергичнее",
    introGoalHint: "Опционально: твоя главная цель на этот год.",
    introNextBtn: "Дальше ->",
    introStartBtn: "Поехали: создать первую цель ->",
    introNextAria: "Следующая страница",
    introStartAria: "Создать первую цель",
    annualGoalTitle: "Годовая цель",
    annualGoalEmpty: "Пока не задана",
    annualGoalSince: "С",
    annualGoalYearDone: "Сделано в этом году",
    annualGoalYearActiveDays: "Активные дни в этом году",
    dayDetailTitle: "Детали дня",
    dayDetailEmpty: "Нет сохраненных деталей за этот день.",
    dayDetailDone: "Сделано",
    dayDetailOpen: "Открыто",
    dayDetailUnknown: "Подробная история недоступна.",
    goalsAnnualLabel: "Годовая цель",
    goalsAnnualPlaceholder: "например: стать выносливее и энергичнее",
    goalsAnnualSave: "Сохранить годовую цель",
    goalLinkAnnual: "Связать",
    goalUnlinkAnnual: "Отвязать",
    goalLinkedTag: "Годовая цель",
    progressWeekRate: "Процент недели",
    progressMonthRate: "Процент месяца",
    progressBestDay: "Лучший день недели",
    dragHint: "Перетащите для сортировки",
    backupOverwritePrompt: "Полностью перезаписать данные из резервной копии?",
    backupMergePrompt: "Не перезаписывать. Объединить резервную копию с текущими данными?",
    legalPrivacy: "Открыть страницу конфиденциальности",
    legalImprint: "Открыть выходные данные",
  },
  es: {
    welcomeTitle: "Bienvenido a OneStep",
    welcomeP1: "Pequeños pasos cada día.",
    welcomeP2: "Empieza con una meta.",
    todayTitle: "Aujourd'hui",
    trackerChecklist: "Lista",
    trackerWeight: "Peso",
    trackerSleep: "Sueño",
    weightTrackerTitle: "Tracker de peso",
    weightTrackerHint: "Registra tu peso una vez al día para ver la evolución.",
    weightTrackerMeta: "Tracker de peso",
    weightKpi7d: "Prom. 7d",
    weightKpi30d: "Prom. 30d",
    weightKpiDelta: "Inicio -> hoy",
    weightInputLabel: "Peso (kg)",
    weightInputPlaceholder: "ej.: 72.4",
    weightSaveBtn: "Guardar",
    weightDatePrefix: "Hoy",
    weightChartTitle: "Evolución del peso",
    weightChartEmpty: "Aún no hay registros.",
    weightTargetLabel: "Peso objetivo (opcional)",
    weightTargetPlaceholder: "ej.: 68.0",
    weightTargetSaveBtn: "Guardar objetivo",
    weightTargetEmpty: "Aún no hay peso objetivo.",
    weightTargetMeta: "Falta para objetivo",
    sleepTrackerTitle: "Tracker de sueño",
    sleepTrackerHint: "Por la noche guarda solo la hora de dormir. El despertar lo puedes añadir después.",
    sleepBedLabel: "Hora de dormir",
    sleepWakeLabel: "Hora de despertar (opcional)",
    sleepSaveBedBtn: "Guardar hora de dormir",
    sleepSaveWakeBtn: "Guardar despertar",
    sleepNowBtn: "Ahora",
    sleepAvg7Label: "Duración media (7d)",
    sleepConsistencyLabel: "Consistencia",
    sleepStatusLabel: "Estado",
    sleepPendingLabel: "Noche abierta",
    sleepDurationLabel: "Duración",
    sleepChartTitle: "Tendencia de sueño",
    sleepChartEmpty: "Aún no hay noches completas.",
    sleepStatusOpen: "despertar pendiente",
    sleepStatusDone: "completo",
    toastWeightTargetSaved: "Peso objetivo guardado",
    toastSleepBedSaved: "Hora de dormir guardada",
    toastSleepWakeSaved: "Hora de despertar guardada",
    toastSleepInvalid: "Introduce una hora válida",
    updateApplied: "Actualización instalada. La app está al día.",
    backupStatusNever: "Aún no se exportó ninguna copia.",
    backupStatusToday: "Copia exportada hoy",
    backupStatusDays: "Última copia hace",
    backupStatusSuffix: "días",
    backupReminder: "Actualiza tu copia de seguridad",
    identityRecommendationPrefix: "Hoy",
    identityRecommendationHigh: "Mantén el ritmo y añade una tarea secundaria.",
    identityRecommendationMid: "Foco en tareas principales y cierre limpio del día.",
    identityRecommendationLow: "Haz solo tu tarea más importante y protege el ritmo.",
    todaySmartPlanPrefix: "Hoy",
    outcomeTitle: "Calidad de resultado",
    goalHitRateLabel: "Goal-hit-rate (30d)",
    completionTrendLabel: "Tendencia",
    completionTrendUp: "subiendo",
    completionTrendDown: "bajando",
    completionTrendStable: "estable",
    retentionLabel: "Retention (D1/D7)",
    introText2A: "OneStep te muestra que hacer ahora para mantener constancia.",
    introText2B: "Sin hype motivacional: pasos claros que puedes repetir de verdad.",
    goalsTitle: "Objectifs",
    progressTitle: "Progrès",
    infoTitle: "Ajustes",
    calLegend: "Día completado",
    statStreak: "Días activos seguidos",
    statTotal: "Tareas completadas",
    statActive: "Días activos (semana)",
    statPerfect: "Días perfectos (semana)",
    modeToggle: "Activar versión Pro",
    settingsLanguage: "Idioma",
    modeHint: "Fase de prueba: ambos modos visibles.",
    testTitle: "Simular días",
    applyBtn: "Aplicar",
    resetBtn: "Reiniciar",
    simPrefix: "Hoy",
    footer1: "OneStep · Progreso minimalista",
    footer2: "Guardado local en tu navegador",
    navSettings: "Ajustes",
    navToday: "Hoy",
    navGoals: "Metas",
    navProgress: "Progreso",
    calWeekdays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    calDoneTitle: "hechas",
    btnEdit: "Editar",
    btnSave: "Guardar",
    btnRemove: "Eliminar",
    deleteGoalTitle: "Eliminar meta",
    infoSubtitle: "Opciones y notas",
    infoMainSummary: "Info",
    infoMainP1: "Los pasos pequeños superan la perfección.",
    infoMainP2: "La constancia importa más que la intensidad.",
    infoListSummary: "Cómo se crea tu lista diaria",
    infoList1: "Metas es tu pool de tareas.",
    infoList2: "Al inicio, una meta pasa a Hoy.",
    infoList3: "Cada 3 días puedes añadir otra tarea.",
    infoList4: "Las tareas hechas siguen visibles.",
    infoBalanceSummary: "Dificultad y equilibrio",
    infoBalance1: "Fácil: paso pequeño y seguro.",
    infoBalance2: "Medio: progreso estable.",
    infoBalance3: "Difícil: reto enfocado.",
    infoPrivacySummary: "Privacidad",
    infoPrivacyP1: "Todos los datos se guardan localmente.",
    settingsVersionTitle: "Versión",
    settingsSystemTitle: "Sistema",
    backupTitle: "Copia de seguridad",
    exportData: "Exportar datos",
    importData: "Importar datos",
    toastExportSuccess: "Copia exportada",
    toastImportSuccess: "Copia importada",
    toastImportError: "Error al importar",
    dayOffsetLabel: "Desfase de día",
    weeklyPlanTitle: "Plan semanal",
    weeklyPlanHintMinDays: "Añade al menos 4 días",
    planGoalLabel: "Meta",
    templateSummary: "Plantillas (10 categorías)",
    timePickerTitle: "Elegir hora",
    timePickerHour: "Hora",
    timePickerMinute: "Minuto",
    timePickerApply: "Aplicar",
    timePrefix: "Hora",
    updateAvailable: "Nueva versión disponible",
    updateNow: "Actualizar ahora",
    updateRetry: "Comprobar de nuevo",
    updateNote: "Hay correcciones y mejoras disponibles.",
    checkUpdatesBtn: "Buscar actualizaciones",
    toastUpdateCheck: "Comprobacion de actualizaciones iniciada",
    toastUpdateCheckError: "Error al comprobar actualizaciones",
    toastUpdateUnsupported: "Comprobacion no disponible",
    identityScoreTitle: "Identity Score",
    identityScoreMeta: "Constancia en los ultimos 14 dias",
    tutorialCheck1: "Elegir idioma",
    tutorialCheck2: "Crear primera meta",
    tutorialCheck3: "Completar primera tarea",
    tutorialCta1: "Abrir ajustes",
    tutorialCta2: "Crear meta",
    tutorialCta3: "Ir a Hoy",
    introStepLabel: "Paso",
    introTitle1: "Bienvenido a OneStep",
    introText1: "Cada dia empieza con un paso claro y alcanzable.",
    introTitle2: "Mas claridad, menos caos",
    introText2: "OneStep te muestra que hacer ahora para mantener constancia.",
    introTitle3: "Tu rutina se vuelve mas facil",
    introText3: "Las tareas dificiles se vuelven parte normal del dia, como dormir, comer y correr.",
    introExample1: "Dormir a las 23:00",
    introExample2: "Correr 10 minutos",
    introExample3: "Comida rica en proteina",
    introGoalLabel: "Objetivo anual",
    introGoalPlaceholder: "p. ej. estar mas en forma y con mas energia",
    introGoalHint: "Opcional: tu objetivo principal para este ano.",
    introNextBtn: "Siguiente ->",
    introStartBtn: "Empezar: crear primera meta ->",
    introNextAria: "Pagina siguiente",
    introStartAria: "Crear primera meta",
    annualGoalTitle: "Objetivo anual",
    annualGoalEmpty: "Aun no definido",
    annualGoalSince: "Desde",
    annualGoalYearDone: "Hechas este ano",
    annualGoalYearActiveDays: "Dias activos este ano",
    dayDetailTitle: "Detalles del dia",
    dayDetailEmpty: "No hay detalles guardados para este dia.",
    dayDetailDone: "Hecha",
    dayDetailOpen: "Abierta",
    dayDetailUnknown: "No hay historial detallado disponible.",
    goalsAnnualLabel: "Objetivo anual",
    goalsAnnualPlaceholder: "p. ej. estar mas en forma y con mas energia",
    goalsAnnualSave: "Guardar objetivo anual",
    goalLinkAnnual: "Vincular",
    goalUnlinkAnnual: "Quitar vinculo",
    goalLinkedTag: "Objetivo anual",
    progressWeekRate: "Ratio semanal",
    progressMonthRate: "Ratio mensual",
    progressBestDay: "Mejor día de la semana",
    dragHint: "Arrastra para ordenar",
    backupOverwritePrompt: "¿Sobrescribir todos los datos actuales con la copia?",
    backupMergePrompt: "No sobrescribir. ¿Combinar copia y datos actuales?",
    legalPrivacy: "Abrir página de privacidad",
    legalImprint: "Abrir aviso legal",
  },
  fr: {
    welcomeTitle: "Bienvenue sur OneStep",
    welcomeP1: "Petits pas chaque jour.",
    welcomeP2: "Commence avec un objectif.",
    todayTitle: "Aujourd'hui",
    trackerChecklist: "Checklist",
    trackerWeight: "Poids",
    trackerSleep: "Sommeil",
    weightTrackerTitle: "Suivi du poids",
    weightTrackerHint: "Saisis ton poids une fois par jour pour voir l'évolution.",
    weightTrackerMeta: "Suivi du poids",
    weightKpi7d: "Moy. 7j",
    weightKpi30d: "Moy. 30j",
    weightKpiDelta: "Départ -> aujourd'hui",
    weightInputLabel: "Poids (kg)",
    weightInputPlaceholder: "ex. : 72.4",
    weightSaveBtn: "Enregistrer",
    weightDatePrefix: "Aujourd'hui",
    weightChartTitle: "Évolution du poids",
    weightChartEmpty: "Pas encore de saisies.",
    weightTargetLabel: "Poids cible (optionnel)",
    weightTargetPlaceholder: "ex. : 68.0",
    weightTargetSaveBtn: "Enregistrer l'objectif",
    weightTargetEmpty: "Pas encore de poids cible.",
    weightTargetMeta: "Reste jusqu'à l'objectif",
    sleepTrackerTitle: "Suivi du sommeil",
    sleepTrackerHint: "Le soir, saisis seulement l'heure de coucher. Le réveil peut être ajouté plus tard.",
    sleepBedLabel: "Heure de coucher",
    sleepWakeLabel: "Heure de réveil (optionnel)",
    sleepSaveBedBtn: "Enregistrer coucher",
    sleepSaveWakeBtn: "Enregistrer réveil",
    sleepNowBtn: "Maintenant",
    sleepAvg7Label: "Durée moy. (7j)",
    sleepConsistencyLabel: "Régularité",
    sleepStatusLabel: "Statut",
    sleepPendingLabel: "Nuit ouverte",
    sleepDurationLabel: "Durée",
    sleepChartTitle: "Tendance du sommeil",
    sleepChartEmpty: "Pas encore de nuits complètes.",
    sleepStatusOpen: "réveil en attente",
    sleepStatusDone: "complet",
    toastWeightTargetSaved: "Poids cible enregistré",
    toastSleepBedSaved: "Heure de coucher enregistrée",
    toastSleepWakeSaved: "Heure de réveil enregistrée",
    toastSleepInvalid: "Entre une heure valide",
    updateApplied: "Mise à jour installée. L'app est à jour.",
    backupStatusNever: "Aucune sauvegarde exportée pour le moment.",
    backupStatusToday: "Sauvegarde exportée aujourd'hui",
    backupStatusDays: "Dernière sauvegarde il y a",
    backupStatusSuffix: "jours",
    backupReminder: "Pense à mettre à jour ta sauvegarde",
    identityRecommendationPrefix: "Aujourd'hui",
    identityRecommendationHigh: "Garde le rythme et ajoute une quête secondaire.",
    identityRecommendationMid: "Focus sur les tâches principales et une fin de journée propre.",
    identityRecommendationLow: "Fais seulement la tâche la plus importante et protège ton rythme.",
    todaySmartPlanPrefix: "Aujourd'hui",
    outcomeTitle: "Qualité de résultat",
    goalHitRateLabel: "Goal-hit-rate (30j)",
    completionTrendLabel: "Tendance",
    completionTrendUp: "hausse",
    completionTrendDown: "baisse",
    completionTrendStable: "stable",
    retentionLabel: "Retention (D1/D7)",
    introText2A: "OneStep te montre quoi faire maintenant pour rester regulier.",
    introText2B: "Pas de hype motivationnelle : des étapes claires que tu peux vraiment répéter.",
    goalsTitle: "Objectifs",
    progressTitle: "Progrès",
    infoTitle: "Réglages",
    calLegend: "Journée complète",
    statStreak: "Jours actifs d'affilée",
    statTotal: "Tâches terminées",
    statActive: "Jours actifs (semaine)",
    statPerfect: "Jours parfaits (semaine)",
    modeToggle: "Activer la version Pro",
    settingsLanguage: "Langue",
    modeHint: "Phase test : deux modes visibles.",
    testTitle: "Simuler des jours",
    applyBtn: "Appliquer",
    resetBtn: "Réinitialiser",
    simPrefix: "Aujourd'hui",
    footer1: "OneStep · Progrès minimaliste",
    footer2: "Stocké localement dans le navigateur",
    navSettings: "Réglages",
    navToday: "Aujourd'hui",
    navGoals: "Objectifs",
    navProgress: "Progrès",
    calWeekdays: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    calDoneTitle: "faites",
    btnEdit: "Modifier",
    btnSave: "Enregistrer",
    btnRemove: "Supprimer",
    deleteGoalTitle: "Supprimer l'objectif",
    infoSubtitle: "Options et informations",
    infoMainSummary: "Info",
    infoMainP1: "Les petits pas battent la perfection.",
    infoMainP2: "La régularité compte plus que l'intensité.",
    infoListSummary: "Comment la liste du jour est créée",
    infoList1: "Objectifs est ton pool de tâches.",
    infoList2: "Au départ, un objectif devient la tâche du jour.",
    infoList3: "Tous les 3 jours tu peux ajouter une tâche.",
    infoList4: "Les tâches terminées restent visibles.",
    infoBalanceSummary: "Difficulté et équilibre",
    infoBalance1: "Facile : petit pas sûr.",
    infoBalance2: "Moyen : progression stable.",
    infoBalance3: "Difficile : défi ciblé.",
    infoPrivacySummary: "Confidentialité",
    infoPrivacyP1: "Toutes les données restent locales au navigateur.",
    settingsVersionTitle: "Version",
    settingsSystemTitle: "Système",
    backupTitle: "Sauvegarde",
    exportData: "Exporter les données",
    importData: "Importer les données",
    toastExportSuccess: "Sauvegarde exportée",
    toastImportSuccess: "Sauvegarde importée",
    toastImportError: "Échec de l'import",
    dayOffsetLabel: "Décalage de jour",
    weeklyPlanTitle: "Plan hebdo",
    weeklyPlanHintMinDays: "Ajoute au moins 4 jours",
    planGoalLabel: "Objectif",
    templateSummary: "Modèles (10 catégories)",
    timePickerTitle: "Choisir l'heure",
    timePickerHour: "Heure",
    timePickerMinute: "Minute",
    timePickerApply: "Appliquer",
    timePrefix: "Heure",
    updateAvailable: "Nouvelle version disponible",
    updateNow: "Mettre à jour",
    updateRetry: "Vérifier encore",
    updateNote: "Des correctifs et améliorations sont prêts.",
    checkUpdatesBtn: "Verifier les mises a jour",
    toastUpdateCheck: "Verification des mises a jour lancee",
    toastUpdateCheckError: "Echec de la verification des mises a jour",
    toastUpdateUnsupported: "Verification non disponible",
    identityScoreTitle: "Identity Score",
    identityScoreMeta: "Regularite sur les 14 derniers jours",
    tutorialCheck1: "Choisir la langue",
    tutorialCheck2: "Créer le premier objectif",
    tutorialCheck3: "Terminer la première tâche",
    tutorialCta1: "Ouvrir réglages",
    tutorialCta2: "Créer objectif",
    tutorialCta3: "Aller à Aujourd'hui",
    introStepLabel: "Etape",
    introTitle1: "Bienvenue sur OneStep",
    introText1: "Chaque jour commence par une etape claire et realiste.",
    introTitle2: "Plus de clarte, moins de chaos",
    introText2: "OneStep te montre quoi faire maintenant pour rester regulier.",
    introTitle3: "Ta routine devient plus simple",
    introText3: "Les taches difficiles deviennent un rythme normal, comme dormir, manger et courir.",
    introExample1: "Dormir a 23:00",
    introExample2: "Courir 10 minutes",
    introExample3: "Repas riche en proteines",
    introGoalLabel: "Objectif annuel",
    introGoalPlaceholder: "ex. etre plus en forme et plus energique",
    introGoalHint: "Optionnel : ton objectif principal pour cette annee.",
    introNextBtn: "Suivant ->",
    introStartBtn: "C'est parti : creer le premier objectif ->",
    introNextAria: "Page suivante",
    introStartAria: "Creer le premier objectif",
    annualGoalTitle: "Objectif annuel",
    annualGoalEmpty: "Pas encore defini",
    annualGoalSince: "Depuis",
    annualGoalYearDone: "Faites cette annee",
    annualGoalYearActiveDays: "Jours actifs cette annee",
    dayDetailTitle: "Details du jour",
    dayDetailEmpty: "Aucun detail enregistre pour ce jour.",
    dayDetailDone: "Faite",
    dayDetailOpen: "Ouverte",
    dayDetailUnknown: "Historique detaille indisponible.",
    goalsAnnualLabel: "Objectif annuel",
    goalsAnnualPlaceholder: "ex. etre plus en forme et plus energique",
    goalsAnnualSave: "Enregistrer l'objectif annuel",
    goalLinkAnnual: "Lier",
    goalUnlinkAnnual: "Delier",
    goalLinkedTag: "Objectif annuel",
    progressWeekRate: "Taux semaine",
    progressMonthRate: "Taux mois",
    progressBestDay: "Jour le plus fort",
    dragHint: "Glisser pour trier",
    backupOverwritePrompt: "Écraser toutes les données actuelles avec la sauvegarde ?",
    backupMergePrompt: "Ne pas écraser. Fusionner la sauvegarde avec les données actuelles ?",
    legalPrivacy: "Ouvrir la page confidentialité",
    legalImprint: "Ouvrir les mentions légales",
  },
};

// ---------------------------
// Grundlegende Zeit-Utilities
// ---------------------------
const isoDateFromLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const todayISO = (offsetDays = 0) => {
  // Testmodus: Wir können das Datum um X Tage verschieben,
  // um die 3-Tage-Logik schnell zu testen.
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return isoDateFromLocalDate(date); // YYYY-MM-DD (lokal)
};

const weekdayKeyFromISO = (iso) => {
  const date = new Date(iso + "T00:00:00");
  const weekday = date.getDay(); // 0=Sun
  const keys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  return keys[weekday];
};

const daysBetween = (startISO, endISO) => {
  // Berechnet volle Tage zwischen zwei ISO-Daten.
  // Wir normalisieren auf Mitternacht, damit Tageswechsel zuverlässig sind.
  const start = new Date(startISO + "T00:00:00");
  const end = new Date(endISO + "T00:00:00");
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((end - start) / msPerDay);
};

const localeForLanguage = () => {
  if (currentLanguage === "en") return "en-US";
  if (currentLanguage === "ru") return "ru-RU";
  if (currentLanguage === "es") return "es-ES";
  if (currentLanguage === "fr") return "fr-FR";
  return "de-DE";
};

const formatISODate = (iso) => {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString(localeForLanguage());
};

const getIdentityScore = (state, currentISO) => {
  const baseDate = new Date(`${currentISO}T00:00:00`);
  let doneSum = 0;
  let totalSum = 0;
  let activeDays = 0;
  let recentStreak = 0;

  for (let offset = 0; offset < 14; offset += 1) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - offset);
    const iso = isoDateFromLocalDate(date);
    const summary = state.daySummary?.[iso];
    const done = Number(summary?.done || 0);
    const total = Number(summary?.total || 0);
    doneSum += done;
    totalSum += total;
    if (done > 0) activeDays += 1;
    if (offset === recentStreak && done > 0) recentStreak += 1;
  }

  const completionRatio = totalSum > 0 ? doneSum / totalSum : 0;
  const activeRatio = activeDays / 14;
  const streakRatio = Math.min(recentStreak, 7) / 7;
  const score = Math.round((completionRatio * 55) + (activeRatio * 30) + (streakRatio * 15));
  return Math.max(0, Math.min(100, score));
};

const captureDayTaskHistory = (state, iso = todayISO(state.simulationOffsetDays)) => {
  const entries = [];
  const mainTasks = (state.todayTasks || []).filter((task) => task.date === iso);
  mainTasks.forEach((task) => {
    entries.push({
      label: task.label,
      done: !!task.done || !!task.isRestDay,
    });
  });

  const quickEntries = [
    ...Object.values(state.quickTasks || {}),
    ...Object.values(state.quickTasksTomorrow || {}),
  ].filter((task) => task.date === iso);
  quickEntries.forEach((task) => {
    entries.push({
      label: task.label,
      done: !!task.done,
    });
  });

  state.dayTaskHistory = state.dayTaskHistory || {};
  if (!entries.length) {
    delete state.dayTaskHistory[iso];
    return;
  }
  state.dayTaskHistory[iso] = entries;
};

const openDayDetails = (state, iso) => {
  if (!dayDetailModal || !dayDetailList) return;
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  if (dayDetailTitle) dayDetailTitle.textContent = s.dayDetailTitle;
  if (dayDetailDate) dayDetailDate.textContent = formatISODate(iso);
  dayDetailList.innerHTML = "";
  const entries = state.dayTaskHistory?.[iso] || [];
  const hasWeightEntry = Number.isFinite(Number(state.weightEntries?.[iso]));
  const weightValue = Number(state.weightEntries?.[iso]);
  const sleepEntry = state.sleepEntries?.[iso] || null;
  const hasSleepBed = typeof sleepEntry?.bed === "string" && isClockTime(sleepEntry.bed);
  const hasSleepWake = typeof sleepEntry?.wake === "string" && isClockTime(sleepEntry.wake);
  const sleepMinutes = sleepEntry ? getSleepDurationMinutes(iso, sleepEntry) : null;
  if (hasWeightEntry) {
    const weightLi = document.createElement("li");
    weightLi.className = "day-detail-item done";
    const weightText = document.createElement("span");
    weightText.textContent = `${(STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).weightInputLabel}: ${weightValue.toFixed(1)} kg`;
    const weightStatus = document.createElement("span");
    weightStatus.className = "day-detail-status";
    weightStatus.textContent = "✓";
    weightLi.appendChild(weightText);
    weightLi.appendChild(weightStatus);
    dayDetailList.appendChild(weightLi);
  }
  if (hasSleepBed) {
    const sleepLi = document.createElement("li");
    sleepLi.className = "day-detail-item";
    if (hasSleepWake && Number.isFinite(sleepMinutes)) sleepLi.classList.add("done");
    const sleepText = document.createElement("span");
    const durationLabel = Number.isFinite(sleepMinutes)
      ? ` (${formatSleepDuration(sleepMinutes)})`
      : "";
    sleepText.textContent = `${(STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).trackerSleep}: ${sleepEntry.bed} -> ${hasSleepWake ? sleepEntry.wake : "--"}${durationLabel}`;
    const sleepStatus = document.createElement("span");
    sleepStatus.className = "day-detail-status";
    sleepStatus.textContent = hasSleepWake ? s.dayDetailDone : s.dayDetailOpen;
    sleepLi.appendChild(sleepText);
    sleepLi.appendChild(sleepStatus);
    dayDetailList.appendChild(sleepLi);
  }
  if (!entries.length && !hasWeightEntry && !hasSleepBed) {
    const summary = state.daySummary?.[iso];
    const li = document.createElement("li");
    li.className = "day-detail-item";
    li.textContent = summary
      ? `${summary.done}/${summary.total} · ${s.dayDetailUnknown}`
      : s.dayDetailEmpty;
    dayDetailList.appendChild(li);
    dayDetailModal.hidden = false;
    return;
  }

  entries.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "day-detail-item";
    if (entry.done) li.classList.add("done");
    const text = document.createElement("span");
    text.textContent = entry.label;
    const status = document.createElement("span");
    status.className = "day-detail-status";
    status.textContent = entry.done ? s.dayDetailDone : s.dayDetailOpen;
    li.appendChild(text);
    li.appendChild(status);
    dayDetailList.appendChild(li);
  });
  dayDetailModal.hidden = false;
};

const closeDayDetails = () => {
  if (!dayDetailModal) return;
  dayDetailModal.hidden = true;
};

// ---------------------------
// State-Form
// ---------------------------
const defaultState = () => ({
  goals: [],
  // todayTasks enthält Aufgaben für das aktuelle Datum.
  // Jede Aufgabe referenziert ein Ziel über goalId.
  todayTasks: [],
  quickTasks: {},
  quickTasksTomorrow: {},
  sideQuests: [],
  sideQuestChecks: {},
  lastTaskUnlockDate: null,
  lastActiveDate: null,
  streak: 0,
  totalDone: 0,
  simulationOffsetDays: 0,
  completedDays: {},
  daySummary: {},
  dayTaskHistory: {},
  weightEntries: {},
  sleepEntries: {},
  vocabDecks: [],
  vocabSeedVersion: "",
  vocabSettings: {
    dailyGoalCorrect: 10,
    direction: "fr-de",
    writeModeEnabled: false,
    fuzzyTolerance: 1,
  },
  vocabProgress: {
    byTheme: {},
    daily: {},
    streak: 0,
    lastGoalHitDate: null,
  },
  vocabRuntime: {
    activeThemeId: "",
    activeMode: "flashcard",
    session: null,
    lastSummary: null,
  },
  weightTargetKg: null,
  weeklyPlans: {},
  tutorialStep: 1,
  tutorialCompleted: false,
  introCompleted: false,
  annualGoal: "",
  annualGoalUpdatedAt: null,
  onboardingStartDate: null,
  introVariant: "",
  proEnabled: false,
  templatesOpenedOnce: false,
  todayTracker: "checklist",
});

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();

  try {
    const parsed = JSON.parse(raw);
    const normalized = {
      ...defaultState(),
      ...parsed,
    };
    normalized.goals = normalized.goals.map((goal) => ({
      ...goal,
      difficulty: normalizeGoalTime(goal.difficulty),
    }));
    normalized.todayTasks = normalized.todayTasks.map((task) => ({
      ...task,
      difficulty: normalizeGoalTime(task.difficulty),
      doneAt: task.doneAt || null,
      isRestDay: task.isRestDay || false,
    }));
    normalized.quickTasks = normalized.quickTasks || {};
    normalized.quickTasksTomorrow = normalized.quickTasksTomorrow || {};
    normalized.sideQuests = normalized.sideQuests || [];
    normalized.sideQuestChecks = normalized.sideQuestChecks || {};
    normalized.completedDays = normalized.completedDays || {};
    normalized.daySummary = normalized.daySummary || {};
    normalized.dayTaskHistory = normalized.dayTaskHistory || {};
    normalized.weightEntries =
      normalized.weightEntries && typeof normalized.weightEntries === "object"
        ? normalized.weightEntries
        : {};
    normalized.sleepEntries =
      normalized.sleepEntries && typeof normalized.sleepEntries === "object"
        ? normalized.sleepEntries
        : {};
    normalized.vocabDecks = Array.isArray(normalized.vocabDecks) ? normalized.vocabDecks : [];
    normalized.vocabSeedVersion = typeof normalized.vocabSeedVersion === "string"
      ? normalized.vocabSeedVersion
      : "";
    normalized.vocabSettings = {
      dailyGoalCorrect: Number.isFinite(Number(normalized.vocabSettings?.dailyGoalCorrect))
        ? Math.max(1, Math.round(Number(normalized.vocabSettings.dailyGoalCorrect)))
        : 10,
      direction: normalized.vocabSettings?.direction === "de-fr" ? "de-fr" : "fr-de",
      writeModeEnabled: Boolean(normalized.vocabSettings?.writeModeEnabled),
      fuzzyTolerance: Number.isFinite(Number(normalized.vocabSettings?.fuzzyTolerance))
        ? Math.max(0, Math.round(Number(normalized.vocabSettings.fuzzyTolerance)))
        : 1,
    };
    normalized.vocabProgress = {
      byTheme: normalized.vocabProgress?.byTheme && typeof normalized.vocabProgress.byTheme === "object"
        ? normalized.vocabProgress.byTheme
        : {},
      daily: normalized.vocabProgress?.daily && typeof normalized.vocabProgress.daily === "object"
        ? normalized.vocabProgress.daily
        : {},
      streak: Number.isFinite(Number(normalized.vocabProgress?.streak))
        ? Math.max(0, Math.round(Number(normalized.vocabProgress.streak)))
        : 0,
      lastGoalHitDate: normalized.vocabProgress?.lastGoalHitDate || null,
    };
    normalized.vocabRuntime = {
      activeThemeId: typeof normalized.vocabRuntime?.activeThemeId === "string"
        ? normalized.vocabRuntime.activeThemeId
        : "",
      activeMode: ["flashcard", "quicktest", "write"].includes(normalized.vocabRuntime?.activeMode)
        ? normalized.vocabRuntime.activeMode
        : "flashcard",
      session: normalized.vocabRuntime?.session || null,
      lastSummary: normalized.vocabRuntime?.lastSummary || null,
    };
    normalized.weightTargetKg =
      Number.isFinite(Number(normalized.weightTargetKg)) ? Number(normalized.weightTargetKg) : null;
    normalized.weeklyPlans = normalized.weeklyPlans || {};
    normalized.tutorialStep = normalized.tutorialStep || 1;
    normalized.tutorialCompleted = normalized.tutorialCompleted || false;
    normalized.introCompleted = normalized.introCompleted || false;
    normalized.annualGoal = typeof normalized.annualGoal === "string"
      ? normalized.annualGoal
      : "";
    normalized.annualGoalUpdatedAt = normalized.annualGoalUpdatedAt || null;
    normalized.onboardingStartDate = normalized.onboardingStartDate || null;
    normalized.introVariant =
      normalized.introVariant === "B" || normalized.introVariant === "A"
        ? normalized.introVariant
        : "";
    if (!normalized.onboardingStartDate && normalized.goals.length > 0) {
      const datedGoals = normalized.goals
        .map((g) => g.createdAt)
        .filter((d) => typeof d === "string" && d.length >= 10)
        .sort();
      normalized.onboardingStartDate =
        datedGoals[0] || todayISO(normalized.simulationOffsetDays);
    }
    normalized.proEnabled = normalized.proEnabled || false;
    normalized.templatesOpenedOnce = normalized.templatesOpenedOnce || false;
    normalized.todayTracker = ["checklist", "weight", "sleep"].includes(normalized.todayTracker)
      ? normalized.todayTracker
      : "checklist";
    return normalized;
  } catch (err) {
    console.warn("State konnte nicht geladen werden, zurücksetzen.", err);
    return defaultState();
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

// ---------------------------
// DOM References
// ---------------------------
const welcomeSection = document.getElementById("welcome");
const todayList = document.getElementById("today-list");
const todayCount = document.getElementById("today-count");
const unlockControls = document.getElementById("unlock-controls");
const goalsList = document.getElementById("goals-list");
const quickTaskForm = document.getElementById("quick-task-form");
const quickTaskInput = document.getElementById("quick-task-input");
const quickTaskTomorrowBtn = document.getElementById("quick-task-tomorrow");
const sideQuestForm = document.getElementById("side-quest-form");
const sideQuestSelect = document.getElementById("side-quest-select");
const trackerChecklistBtn = document.getElementById("tracker-checklist-btn");
const trackerWeightBtn = document.getElementById("tracker-weight-btn");
const trackerSleepBtn = document.getElementById("tracker-sleep-btn");
const trackerVocabBtn = document.getElementById("tracker-vocab-btn");
const weightTrackerPanel = document.getElementById("weight-tracker-panel");
const sleepTrackerPanel = document.getElementById("sleep-tracker-panel");
const vocabTrackerPanel = document.getElementById("vocab-tracker-panel");
const weightForm = document.getElementById("weight-form");
const weightInput = document.getElementById("weight-input");
const weightSaveBtn = document.getElementById("weight-save-btn");
const weightInputLabel = document.getElementById("weight-input-label");
const weightDateInfo = document.getElementById("weight-date-info");
const weightChartSvg = document.getElementById("weight-chart");
const weightChartEmpty = document.getElementById("weight-chart-empty");
const weightKpi7d = document.getElementById("weight-kpi-7d");
const weightKpi30d = document.getElementById("weight-kpi-30d");
const weightKpiDelta = document.getElementById("weight-kpi-delta");
const weightTargetForm = document.getElementById("weight-target-form");
const weightTargetInput = document.getElementById("weight-target-input");
const weightTargetLabel = document.getElementById("weight-target-label");
const weightTargetSaveBtn = document.getElementById("weight-target-save-btn");
const weightTargetMeta = document.getElementById("weight-target-meta");
const sleepBedForm = document.getElementById("sleep-bed-form");
const sleepWakeForm = document.getElementById("sleep-wake-form");
const sleepBedInput = document.getElementById("sleep-bed-input");
const sleepWakeInput = document.getElementById("sleep-wake-input");
const sleepBedLabel = document.getElementById("sleep-bed-label");
const sleepWakeLabel = document.getElementById("sleep-wake-label");
const sleepBedSaveBtn = document.getElementById("sleep-bed-save-btn");
const sleepWakeSaveBtn = document.getElementById("sleep-wake-save-btn");
const sleepNowBtn = document.getElementById("sleep-now-btn");
const sleepTrackerTitleEl = document.getElementById("sleep-tracker-title");
const sleepTrackerHintEl = document.getElementById("sleep-tracker-hint");
const sleepKpiAvg7El = document.getElementById("sleep-kpi-avg7");
const sleepKpiConsistencyEl = document.getElementById("sleep-kpi-consistency");
const sleepKpiStatusEl = document.getElementById("sleep-kpi-status");
const sleepPendingMetaEl = document.getElementById("sleep-pending-meta");
const sleepDurationMetaEl = document.getElementById("sleep-duration-meta");
const sleepChartTitleEl = document.getElementById("sleep-chart-title");
const sleepChartSvg = document.getElementById("sleep-chart");
const sleepChartEmptyEl = document.getElementById("sleep-chart-empty");
const vocabTrackerTitleEl = document.getElementById("vocab-tracker-title");
const vocabTrackerHintEl = document.getElementById("vocab-tracker-hint");
const vocabKpiDailyEl = document.getElementById("vocab-kpi-daily");
const vocabKpiStreakEl = document.getElementById("vocab-kpi-streak");
const vocabKpiThemeEl = document.getElementById("vocab-kpi-theme");
const vocabThemeSelect = document.getElementById("vocab-theme-select");
const vocabModeSelect = document.getElementById("vocab-mode-select");
const vocabDirectionQuickLabelEl = document.getElementById("vocab-direction-quick-label");
const vocabDirectionFrDeBtn = document.getElementById("vocab-direction-frde-btn");
const vocabDirectionDeFrBtn = document.getElementById("vocab-direction-defr-btn");
const vocabSessionStatusEl = document.getElementById("vocab-session-status");
const vocabQuestionEl = document.getElementById("vocab-question");
const vocabAnswerEl = document.getElementById("vocab-answer");
const vocabOptionsEl = document.getElementById("vocab-options");
const vocabWriteWrapEl = document.getElementById("vocab-write-wrap");
const vocabWriteInput = document.getElementById("vocab-write-input");
const vocabStartBtn = document.getElementById("vocab-start-btn");
const vocabRevealBtn = document.getElementById("vocab-reveal-btn");
const vocabCorrectBtn = document.getElementById("vocab-correct-btn");
const vocabWrongBtn = document.getElementById("vocab-wrong-btn");
const vocabSubmitBtn = document.getElementById("vocab-submit-btn");
const vocabNextBtn = document.getElementById("vocab-next-btn");
const vocabSummaryEl = document.getElementById("vocab-summary");
const vocabDailyGoalInput = document.getElementById("vocab-daily-goal-input");
const vocabDirectionSelect = document.getElementById("vocab-direction-select");
const vocabWriteEnableInput = document.getElementById("vocab-write-enable");
const vocabSettingsSaveBtn = document.getElementById("vocab-settings-save");
const vocabThemeProgressEl = document.getElementById("vocab-theme-progress");
const vocabLibrarySummaryEl = document.getElementById("vocab-library-summary");
const vocabLibrarySearchInput = document.getElementById("vocab-library-search");
const vocabLibraryMetaEl = document.getElementById("vocab-library-meta");
const vocabLibraryListEl = document.getElementById("vocab-library-list");
const todaySmartPlanEl = document.getElementById("today-smart-plan");
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalPlanMonInput = document.getElementById("goal-plan-mon");
const goalPlanTueInput = document.getElementById("goal-plan-tue");
const goalPlanWedInput = document.getElementById("goal-plan-wed");
const goalPlanThuInput = document.getElementById("goal-plan-thu");
const goalPlanFriInput = document.getElementById("goal-plan-fri");
const goalPlanSatInput = document.getElementById("goal-plan-sat");
const goalPlanSunInput = document.getElementById("goal-plan-sun");
const goalTimeInput = document.getElementById("goal-time-input");
const goalTimeToggle = document.getElementById("goal-time-toggle");
const goalTimePicker = document.getElementById("goal-time-picker");
const goalTimeApplyBtn = document.getElementById("goal-time-apply");
const timePickerValueEl = document.getElementById("time-picker-value");
const timePickerTitleEl = document.getElementById("time-picker-title");
const timeHourTitleEl = document.getElementById("time-hour-title");
const timeMinuteTitleEl = document.getElementById("time-minute-title");
const timeHourWheel = document.getElementById("time-hour-wheel");
const timeMinuteWheel = document.getElementById("time-minute-wheel");
const streakEl = document.getElementById("streak");
const totalDoneEl = document.getElementById("total-done");
const motivationEl = document.getElementById("motivation");
const activeWeekEl = document.getElementById("active-week");
const perfectWeekEl = document.getElementById("perfect-week");
const perfectRecordEl = document.getElementById("perfect-record");
const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");
const calTitle = document.getElementById("cal-title");
const calGrid = document.getElementById("cal-grid");
const dayOffsetInput = document.getElementById("day-offset");
const applyOffsetBtn = document.getElementById("apply-offset");
const checkUpdatesBtn = document.getElementById("check-updates");
const simulatedDateEl = document.getElementById("simulated-date");
const resetBtn = document.getElementById("reset-app");
const planGoalSelect = document.getElementById("plan-goal");
const planGrid = document.getElementById("plan-grid");
const planHint = document.getElementById("plan-hint");
const weeklyPlanSection = document.querySelector(".weekly-plan");
const modeSwitch = document.getElementById("mode-switch");
const languageSelect = document.getElementById("language-select");
const modeHint = document.getElementById("mode-hint");
const templateCategories = document.getElementById("template-categories");
const templatesSection = document.getElementById("templates-section");
const navItems = document.querySelectorAll(".bottom-nav .nav-item");
const sections = document.querySelectorAll("[data-section]");
const tutorialSection = document.getElementById("tutorial");
const tutorialTitle = document.getElementById("tutorial-title");
const tutorialStepLabel = document.getElementById("tutorial-step");
const tutorialText = document.getElementById("tutorial-text");
const tutorialChecklist = document.getElementById("tutorial-checklist");
const tutorialCtaBtn = document.getElementById("tutorial-cta");
const toastEl = document.getElementById("toast");
const languageModal = document.getElementById("language-modal");
const languageButtons = document.querySelectorAll("[data-lang]");
const languageGrid = document.querySelector(".language-grid");
const introModal = document.getElementById("intro-modal");
const introCardEl = document.querySelector(".intro-card");
const introStepEl = document.getElementById("intro-step");
const introProgressFillEl = document.getElementById("intro-progress-fill");
const introTitleEl = document.getElementById("intro-title");
const introTextEl = document.getElementById("intro-text");
const introGoalFieldEl = document.getElementById("intro-goal-field");
const introGoalLabelEl = document.getElementById("intro-goal-label");
const introGoalInputEl = document.getElementById("intro-goal-input");
const introGoalHintEl = document.getElementById("intro-goal-hint");
const introExamplesEl = document.getElementById("intro-examples");
const introNextBtn = document.getElementById("intro-next");
const updateBanner = document.getElementById("update-banner");
const updateBannerText = document.getElementById("update-banner-text");
const updateBannerNote = document.getElementById("update-banner-note");
const updateBannerBtn = document.getElementById("update-banner-btn");
const updateBannerRetryBtn = document.getElementById("update-banner-retry");
const dayDetailModal = document.getElementById("day-detail-modal");
const dayDetailTitle = document.getElementById("day-detail-title");
const dayDetailDate = document.getElementById("day-detail-date");
const dayDetailList = document.getElementById("day-detail-list");
const dayDetailClose = document.getElementById("day-detail-close");
const exportDataBtn = document.getElementById("export-data");
const importDataBtn = document.getElementById("import-data");
const importFileInput = document.getElementById("import-file");
const backupStatusEl = document.getElementById("backup-status");
const progressWeekRateEl = document.getElementById("progress-week-rate");
const progressMonthRateEl = document.getElementById("progress-month-rate");
const progressBestDayEl = document.getElementById("progress-best-day");
const identityScoreTitleEl = document.getElementById("identity-score-title");
const identityScoreValueEl = document.getElementById("identity-score-value");
const identityScoreMetaEl = document.getElementById("identity-score-meta");
const identityRecommendationEl = document.getElementById("identity-recommendation");
const outcomeTitleEl = document.getElementById("outcome-title");
const goalHitRateEl = document.getElementById("goal-hit-rate");
const completionTrendEl = document.getElementById("completion-trend");
const retentionSnapshotEl = document.getElementById("retention-snapshot");
const annualGoalTitleEl = document.getElementById("annual-goal-title");
const annualGoalValueEl = document.getElementById("annual-goal-value");
const annualGoalMetaEl = document.getElementById("annual-goal-meta");
const annualGoalStatsEl = document.getElementById("annual-goal-stats");
let currentTab = "today";
const tabOrder = ["today", "goals", "progress", "info"];
let touchStartX = null;
let touchStartY = null;
let touchStartTime = null;
let trackingPointerId = null;
let tutorialStepCache = 1;
let tutorialCompletedCache = false;
let sideQuestVisibleCache = false;
let toastTimer = null;
let todayRenderTimer = null;
let waitingServiceWorker = null;
let isRefreshingFromServiceWorker = false;
let swRegistrationRef = null;
let draggingGoalId = null;
let introStepIndex = 0;
let introGoalDraft = "";
let runtimeAppVersion = APP_VERSION;
let lastStaticLanguageApplied = "";
let templatesRenderLangCache = "";
let pickerHour = 12;
let pickerMinute = 0;
let editingGoalTimeId = null;
let languageSelectionInProgress = false;
let renderRafId = null;
const WHEEL_ITEM_HEIGHT = 36;
const LANGUAGE_SELECT_ANIMATION_MS = 460;
const WHEEL_REPEAT = 7;
const WHEEL_CENTER_REPEAT = Math.floor(WHEEL_REPEAT / 2);
const HOUR_VALUES = Array.from({ length: 24 }, (_, i) => i);
const MINUTE_VALUES = Array.from({ length: 60 }, (_, i) => i);
const wheelScrollTimers = { hour: null, minute: null };
let wheelSyncLock = false;
const SIDE_QUEST_REVEAL_SCROLL_MS = 520;
let analyticsProvider = "none";
let analyticsEnabled = false;
let analyticsQueue = [];

const flushAnalyticsQueue = () => {
  if (analyticsProvider !== "plausible" || typeof window.plausible !== "function") return;
  while (analyticsQueue.length > 0) {
    const { name, props } = analyticsQueue.shift();
    window.plausible(name, { props });
  }
};

const trackEvent = (name, props = {}) => {
  if (!analyticsEnabled || !name) return;
  if (analyticsProvider === "plausible" && typeof window.plausible === "function") {
    window.plausible(name, { props });
    return;
  }
  analyticsQueue.push({ name, props });
};

const initAnalytics = () => {
  const cfg = window.__ONESTEP_ANALYTICS__ || {};
  if (!cfg.enabled || cfg.provider !== "plausible") return;

  analyticsEnabled = true;
  analyticsProvider = "plausible";

  if (typeof window.plausible === "function") {
    flushAnalyticsQueue();
    trackEvent("app_open", {
      version: APP_VERSION,
      lang: currentLanguage || "unset",
    });
    return;
  }

  const scriptSrc = cfg.scriptSrc || `${cfg.apiHost || "https://plausible.io"}/js/script.js`;
  const needsDomainAttr = !cfg.scriptSrc;
  if (needsDomainAttr && !cfg.domain) return;

  const script = document.createElement("script");
  script.defer = true;
  if (needsDomainAttr) script.dataset.domain = cfg.domain;
  script.src = scriptSrc;
  script.addEventListener("load", () => {
    flushAnalyticsQueue();
    trackEvent("app_open", {
      version: APP_VERSION,
      lang: currentLanguage || "unset",
    });
  });
  script.addEventListener("error", () => {
    analyticsEnabled = false;
    analyticsProvider = "none";
    analyticsQueue = [];
  });
  document.head.appendChild(script);
};

// ---------------------------
// Motivationstexte
// ---------------------------
let MOTIVATION = [...t("motivation")];

const triggerHaptic = (ms = 12) => {
  if (typeof navigator === "undefined") return;
  if (typeof navigator.vibrate !== "function") return;
  navigator.vibrate(ms);
};

const logClientError = (type, payload) => {
  try {
    const current = JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || "[]");
    const entry = {
      type,
      payload: String(payload || "unknown").slice(0, 500),
      at: new Date().toISOString(),
      appVersion: APP_VERSION,
    };
    const next = [entry, ...current].slice(0, 20);
    localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(next));
  } catch (_err) {
    // Ignore logging failures to avoid recursive errors.
  }
};

const showToast = (message) => {
  if (!toastEl || !message) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 1700);
};

const readWorkerVersion = (worker) =>
  new Promise((resolve) => {
    if (!worker || typeof MessageChannel === "undefined") {
      resolve(null);
      return;
    }

    const channel = new MessageChannel();
    let settled = false;
    let timeoutId = null;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      if (timeoutId) clearTimeout(timeoutId);
      resolve(typeof value === "string" && value ? value : null);
    };

    channel.port1.onmessage = (event) => {
      finish(event?.data?.version);
    };

    timeoutId = setTimeout(() => finish(null), 800);

    try {
      worker.postMessage({ type: "GET_SW_VERSION" }, [channel.port2]);
    } catch (_err) {
      finish(null);
    }
  });

const setVersionLabel = (state) => {
  const versionEls = document.querySelectorAll("[data-version-label]");
  if (!versionEls.length) return;
  const resolvedVersion = runtimeAppVersion || APP_VERSION;
  const label = state?.proEnabled
    ? `Version ${resolvedVersion} Pro`
    : `Version ${resolvedVersion}`;
  versionEls.forEach((el) => {
    el.textContent = label;
  });
};

const syncRuntimeVersionWithActiveSW = async () => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const activeWorker = navigator.serviceWorker.controller || swRegistrationRef?.active;
  if (!activeWorker) {
    runtimeAppVersion = APP_VERSION;
    setVersionLabel(loadState());
    return;
  }
  const activeVersion = await readWorkerVersion(activeWorker);
  runtimeAppVersion = activeVersion || APP_VERSION;
  setVersionLabel(loadState());
};

const setLanguage = (lang) => {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLanguage = lang;
  lastStaticLanguageApplied = "";
  localStorage.setItem(LANGUAGE_KEY, lang);
  MOTIVATION = [...t("motivation")];
  applyStaticTranslations();
  renderAll(loadState());
  if (languageModal) languageModal.hidden = true;
  openIntroIfNeeded(loadState());
  showToast(t("languageSaved"));
  trackEvent("language_changed", { lang });
};

const showLanguageModalIfNeeded = () => {
  if (!languageModal) return;
  const needsLanguage = !currentLanguage;
  languageModal.hidden = !needsLanguage;
  if (needsLanguage) {
    languageSelectionInProgress = false;
    if (languageGrid) languageGrid.classList.remove("is-locked");
    languageButtons.forEach((btn) => btn.classList.remove("is-selecting"));
  }
  if (needsLanguage && introModal) introModal.hidden = true;
};

const getOrCreateIntroVariant = (state = null) => {
  const fromStorage = localStorage.getItem(INTRO_VARIANT_KEY);
  if (fromStorage === "A" || fromStorage === "B") return fromStorage;
  const existing = state?.introVariant;
  if (existing === "A" || existing === "B") {
    localStorage.setItem(INTRO_VARIANT_KEY, existing);
    return existing;
  }
  const variant = Math.random() < 0.5 ? "A" : "B";
  localStorage.setItem(INTRO_VARIANT_KEY, variant);
  trackEvent("intro_variant_assigned", { variant });
  return variant;
};

const renderBackupStatus = () => {
  if (!backupStatusEl) return;
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const lastBackupISO = localStorage.getItem(LAST_BACKUP_KEY);
  if (!lastBackupISO) {
    backupStatusEl.textContent = s.backupStatusNever;
    return;
  }
  const diff = daysBetween(lastBackupISO, todayISO());
  if (diff <= 0) {
    backupStatusEl.textContent = s.backupStatusToday;
    return;
  }
  const reminder = diff >= 7 ? ` · ${s.backupReminder}` : "";
  backupStatusEl.textContent = `${s.backupStatusDays} ${diff} ${s.backupStatusSuffix}${reminder}`;
};

const getIntroSlides = () => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const state = loadState();
  const variant = getOrCreateIntroVariant(state);
  if (state.introVariant !== variant) {
    state.introVariant = variant;
    saveState(state);
  }
  return [
    {
      title: s.introTitle1,
      text: s.introText1,
      action: s.introNextBtn,
      aria: s.introNextAria,
      examples: [],
    },
    {
      title: s.introTitle2,
      text: variant === "B" ? (s.introText2B || s.introText2) : (s.introText2A || s.introText2),
      action: s.introNextBtn,
      aria: s.introNextAria,
      examples: [],
    },
    {
      title: s.introTitle3,
      text: s.introText3,
      action: s.introStartBtn,
      aria: s.introStartAria,
      examples: [],
    },
  ];
};

const renderIntro = () => {
  if (!introModal || !introStepEl || !introTitleEl || !introTextEl || !introNextBtn) return;
  const slides = getIntroSlides();
  introStepIndex = Math.max(0, Math.min(introStepIndex, slides.length - 1));
  const slide = slides[introStepIndex];
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  introStepEl.textContent = `${s.introStepLabel} ${introStepIndex + 1}/${slides.length}`;
  introTitleEl.textContent = slide.title;
  introTextEl.textContent = slide.text;
  introNextBtn.textContent = slide.action;
  introNextBtn.setAttribute("aria-label", slide.aria);
  if (introGoalLabelEl) introGoalLabelEl.textContent = s.introGoalLabel;
  if (introGoalInputEl) introGoalInputEl.placeholder = s.introGoalPlaceholder;
  if (introGoalHintEl) introGoalHintEl.textContent = s.introGoalHint;
  if (introGoalFieldEl) {
    const showGoalInput = introStepIndex === slides.length - 1;
    introGoalFieldEl.hidden = !showGoalInput;
    if (showGoalInput && introGoalInputEl) {
      introGoalInputEl.value = introGoalDraft;
    }
  }
  if (introProgressFillEl) {
    const ratio = ((introStepIndex + 1) / slides.length) * 100;
    introProgressFillEl.style.width = `${ratio}%`;
  }
  if (introExamplesEl) {
    introExamplesEl.innerHTML = "";
    if (slide.examples?.length) {
      slide.examples.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        introExamplesEl.appendChild(item);
      });
      introExamplesEl.hidden = false;
    } else {
      introExamplesEl.hidden = true;
    }
  }
  if (introCardEl) {
    introCardEl.classList.remove("intro-animate");
    void introCardEl.offsetWidth;
    introCardEl.classList.add("intro-animate");
  }
};

const openIntroIfNeeded = (state) => {
  if (!introModal) return;
  if (!currentLanguage || state?.introCompleted) {
    introModal.hidden = true;
    return;
  }
  introGoalDraft = (state?.annualGoal || "").trim();
  introStepIndex = 0;
  renderIntro();
  introModal.hidden = false;
};

const handleIntroNext = () => {
  const state = loadState();
  const slides = getIntroSlides();
  if (introStepIndex < slides.length - 1) {
    introStepIndex += 1;
    renderIntro();
    return;
  }

  state.introCompleted = true;
  const annualGoal = (introGoalInputEl?.value || "").trim();
  state.annualGoal = annualGoal;
  state.annualGoalUpdatedAt = annualGoal
    ? todayISO(state.simulationOffsetDays)
    : null;
  saveState(state);
  if (introModal) introModal.hidden = true;
  renderAll(state);
  trackEvent("intro_completed", {
    variant: state.introVariant || localStorage.getItem(INTRO_VARIANT_KEY) || "A",
  });
  setActiveTab("goals");
};

const showUpdateBanner = async (worker) => {
  if (!updateBanner || !worker) return;
  waitingServiceWorker = worker;
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  if (updateBannerNote) {
    updateBannerNote.textContent = s.updateNote;
  }
  const nextVersion = await readWorkerVersion(worker);
  if (updateBannerNote && nextVersion) {
    updateBannerNote.textContent = `${s.updateNote} v${nextVersion}`;
  }
  updateBanner.hidden = false;
  updateBanner.classList.add("show");
};

const hideUpdateBanner = () => {
  if (!updateBanner) return;
  updateBanner.classList.remove("show");
  updateBanner.hidden = true;
};

const requestServiceWorkerUpdate = () => {
  if (!waitingServiceWorker) return;
  try {
    sessionStorage.setItem("onestep_update_applied", "1");
  } catch (_err) {
    // Ignore storage edge-cases.
  }
  hideUpdateBanner();
  waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
};

const retryServiceWorkerUpdateCheck = async () => {
  if (!swRegistrationRef) {
    showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastUpdateUnsupported);
    return;
  }
  try {
    showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastUpdateCheck);
    await swRegistrationRef.update();
    if (swRegistrationRef.waiting) {
      showUpdateBanner(swRegistrationRef.waiting);
    }
  } catch (error) {
    logClientError("sw_update_retry", error?.message || error);
    showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastUpdateCheckError);
  }
};

const validateImportedState = (state) => {
  if (!state || typeof state !== "object") return false;
  if (!Array.isArray(state.goals)) return false;
  if (!Array.isArray(state.todayTasks)) return false;
  if (typeof state.weeklyPlans !== "object") return false;
  return true;
};

const dedupeBy = (arr, toKey) => {
  const seen = new Set();
  return arr.filter((item) => {
    const key = toKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mergeStates = (current, incoming) => {
  const merged = {
    ...current,
    ...incoming,
  };
  merged.goals = dedupeBy(
    [...(current.goals || []), ...(incoming.goals || [])],
    (goal) => goal.id || `${goal.title}-${goal.difficulty}`
  );
  merged.todayTasks = dedupeBy(
    [...(current.todayTasks || []), ...(incoming.todayTasks || [])],
    (task) => task.id || `${task.goalId}-${task.date}-${task.label}`
  );
  merged.quickTasks = { ...(current.quickTasks || {}), ...(incoming.quickTasks || {}) };
  merged.quickTasksTomorrow = {
    ...(current.quickTasksTomorrow || {}),
    ...(incoming.quickTasksTomorrow || {}),
  };
  merged.sideQuests = dedupeBy(
    [...(current.sideQuests || []), ...(incoming.sideQuests || [])],
    (quest) => quest.goalId || JSON.stringify(quest)
  );
  merged.weeklyPlans = { ...(current.weeklyPlans || {}), ...(incoming.weeklyPlans || {}) };
  merged.completedDays = { ...(current.completedDays || {}), ...(incoming.completedDays || {}) };
  merged.daySummary = { ...(current.daySummary || {}), ...(incoming.daySummary || {}) };
  merged.dayTaskHistory = { ...(current.dayTaskHistory || {}), ...(incoming.dayTaskHistory || {}) };
  merged.weightEntries = { ...(current.weightEntries || {}), ...(incoming.weightEntries || {}) };
  merged.sleepEntries = { ...(current.sleepEntries || {}), ...(incoming.sleepEntries || {}) };
  merged.vocabDecks = Array.isArray(incoming.vocabDecks) && incoming.vocabDecks.length
    ? incoming.vocabDecks
    : (Array.isArray(current.vocabDecks) ? current.vocabDecks : []);
  merged.vocabSeedVersion = incoming.vocabSeedVersion || current.vocabSeedVersion || "";
  merged.vocabSettings = { ...(current.vocabSettings || {}), ...(incoming.vocabSettings || {}) };
  merged.vocabProgress = {
    byTheme: { ...(current.vocabProgress?.byTheme || {}), ...(incoming.vocabProgress?.byTheme || {}) },
    daily: { ...(current.vocabProgress?.daily || {}), ...(incoming.vocabProgress?.daily || {}) },
    streak: Math.max(Number(current.vocabProgress?.streak || 0), Number(incoming.vocabProgress?.streak || 0)),
    lastGoalHitDate: incoming.vocabProgress?.lastGoalHitDate || current.vocabProgress?.lastGoalHitDate || null,
  };
  merged.vocabRuntime = { ...(current.vocabRuntime || {}), ...(incoming.vocabRuntime || {}) };
  merged.weightTargetKg = Number.isFinite(Number(incoming.weightTargetKg))
    ? Number(incoming.weightTargetKg)
    : (Number.isFinite(Number(current.weightTargetKg)) ? Number(current.weightTargetKg) : null);
  merged.streak = Math.max(Number(current.streak || 0), Number(incoming.streak || 0));
  merged.totalDone = Math.max(Number(current.totalDone || 0), Number(incoming.totalDone || 0));
  return merged;
};

const exportBackup = () => {
  const exportISO = todayISO();
  const payload = {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    version: APP_VERSION,
    exportedAt: new Date().toISOString(),
    language: currentLanguage || "de",
    state: loadState(),
    errorLog: JSON.parse(localStorage.getItem(ERROR_LOG_KEY) || "[]"),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `onestep-backup-${todayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  localStorage.setItem(LAST_BACKUP_KEY, exportISO);
  renderBackupStatus();
  showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastExportSuccess);
};

const importBackup = async (file) => {
  if (!file) return;
  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const importedState = parsed?.state || parsed;
    if (!validateImportedState(importedState)) {
      throw new Error("invalid backup");
    }
    const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
    const overwrite = window.confirm(s.backupOverwritePrompt);
    if (!overwrite) {
      const merge = window.confirm(s.backupMergePrompt);
      if (!merge) return;
    }
    const nextState = overwrite ? importedState : mergeStates(loadState(), importedState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    const importLanguage = parsed?.language;
    if (SUPPORTED_LANGS.includes(importLanguage)) {
      currentLanguage = importLanguage;
      localStorage.setItem(LANGUAGE_KEY, importLanguage);
    }
    if (Array.isArray(parsed?.errorLog)) {
      localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(parsed.errorLog.slice(0, 20)));
    }
    localStorage.setItem(LAST_BACKUP_KEY, todayISO());

    applyStaticTranslations();
    renderAll(loadState());
    showLanguageModalIfNeeded();
    showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastImportSuccess);
  } catch (error) {
    console.warn("Backup-Import fehlgeschlagen", error);
    showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).toastImportError);
  } finally {
    if (importFileInput) importFileInput.value = "";
  }
};

const applyStaticTranslations = () => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  document.documentElement.lang = currentLanguage || "de";
  document.title = t("appTitle");
  const metaDescription = document.getElementById("meta-description");
  if (metaDescription) metaDescription.setAttribute("content", t("appDescription"));

  const byId = (id) => document.getElementById(id);
  const setText = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = value;
  };

  setText("language-modal-title", "Select Language");
  setText("language-modal-text", t("chooseLanguageText"));
  renderIntro();
  setText("tagline", t("tagline"));
  const welcomeTitle = welcomeSection?.querySelector("h1");
  const welcomeParagraphs = welcomeSection?.querySelectorAll("p");
  if (welcomeTitle) welcomeTitle.textContent = s.welcomeTitle;
  if (welcomeParagraphs?.length >= 2) {
    welcomeParagraphs[0].textContent = s.welcomeP1;
    welcomeParagraphs[1].textContent = s.welcomeP2;
  }
  setText("today-title", s.todayTitle);
  setText("tracker-checklist-btn", s.trackerChecklist);
  setText("tracker-weight-btn", s.trackerWeight);
  setText("tracker-sleep-btn", s.trackerSleep);
  setText("weight-tracker-title", s.weightTrackerTitle);
  setText("weight-tracker-hint", s.weightTrackerHint);
  if (weightInputLabel) weightInputLabel.textContent = s.weightInputLabel;
  if (weightInput) weightInput.placeholder = s.weightInputPlaceholder;
  if (weightSaveBtn) weightSaveBtn.textContent = s.weightSaveBtn;
  if (weightTargetLabel) weightTargetLabel.textContent = s.weightTargetLabel;
  if (weightTargetInput) weightTargetInput.placeholder = s.weightTargetPlaceholder;
  if (weightTargetSaveBtn) weightTargetSaveBtn.textContent = s.weightTargetSaveBtn;
  if (weightKpi7d) weightKpi7d.textContent = `${s.weightKpi7d}: --`;
  if (weightKpi30d) weightKpi30d.textContent = `${s.weightKpi30d}: --`;
  if (weightKpiDelta) weightKpiDelta.textContent = `${s.weightKpiDelta}: --`;
  if (weightTargetMeta) weightTargetMeta.textContent = s.weightTargetEmpty;
  if (sleepTrackerTitleEl) sleepTrackerTitleEl.textContent = s.sleepTrackerTitle;
  if (sleepTrackerHintEl) sleepTrackerHintEl.textContent = s.sleepTrackerHint;
  if (sleepBedLabel) sleepBedLabel.textContent = s.sleepBedLabel;
  if (sleepWakeLabel) sleepWakeLabel.textContent = s.sleepWakeLabel;
  if (sleepBedSaveBtn) sleepBedSaveBtn.textContent = s.sleepSaveBedBtn;
  if (sleepWakeSaveBtn) sleepWakeSaveBtn.textContent = s.sleepSaveWakeBtn;
  if (sleepNowBtn) sleepNowBtn.textContent = s.sleepNowBtn;
  if (sleepKpiAvg7El) sleepKpiAvg7El.textContent = `${s.sleepAvg7Label}: --`;
  if (sleepKpiConsistencyEl) sleepKpiConsistencyEl.textContent = `${s.sleepConsistencyLabel}: --`;
  if (sleepKpiStatusEl) sleepKpiStatusEl.textContent = `${s.sleepStatusLabel}: --`;
  if (sleepPendingMetaEl) sleepPendingMetaEl.textContent = `${s.sleepPendingLabel}: --`;
  if (sleepDurationMetaEl) sleepDurationMetaEl.textContent = `${s.sleepDurationLabel}: --`;
  if (sleepChartTitleEl) sleepChartTitleEl.textContent = s.sleepChartTitle;
  if (sleepChartEmptyEl) sleepChartEmptyEl.textContent = s.sleepChartEmpty;
  if (vocabTrackerTitleEl) vocabTrackerTitleEl.textContent = st("vocabTrackerTitle");
  if (vocabTrackerHintEl) vocabTrackerHintEl.textContent = st("vocabTrackerHint");
  if (vocabSessionStatusEl) vocabSessionStatusEl.textContent = st("vocabSessionIdle");
  if (vocabQuestionEl) vocabQuestionEl.textContent = st("vocabQuestionIdle");
  if (vocabWriteInput) vocabWriteInput.placeholder = st("vocabWritePlaceholder");
  if (vocabStartBtn) vocabStartBtn.textContent = st("vocabStartBtn");
  if (vocabRevealBtn) vocabRevealBtn.textContent = st("vocabRevealBtn");
  if (vocabCorrectBtn) vocabCorrectBtn.textContent = st("vocabCorrectBtn");
  if (vocabWrongBtn) vocabWrongBtn.textContent = st("vocabWrongBtn");
  if (vocabSubmitBtn) vocabSubmitBtn.textContent = st("vocabSubmitBtn");
  if (vocabNextBtn) vocabNextBtn.textContent = st("vocabNextBtn");
  if (vocabSettingsSaveBtn) vocabSettingsSaveBtn.textContent = st("vocabSaveSettings");
  if (vocabDirectionQuickLabelEl) vocabDirectionQuickLabelEl.textContent = st("vocabDirectionQuickLabel");
  if (vocabDirectionFrDeBtn) vocabDirectionFrDeBtn.textContent = st("vocabDirectionFrDe");
  if (vocabDirectionDeFrBtn) vocabDirectionDeFrBtn.textContent = st("vocabDirectionDeFr");
  if (vocabLibrarySummaryEl) vocabLibrarySummaryEl.textContent = st("vocabLibrarySummary");
  if (vocabLibrarySearchInput) vocabLibrarySearchInput.placeholder = st("vocabLibrarySearchPlaceholder");
  if (vocabLibraryMetaEl) vocabLibraryMetaEl.textContent = `0 ${st("vocabLibraryMeta")}`;
  if (vocabDirectionSelect?.options?.[0]) vocabDirectionSelect.options[0].textContent = st("vocabDirectionFrDe");
  if (vocabDirectionSelect?.options?.[1]) vocabDirectionSelect.options[1].textContent = st("vocabDirectionDeFr");
  if (vocabModeSelect?.options?.[0]) vocabModeSelect.options[0].textContent = st("vocabModeFlashcard");
  if (vocabModeSelect?.options?.[1]) vocabModeSelect.options[1].textContent = st("vocabModeQuicktest");
  if (vocabModeSelect?.options?.[2]) vocabModeSelect.options[2].textContent = st("vocabModeWrite");
  setText("weight-chart-title", s.weightChartTitle);
  setText("weight-chart-empty", s.weightChartEmpty);
  setText("goals-title", s.goalsTitle);
  setText("progress-title", s.progressTitle);
  setText("info-title", s.infoTitle);
  setText("info-subtitle", s.infoSubtitle);
  setText("info-summary-main", s.infoMainSummary);
  setText("info-main-p1", s.infoMainP1);
  setText("info-main-p2", s.infoMainP2);
  setText("info-summary-list", s.infoListSummary);
  setText("info-list-1", s.infoList1);
  setText("info-list-2", s.infoList2);
  setText("info-list-3", s.infoList3);
  setText("info-list-4", s.infoList4);
  setText("info-summary-balance", s.infoBalanceSummary);
  setText("info-balance-1", s.infoBalance1);
  setText("info-balance-2", s.infoBalance2);
  setText("info-balance-3", s.infoBalance3);
  setText("info-summary-privacy", s.infoPrivacySummary);
  setText("info-privacy-p1", s.infoPrivacyP1);
  setText("settings-version-title", s.settingsVersionTitle);
  setText("settings-system-title", s.settingsSystemTitle);
  setText("backup-title", s.backupTitle);
  setText("day-detail-title", s.dayDetailTitle);
  setText("annual-goal-title", s.annualGoalTitle);
  setText("identity-score-title", s.identityScoreTitle);
  setText("identity-score-meta", s.identityScoreMeta);
  setText("outcome-title", s.outcomeTitle);
  setText("day-offset-label", s.dayOffsetLabel);
  setText("templates-summary", s.templateSummary);
  setText("weekly-plan-title", s.weeklyPlanTitle);
  setText("weekly-plan-note", s.weeklyPlanHintMinDays);
  setText("plan-goal-label", s.planGoalLabel);
  if (updateBannerText) updateBannerText.textContent = s.updateAvailable;
  if (updateBannerNote) updateBannerNote.textContent = s.updateNote;
  if (updateBannerBtn) updateBannerBtn.textContent = s.updateNow;
  if (updateBannerRetryBtn) updateBannerRetryBtn.textContent = s.updateRetry;

  if (quickTaskInput) quickTaskInput.placeholder = t("quickTaskPlaceholder");
  if (goalInput) goalInput.placeholder = t("goalPlaceholder");
  if (quickTaskTomorrowBtn) quickTaskTomorrowBtn.textContent = t("btnTomorrow");
  const quickTaskTodayBtn = document.getElementById("quick-task-today");
  if (quickTaskTodayBtn) quickTaskTodayBtn.textContent = t("btnAdd");
  if (sideQuestForm) {
    setText("side-quest-label", t("sideQuestSelectLabel"));
    const btn = sideQuestForm.querySelector("button[type='submit']");
    if (btn) btn.textContent = t("btnSideQuestAdd");
  }
  const goalSubmit = goalForm?.querySelector("button[type='submit']");
  if (goalSubmit) goalSubmit.textContent = t("btnAdd");
  if (applyOffsetBtn) applyOffsetBtn.textContent = s.applyBtn;
  if (checkUpdatesBtn) checkUpdatesBtn.textContent = s.checkUpdatesBtn;
  if (resetBtn) resetBtn.textContent = s.resetBtn;
  if (exportDataBtn) exportDataBtn.textContent = s.exportData;
  if (importDataBtn) importDataBtn.textContent = s.importData;
  renderBackupStatus();
  if (simulatedDateEl) simulatedDateEl.textContent = `${s.simPrefix}: --`;
  if (progressWeekRateEl) progressWeekRateEl.textContent = `${s.progressWeekRate}: 0%`;
  if (progressMonthRateEl) progressMonthRateEl.textContent = `${s.progressMonthRate}: 0%`;
  if (progressBestDayEl) progressBestDayEl.textContent = `${s.progressBestDay}: -`;
  if (goalHitRateEl) goalHitRateEl.textContent = `${s.goalHitRateLabel}: 0%`;
  if (completionTrendEl) completionTrendEl.textContent = `${s.completionTrendLabel}: ${s.completionTrendStable}`;
  if (retentionSnapshotEl) retentionSnapshotEl.textContent = `${s.retentionLabel}: -- / --`;
  if (annualGoalValueEl) annualGoalValueEl.textContent = s.annualGoalEmpty;
  if (annualGoalMetaEl) annualGoalMetaEl.textContent = "";
  if (annualGoalStatsEl) {
    annualGoalStatsEl.textContent = `${s.annualGoalYearDone}: 0 · ${s.annualGoalYearActiveDays}: 0`;
  }

  const legalLinks = document.querySelectorAll("#info-summary-privacy ~ p a");
  if (legalLinks.length >= 2) {
    legalLinks[0].textContent = s.legalPrivacy;
    legalLinks[1].textContent = s.legalImprint;
  }

  const legend = document.querySelector(".calendar-legend .soft-note");
  if (legend) legend.textContent = s.calLegend;
  const statLabels = document.querySelectorAll(".stat-label");
  if (statLabels.length >= 4) {
    statLabels[0].textContent = s.statStreak;
    statLabels[1].textContent = s.statTotal;
    statLabels[2].textContent = s.statActive;
    statLabels[3].textContent = s.statPerfect;
  }
  const modeToggleLabel = modeSwitch?.closest("label")?.querySelector("span");
  if (modeToggleLabel) modeToggleLabel.textContent = s.modeToggle;
  const settingsLanguageLabel = document.getElementById("settings-language-label");
  if (settingsLanguageLabel) settingsLanguageLabel.textContent = s.settingsLanguage;
  if (languageSelect) languageSelect.value = currentLanguage || "de";
  if (modeHint) modeHint.textContent = s.modeHint;
  const testTitleEl = document.querySelector(".test-title");
  if (testTitleEl) testTitleEl.textContent = s.testTitle;
  const footerSpans = document.querySelectorAll(".footer span");
  if (footerSpans.length >= 2) {
    footerSpans[0].textContent = s.footer1;
    footerSpans[1].textContent = s.footer2;
  }

  if (timePickerTitleEl) timePickerTitleEl.textContent = s.timePickerTitle;
  if (timeHourTitleEl) timeHourTitleEl.textContent = s.timePickerHour;
  if (timeMinuteTitleEl) timeMinuteTitleEl.textContent = s.timePickerMinute;
  if (goalTimeApplyBtn) goalTimeApplyBtn.textContent = s.timePickerApply;
  setGoalTimeValue(goalTimeInput?.value || "12:00");

  const navLabels = document.querySelectorAll(".nav-label");
  if (navLabels.length === 4) {
    navLabels[0].textContent = s.navToday;
    navLabels[1].textContent = s.navGoals;
    navLabels[2].textContent = s.navProgress;
    navLabels[3].textContent = s.navSettings;
  }
};

const getOnboardingDay = (state) => {
  if (!state.onboardingStartDate) return 1;
  const day = daysBetween(
    state.onboardingStartDate,
    todayISO(state.simulationOffsetDays)
  ) + 1;
  return Math.max(1, day);
};

const getFeatureAccess = (state) => {
  const day = getOnboardingDay(state);
  const weeklyPlanDay = FAST_ONBOARDING_ENABLED ? 2 : 4;
  const quickTasksDay = FAST_ONBOARDING_ENABLED ? 3 : 7;
  const sideQuestDay = FAST_ONBOARDING_ENABLED ? 4 : 9;
  const onboardingTotal = FAST_ONBOARDING_ENABLED ? FAST_ONBOARDING_TOTAL_DAYS : 12;
  return {
    day,
    weeklyPlan: day >= weeklyPlanDay,
    quickTasks: day >= quickTasksDay,
    sideQuest: day >= sideQuestDay,
    onboardingActive: day <= onboardingTotal,
    onboardingTotal,
    unlockDays: {
      weeklyPlan: weeklyPlanDay,
      quickTasks: quickTasksDay,
      sideQuest: sideQuestDay,
    },
  };
};

const applyFeatureGating = (state) => {
  const access = getFeatureAccess(state);

  if (weeklyPlanSection) {
    weeklyPlanSection.style.display = access.weeklyPlan ? "block" : "none";
  }
  if (quickTaskForm) {
    quickTaskForm.style.display = access.quickTasks ? "grid" : "none";
  }
};

// ---------------------------
// Task-Logik: Unlock-Rhythmus
// ---------------------------
const shouldUnlockNewTask = (state) => {
  // Wenn noch nie freigeschaltet wurde, ist es sofort möglich.
  if (!state.lastTaskUnlockDate) return true;

  const access = getFeatureAccess(state);
  const requiredDays = FAST_ONBOARDING_ENABLED && access.onboardingActive ? 1 : 3;
  const diff = daysBetween(
    state.lastTaskUnlockDate,
    todayISO(state.simulationOffsetDays)
  );
  return diff >= requiredDays;
};

const pickTaskFromGoals = (state) => {
  // Wählt ein Goal aus, das heute noch nicht in der Checkliste ist.
  const usedGoalIds = new Set(state.todayTasks.map((t) => t.goalId));
  const today = todayISO(state.simulationOffsetDays);
  const weekdayKey = weekdayKeyFromISO(today);
  const candidates = state.goals.filter((g) => {
    if (usedGoalIds.has(g.id)) return false;
    const plan = getPlanForGoal(state, g.id);
    if (!planHasAnyActive(plan)) return true;
    const entry = plan[weekdayKey];
    if (!entry) return true;
    if (!isPlanEntryActive(entry)) return false;
    return true;
  });
  if (candidates.length === 0) return null;

  // Zufällige Auswahl, damit die Erfahrung abwechslungsreich bleibt.
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
};

const appendGoalTaskToState = (state, goal) => {
  const today = todayISO(state.simulationOffsetDays);
  if (state.todayTasks.some((task) => task.goalId === goal.id && task.date === today)) return false;
  const weekdayKey = weekdayKeyFromISO(today);
  const plan = getPlanForGoal(state, goal.id);
  const entry = plan[weekdayKey];
  const hasActivePlan = planHasAnyActive(plan);
  state.todayTasks.push({
    id: crypto.randomUUID(),
    goalId: goal.id,
    label: getLabelForToday(goal, entry, hasActivePlan),
    difficulty: goal.difficulty,
    isRestDay: hasActivePlan && !isPlanEntryActive(entry),
    done: false,
    doneAt: null,
    date: today,
  });

  state.sideQuests = (state.sideQuests || []).filter((q) => q.goalId !== goal.id);
  Object.keys(state.sideQuestChecks || {}).forEach((dateKey) => {
    if (!state.sideQuestChecks[dateKey]) return;
    delete state.sideQuestChecks[dateKey][goal.id];
    if (Object.keys(state.sideQuestChecks[dateKey]).length === 0) {
      delete state.sideQuestChecks[dateKey];
    }
  });

  state.lastTaskUnlockDate = today;
  return true;
};

const ensureTodayTasks = (state) => {
  // Wenn das Datum wechselt, bleiben die Tasks sichtbar,
  // aber wir markieren sie als neue Tagesliste.
  const today = todayISO(state.simulationOffsetDays);
  const weekdayKey = weekdayKeyFromISO(today);
  const previousDate = state.todayTasks?.[0]?.date || Object.values(state.quickTasks || {})[0]?.date || null;
  if (previousDate && previousDate !== today) {
    captureDayTaskHistory(state, previousDate);
  }

  // Wenn wir noch keine Tasks für heute haben, setzen wir das Datum neu.
  if (!state.todayTasks.length || state.todayTasks[0].date !== today) {
    const goalMap = new Map(state.goals.map((g) => [g.id, g]));
    state.todayTasks = state.todayTasks
      .map((task) => {
        const goal = goalMap.get(task.goalId);
        if (!goal) return null;
        const plan = getPlanForGoal(state, goal.id);
        const entry = plan[weekdayKey];
        const hasActivePlan = planHasAnyActive(plan);
        const label = getLabelForToday(goal, entry, hasActivePlan);
        return {
          ...task,
          label,
          isRestDay: hasActivePlan && !isPlanEntryActive(entry),
          date: today,
          done: false,
          doneAt: null,
        };
      })
      .filter(Boolean);

    // Quick tasks are daily-only; move tomorrow -> today, clear tomorrow.
    state.quickTasks = state.quickTasksTomorrow || {};
    state.quickTasksTomorrow = {};
  }

  // Erster Start: genau eine Aufgabe aus Zielen hinzufügen.
  // Schutz: nur einmal initial seeden, niemals erneut an Folgetagen.
  if (state.goals.length > 0 && state.todayTasks.length === 0 && !state.lastTaskUnlockDate) {
    const firstGoal = state.goals[0];
    const plan = getPlanForGoal(state, firstGoal.id);
    const entry = plan[weekdayKey];
    const hasActivePlan = planHasAnyActive(plan);
    const label = getLabelForToday(firstGoal, entry, hasActivePlan);
    state.todayTasks.push({
      id: crypto.randomUUID(),
      goalId: firstGoal.id,
      label,
      difficulty: firstGoal.difficulty,
      isRestDay: hasActivePlan && !isPlanEntryActive(entry),
      done: false,
      doneAt: null,
      date: today,
    });
    state.lastTaskUnlockDate = today;
  }

};

// ---------------------------
// Streak-Logik
// ---------------------------
const updateStreak = (state) => {
  const today = todayISO(state.simulationOffsetDays);

  if (!state.lastActiveDate) {
    state.lastActiveDate = today;
    state.streak = 1;
    return;
  }

  const diff = daysBetween(state.lastActiveDate, today);

  if (diff === 0) return; // gleicher Tag, keine Änderung

  if (diff === 1) {
    state.streak += 1;
  } else {
    // Wenn mehr als ein Tag vergangen ist, Neustart der Serie.
    state.streak = 1;
  }

  state.lastActiveDate = today;
};

// ---------------------------
// Rendering
// ---------------------------
const renderWelcome = (state) => {
  welcomeSection.style.display = state.goals.length === 0 ? "block" : "none";
};

const parseWeightValue = (raw) => {
  const normalized = String(raw || "").replace(",", ".").trim();
  if (!normalized) return null;
  const value = Number(normalized);
  if (!Number.isFinite(value)) return null;
  if (value < 20 || value > 400) return null;
  return Math.round(value * 10) / 10;
};

const parseClockTime = (raw) => {
  const value = String(raw || "").trim();
  if (!/^\d{2}:\d{2}$/.test(value)) return null;
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
};

const getSleepDurationMinutes = (bedIso, entry) => {
  if (!entry) return null;
  const bed = parseClockTime(entry.bed);
  const wake = parseClockTime(entry.wake);
  if (!bed || !wake) return null;
  const [bedHour, bedMinute] = bed.split(":").map(Number);
  const [wakeHour, wakeMinute] = wake.split(":").map(Number);
  const bedMinutes = (bedHour * 60) + bedMinute;
  const wakeMinutes = (wakeHour * 60) + wakeMinute;
  const wakeIso = typeof entry.wakeDate === "string" ? entry.wakeDate : bedIso;
  const dayDelta = Math.max(0, daysBetween(bedIso, wakeIso));
  let total = (dayDelta * 24 * 60) + (wakeMinutes - bedMinutes);
  if (total <= 0) total += 24 * 60;
  if (total < 120 || total > 16 * 60) return null;
  return total;
};

const formatSleepDuration = (minutes) => {
  if (!Number.isFinite(minutes) || minutes <= 0) return "--";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

const getSleepEntriesSorted = (state) =>
  Object.entries(state.sleepEntries || {})
    .map(([iso, entry]) => ({ iso, entry }))
    .filter(({ entry }) => entry && (entry.bed || entry.wake))
    .sort((a, b) => a.iso.localeCompare(b.iso));

const getLatestOpenSleepEntry = (state) => {
  const entries = getSleepEntriesSorted(state).reverse();
  return entries.find(({ entry }) => parseClockTime(entry.bed) && !parseClockTime(entry.wake)) || null;
};

const renderSleepChart = (entries) => {
  if (!sleepChartSvg || !sleepChartEmptyEl) return;
  if (!entries.length) {
    sleepChartSvg.innerHTML = "";
    sleepChartEmptyEl.hidden = false;
    return;
  }
  const recent = entries.slice(-21);
  const values = recent.map((entry) => entry.hours);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 0.5;
    maxValue += 0.5;
  }
  const width = 640;
  const height = 220;
  const padLeft = 34;
  const padRight = 16;
  const padTop = 14;
  const padBottom = 28;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const denominator = recent.length > 1 ? recent.length - 1 : 1;
  const range = maxValue - minValue;
  const points = recent.map((entry, index) => {
    const x = padLeft + ((index / denominator) * plotWidth);
    const y = padTop + (((maxValue - entry.hours) / range) * plotHeight);
    return { ...entry, x, y };
  });
  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const circles = points
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.2" />`)
    .join("");
  const firstDate = formatISODate(recent[0].iso);
  const lastDate = formatISODate(recent[recent.length - 1].iso);
  sleepChartSvg.innerHTML = `
    <line class="weight-grid-line" x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" />
    <line class="weight-grid-line" x1="${padLeft}" y1="${padTop + (plotHeight / 2)}" x2="${width - padRight}" y2="${padTop + (plotHeight / 2)}" />
    <line class="weight-grid-line" x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" />
    <polyline class="weight-line" points="${polyline}" />
    <g class="weight-dots">${circles}</g>
    <text class="weight-axis-label" x="${padLeft}" y="${height - 6}">${firstDate}</text>
    <text class="weight-axis-label weight-axis-label-end" x="${width - padRight}" y="${height - 6}">${lastDate}</text>
    <text class="weight-value-label" x="${padLeft}" y="${padTop - 2}">${maxValue.toFixed(1)} h</text>
    <text class="weight-value-label" x="${padLeft}" y="${height - padBottom + 14}">${minValue.toFixed(1)} h</text>
  `;
  sleepChartEmptyEl.hidden = true;
};

const renderSleepTracker = (state) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const today = todayISO(state.simulationOffsetDays);
  const todayEntry = state.sleepEntries?.[today] || {};
  const openEntry = getLatestOpenSleepEntry(state);
  const openIso = openEntry?.iso || null;

  if (sleepBedInput) sleepBedInput.value = parseClockTime(todayEntry.bed) || "";
  if (sleepWakeInput) sleepWakeInput.value = openEntry ? "" : (parseClockTime(todayEntry.wake) || "");

  const completeEntries = getSleepEntriesSorted(state)
    .map(({ iso, entry }) => {
      const minutes = getSleepDurationMinutes(iso, entry);
      if (!Number.isFinite(minutes)) return null;
      return { iso, minutes, hours: Math.round((minutes / 60) * 10) / 10, entry };
    })
    .filter(Boolean);
  const recent7 = completeEntries.slice(-7);
  const avgMinutes = recent7.length
    ? Math.round(recent7.reduce((sum, item) => sum + item.minutes, 0) / recent7.length)
    : null;
  const consistency = recent7.length
    ? Math.round((recent7.filter((item) => {
      const bed = parseClockTime(item.entry.bed);
      if (!bed) return false;
      const [h, m] = bed.split(":").map(Number);
      const bedtimeMinutes = (h * 60) + m;
      const firstBed = parseClockTime(recent7[0].entry.bed);
      if (!firstBed) return false;
      const [fh, fm] = firstBed.split(":").map(Number);
      const firstMinutes = (fh * 60) + fm;
      return Math.abs(bedtimeMinutes - firstMinutes) <= 60;
    }).length / recent7.length) * 100)
    : null;

  if (sleepKpiAvg7El) {
    sleepKpiAvg7El.textContent = `${s.sleepAvg7Label}: ${avgMinutes === null ? "--" : formatSleepDuration(avgMinutes)}`;
  }
  if (sleepKpiConsistencyEl) {
    sleepKpiConsistencyEl.textContent = `${s.sleepConsistencyLabel}: ${consistency === null ? "--" : `${consistency}%`}`;
  }
  if (sleepKpiStatusEl) {
    sleepKpiStatusEl.textContent = `${s.sleepStatusLabel}: ${openIso ? s.sleepStatusOpen : s.sleepStatusDone}`;
  }
  if (sleepPendingMetaEl) {
    sleepPendingMetaEl.textContent = `${s.sleepPendingLabel}: ${openIso ? formatISODate(openIso) : "--"}`;
  }
  if (sleepDurationMetaEl) {
    const latestDuration = completeEntries[completeEntries.length - 1]?.minutes ?? null;
    sleepDurationMetaEl.textContent = `${s.sleepDurationLabel}: ${latestDuration === null ? "--" : formatSleepDuration(latestDuration)}`;
  }
  renderSleepChart(completeEntries);
};

const saveSleepBedtime = (rawValue) => {
  const parsed = parseClockTime(rawValue);
  if (!parsed) {
    showToast(t("toastSleepInvalid"));
    return;
  }
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  state.sleepEntries = state.sleepEntries || {};
  const current = state.sleepEntries[today] || {};
  state.sleepEntries[today] = {
    ...current,
    bed: parsed,
  };
  saveState(state);
  renderAll(state);
  showToast(t("toastSleepBedSaved"));
};

const saveSleepWakeTime = (rawValue) => {
  const parsed = parseClockTime(rawValue);
  if (!parsed) {
    showToast(t("toastSleepInvalid"));
    return;
  }
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  state.sleepEntries = state.sleepEntries || {};
  const open = getLatestOpenSleepEntry(state);
  const targetIso = open?.iso || today;
  const current = state.sleepEntries[targetIso] || {};
  if (!parseClockTime(current.bed)) {
    showToast(t("toastSleepInvalid"));
    return;
  }
  state.sleepEntries[targetIso] = {
    ...current,
    wake: parsed,
    wakeDate: today,
  };
  saveState(state);
  renderAll(state);
  showToast(t("toastSleepWakeSaved"));
};

const renderWeightChart = (entries) => {
  if (!weightChartSvg || !weightChartEmpty) return;
  if (!entries.length) {
    weightChartSvg.innerHTML = "";
    weightChartEmpty.hidden = false;
    return;
  }

  const recent = entries.slice(-21);
  const values = recent.map((entry) => entry.value);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  }

  const width = 640;
  const height = 220;
  const padLeft = 34;
  const padRight = 16;
  const padTop = 14;
  const padBottom = 28;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;
  const denominator = recent.length > 1 ? recent.length - 1 : 1;
  const range = maxValue - minValue;
  const points = recent.map((entry, index) => {
    const x = padLeft + ((index / denominator) * plotWidth);
    const y = padTop + (((maxValue - entry.value) / range) * plotHeight);
    return { ...entry, x, y };
  });
  const polyline = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const firstDate = formatISODate(recent[0].iso);
  const lastDate = formatISODate(recent[recent.length - 1].iso);

  const circles = points
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.2" />`)
    .join("");

  weightChartSvg.innerHTML = `
    <line class="weight-grid-line" x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}" />
    <line class="weight-grid-line" x1="${padLeft}" y1="${padTop + (plotHeight / 2)}" x2="${width - padRight}" y2="${padTop + (plotHeight / 2)}" />
    <line class="weight-grid-line" x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" />
    <polyline class="weight-line" points="${polyline}" />
    <g class="weight-dots">${circles}</g>
    <text class="weight-axis-label" x="${padLeft}" y="${height - 6}">${firstDate}</text>
    <text class="weight-axis-label weight-axis-label-end" x="${width - padRight}" y="${height - 6}">${lastDate}</text>
    <text class="weight-value-label" x="${padLeft}" y="${padTop - 2}">${maxValue.toFixed(1)} kg</text>
    <text class="weight-value-label" x="${padLeft}" y="${height - padBottom + 14}">${minValue.toFixed(1)} kg</text>
  `;
  weightChartEmpty.hidden = true;
};

const renderWeightTracker = (state) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const today = todayISO(state.simulationOffsetDays);
  if (weightDateInfo) weightDateInfo.textContent = `${s.weightDatePrefix}: ${formatISODate(today)}`;
  if (weightInput) {
    const todayValue = state.weightEntries?.[today];
    if (Number.isFinite(todayValue)) {
      weightInput.value = Number(todayValue).toFixed(1);
    } else {
      weightInput.value = "";
    }
  }
  const entries = Object.entries(state.weightEntries || {})
    .map(([iso, value]) => ({ iso, value: Number(value) }))
    .filter((entry) => Number.isFinite(entry.value))
    .sort((a, b) => a.iso.localeCompare(b.iso));
  const avg = (subset) => {
    if (!subset.length) return null;
    const sum = subset.reduce((total, entry) => total + entry.value, 0);
    return Math.round((sum / subset.length) * 10) / 10;
  };
  const avg7 = avg(entries.slice(-7));
  const avg30 = avg(entries.slice(-30));
  const first = entries[0]?.value ?? null;
  const current = entries[entries.length - 1]?.value ?? null;
  const delta = first === null || current === null ? null : Math.round((current - first) * 10) / 10;
  if (weightKpi7d) {
    weightKpi7d.textContent = `${s.weightKpi7d}: ${avg7 === null ? "--" : `${avg7.toFixed(1)} kg`}`;
  }
  if (weightKpi30d) {
    weightKpi30d.textContent = `${s.weightKpi30d}: ${avg30 === null ? "--" : `${avg30.toFixed(1)} kg`}`;
  }
  if (weightKpiDelta) {
    weightKpiDelta.textContent = `${s.weightKpiDelta}: ${delta === null ? "--" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg`}`;
  }
  if (weightTargetInput) {
    weightTargetInput.value = Number.isFinite(state.weightTargetKg) ? Number(state.weightTargetKg).toFixed(1) : "";
  }
  if (weightTargetMeta) {
    if (!Number.isFinite(state.weightTargetKg)) {
      weightTargetMeta.textContent = s.weightTargetEmpty;
    } else if (!Number.isFinite(current)) {
      weightTargetMeta.textContent = `${s.weightTargetMeta}: --`;
    } else {
      const remaining = Math.round((current - Number(state.weightTargetKg)) * 10) / 10;
      weightTargetMeta.textContent = `${s.weightTargetMeta}: ${remaining > 0 ? "+" : ""}${remaining.toFixed(1)} kg`;
    }
  }
  renderWeightChart(entries);
};

const saveTodayWeight = (rawValue) => {
  const parsed = parseWeightValue(rawValue);
  if (parsed === null) {
    showToast(t("toastWeightInvalid"));
    return;
  }
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  state.weightEntries = state.weightEntries || {};
  state.weightEntries[today] = parsed;
  saveState(state);
  renderAll(state);
  showToast(t("toastWeightSaved"));
};

const saveWeightTarget = (rawValue) => {
  const normalized = String(rawValue || "").replace(",", ".").trim();
  let parsed = null;
  if (normalized) {
    parsed = parseWeightValue(normalized);
    if (parsed === null) {
      showToast(t("toastWeightInvalid"));
      return;
    }
  }
  const state = loadState();
  state.weightTargetKg = parsed;
  saveState(state);
  renderAll(state);
  showToast(t("toastWeightTargetSaved"));
};

let vocabSeedLoading = false;

const buildEmptyVocabProgress = () => ({
  byTheme: {},
  daily: {},
  streak: 0,
  lastGoalHitDate: null,
});

const pickRandomItems = (items, count) => {
  const source = [...items];
  const picked = [];
  while (source.length > 0 && picked.length < count) {
    const idx = Math.floor(Math.random() * source.length);
    picked.push(source.splice(idx, 1)[0]);
  }
  return picked;
};

const getVocabThemeById = (state, themeId) =>
  (state.vocabDecks || []).find((theme) => theme.id === themeId) || null;

const ensureVocabSeedLoaded = (state) => {
  if (state.vocabSeedVersion && Array.isArray(state.vocabDecks) && state.vocabDecks.length) return;
  if (vocabSeedLoading) return;
  vocabSeedLoading = true;
  fetch(VOCAB_SEED_URL)
    .then((res) => {
      if (!res.ok) throw new Error(`seed-load-${res.status}`);
      return res.json();
    })
    .then((seed) => {
      const next = loadState();
      next.vocabDecks = Array.isArray(seed?.themes) ? seed.themes : [];
      next.vocabSeedVersion = String(seed?.version || "1");
      next.vocabProgress = next.vocabProgress || buildEmptyVocabProgress();
      if (!next.vocabRuntime?.activeThemeId && next.vocabDecks.length) {
        next.vocabRuntime = next.vocabRuntime || {};
        next.vocabRuntime.activeThemeId = next.vocabDecks[0].id;
      }
      saveState(next);
      renderAll(next);
      showToast(st("toastVocabSeedLoaded"));
    })
    .catch((error) => {
      console.warn("Vokabel-Seed konnte nicht geladen werden", error);
      showToast(st("vocabSeedError"));
    })
    .finally(() => {
      vocabSeedLoading = false;
    });
};

const getPromptAndAnswer = (item, direction) => {
  if (direction === "de-fr") {
    return { prompt: item.de, answer: item.fr };
  }
  return { prompt: item.fr, answer: item.de };
};

const setVocabDirection = (direction) => {
  const state = loadState();
  state.vocabSettings = state.vocabSettings || {};
  state.vocabSettings.direction = direction === "de-fr" ? "de-fr" : "fr-de";
  saveState(state);
  renderAll(state);
};

const renderVocabLibrary = (state, theme, direction) => {
  if (!vocabLibraryListEl || !vocabLibraryMetaEl) return;
  const query = (vocabLibrarySearchInput?.value || "").trim().toLowerCase();
  const items = Array.isArray(theme?.items) ? theme.items : [];
  const filtered = items.filter((item) => {
    if (!query) return true;
    return String(item.fr || "").toLowerCase().includes(query)
      || String(item.de || "").toLowerCase().includes(query);
  });

  vocabLibraryListEl.innerHTML = "";
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "soft-note";
    empty.textContent = st("vocabLibraryEmpty");
    vocabLibraryListEl.appendChild(empty);
    vocabLibraryMetaEl.textContent = `0 ${st("vocabLibraryMeta")}`;
    return;
  }

  filtered.forEach((item) => {
    const row = document.createElement("div");
    row.className = "vocab-library-item";
    const left = document.createElement("span");
    const sep = document.createElement("span");
    const right = document.createElement("span");
    if (direction === "de-fr") {
      left.textContent = item.de;
      right.textContent = item.fr;
    } else {
      left.textContent = item.fr;
      right.textContent = item.de;
    }
    sep.textContent = "->";
    row.appendChild(left);
    row.appendChild(sep);
    row.appendChild(right);
    vocabLibraryListEl.appendChild(row);
  });
  vocabLibraryMetaEl.textContent = `${filtered.length} ${st("vocabLibraryMeta")}`;
};

const completeVocabSession = (state) => {
  const session = state.vocabRuntime?.session;
  if (!session || session.completed) return;
  session.completed = true;
  const endTs = Date.now();
  const durationSec = Math.max(1, Math.round((endTs - Number(session.startedAt || endTs)) / 1000));
  session.durationSec = durationSec;
  const today = todayISO(state.simulationOffsetDays);
  const goal = Number(state.vocabSettings?.dailyGoalCorrect || 10);
  state.vocabProgress.streak = VocabLogic?.computeVocabStreak
    ? VocabLogic.computeVocabStreak(state.vocabProgress, today, goal)
    : 0;
  state.vocabProgress.lastGoalHitDate = Number(state.vocabProgress?.daily?.[today]?.correct || 0) >= goal
    ? today
    : state.vocabProgress.lastGoalHitDate;
  state.vocabRuntime.lastSummary = {
    correct: session.correct,
    wrong: session.wrong,
    durationSec,
    streak: state.vocabProgress.streak,
    dailyDone: Number(state.vocabProgress?.daily?.[today]?.correct || 0) >= goal,
  };
  state.vocabProgress.daily[today] = state.vocabProgress.daily[today] || { correct: 0, wrong: 0, sessions: 0 };
  state.vocabProgress.daily[today].sessions += 1;
};

const updateVocabSessionByResult = (state, item, correct) => {
  if (!VocabLogic) return;
  const session = state.vocabRuntime?.session;
  if (!session || session.completed) return;
  const today = todayISO(state.simulationOffsetDays);
  state.vocabProgress = VocabLogic.updateVocabProgress(state.vocabProgress, {
    themeId: session.themeId,
    dateISO: today,
    itemId: item.id,
    correct,
  });
  session.correct += correct ? 1 : 0;
  session.wrong += correct ? 0 : 1;
  session.asked += 1;
  session.lastResult = correct ? "correct" : "wrong";
  if (session.asked >= session.total || session.currentIndex >= session.queue.length - 1) {
    completeVocabSession(state);
  } else {
    session.currentIndex += 1;
    session.revealed = false;
    session.lastResult = null;
    session.mcqOptions = [];
  }
};

const startVocabSession = () => {
  const state = loadState();
  const runtime = state.vocabRuntime || {};
  const settings = state.vocabSettings || {};
  const theme = getVocabThemeById(state, runtime.activeThemeId);
  if (!theme || !Array.isArray(theme.items) || !theme.items.length || !VocabLogic) return;
  const total = Math.min(Math.max(1, Number(settings.dailyGoalCorrect || 10)), theme.items.length);
  const queue = pickRandomItems(theme.items, total);
  const requestedMode = runtime.activeMode || "flashcard";
  const sessionMode = requestedMode === "write" && !settings.writeModeEnabled ? "flashcard" : requestedMode;
  state.vocabRuntime = {
    ...runtime,
    session: {
      themeId: theme.id,
      mode: sessionMode,
      direction: settings.direction || "fr-de",
      queue,
      total,
      currentIndex: 0,
      asked: 0,
      correct: 0,
      wrong: 0,
      startedAt: Date.now(),
      durationSec: 0,
      completed: false,
      revealed: false,
      mcqOptions: [],
      lastResult: null,
    },
  };
  saveState(state);
  renderAll(state);
};

const submitVocabFlashcard = (isCorrect) => {
  const state = loadState();
  const session = state.vocabRuntime?.session;
  if (!session || session.completed) return;
  const item = session.queue[session.currentIndex];
  if (!item) return;
  updateVocabSessionByResult(state, item, Boolean(isCorrect));
  saveState(state);
  renderAll(state);
};

const submitVocabQuickTest = (selectedValue) => {
  const state = loadState();
  const session = state.vocabRuntime?.session;
  if (!session || session.completed || !VocabLogic) return;
  const item = session.queue[session.currentIndex];
  if (!item) return;
  const pair = getPromptAndAnswer(item, session.direction);
  const result = VocabLogic.scoreAnswer("quicktest", {
    selected: selectedValue,
    expected: pair.answer,
  });
  updateVocabSessionByResult(state, item, result.correct);
  saveState(state);
  renderAll(state);
};

const submitVocabWrite = () => {
  const state = loadState();
  const session = state.vocabRuntime?.session;
  if (!session || session.completed || !VocabLogic) return;
  const item = session.queue[session.currentIndex];
  if (!item) return;
  const input = (vocabWriteInput?.value || "").trim();
  const pair = getPromptAndAnswer(item, session.direction);
  const result = VocabLogic.scoreAnswer("write", {
    input,
    expected: pair.answer,
    tolerance: state.vocabSettings?.fuzzyTolerance || 1,
  });
  updateVocabSessionByResult(state, item, result.correct);
  saveState(state);
  renderAll(state);
};

const saveVocabSettings = () => {
  const state = loadState();
  const runtime = state.vocabRuntime || {};
  const nextModeRaw = (vocabModeSelect?.value || "flashcard");
  const nextMode = ["flashcard", "quicktest", "write"].includes(nextModeRaw) ? nextModeRaw : "flashcard";
  const writeEnabled = Boolean(vocabWriteEnableInput?.checked);
  if (nextMode === "write" && !writeEnabled) {
    showToast(st("toastVocabModeWriteDisabled"));
    if (vocabModeSelect) vocabModeSelect.value = "flashcard";
    runtime.activeMode = "flashcard";
  } else {
    runtime.activeMode = nextMode;
  }
  runtime.activeThemeId = vocabThemeSelect?.value || runtime.activeThemeId || "";
  state.vocabRuntime = runtime;
  state.vocabSettings = {
    dailyGoalCorrect: Math.max(1, Math.round(Number(vocabDailyGoalInput?.value || 10))),
    direction: vocabDirectionSelect?.value === "de-fr" ? "de-fr" : "fr-de",
    writeModeEnabled: writeEnabled,
    fuzzyTolerance: 1,
  };
  saveState(state);
  renderAll(state);
  showToast(st("toastVocabSettingsSaved"));
};

const renderVocabTracker = (state) => {
  if (!vocabTrackerPanel) return;
  ensureVocabSeedLoaded(state);
  const runtime = state.vocabRuntime || {};
  const settings = state.vocabSettings || {};
  const progress = state.vocabProgress || buildEmptyVocabProgress();
  const today = todayISO(state.simulationOffsetDays);

  if (!state.vocabSeedVersion || !(state.vocabDecks || []).length) {
    if (vocabQuestionEl) vocabQuestionEl.textContent = st("vocabSeedLoading");
    if (vocabSessionStatusEl) vocabSessionStatusEl.textContent = st("vocabSeedLoading");
    return;
  }

  if (!runtime.activeThemeId && state.vocabDecks[0]?.id) {
    runtime.activeThemeId = state.vocabDecks[0].id;
    state.vocabRuntime = runtime;
    saveState(state);
  }

  const theme = getVocabThemeById(state, runtime.activeThemeId) || state.vocabDecks[0];
  const themeProgress = progress.byTheme?.[theme?.id] || { learnedIds: [], correctCount: 0, wrongCount: 0, lastTrainedDate: null };
  const daily = progress.daily?.[today] || { correct: 0, wrong: 0, sessions: 0 };
  const goal = Number(settings.dailyGoalCorrect || 10);
  const doneToday = Number(daily.correct || 0) >= goal;
  const streak = Number(progress.streak || 0);

  if (vocabThemeSelect) {
    const selected = vocabThemeSelect.value;
    vocabThemeSelect.innerHTML = "";
    (state.vocabDecks || []).forEach((deck) => {
      const option = document.createElement("option");
      option.value = deck.id;
      option.textContent = deck.title;
      vocabThemeSelect.appendChild(option);
    });
    vocabThemeSelect.value = runtime.activeThemeId || selected || state.vocabDecks[0]?.id || "";
  }
  if (vocabModeSelect) {
    const selectedMode = runtime.activeMode || "flashcard";
    vocabModeSelect.value = selectedMode;
  }
  if (vocabDailyGoalInput) vocabDailyGoalInput.value = String(goal);
  const activeDirection = settings.direction === "de-fr" ? "de-fr" : "fr-de";
  if (vocabDirectionSelect) vocabDirectionSelect.value = activeDirection;
  if (vocabDirectionFrDeBtn) {
    const active = activeDirection === "fr-de";
    vocabDirectionFrDeBtn.classList.toggle("is-active", active);
    vocabDirectionFrDeBtn.setAttribute("aria-selected", active ? "true" : "false");
  }
  if (vocabDirectionDeFrBtn) {
    const active = activeDirection === "de-fr";
    vocabDirectionDeFrBtn.classList.toggle("is-active", active);
    vocabDirectionDeFrBtn.setAttribute("aria-selected", active ? "true" : "false");
  }
  if (vocabWriteEnableInput) vocabWriteEnableInput.checked = Boolean(settings.writeModeEnabled);
  renderVocabLibrary(state, theme, activeDirection);

  if (vocabKpiDailyEl) vocabKpiDailyEl.textContent = `${st("vocabKpiDaily")}: ${daily.correct} / ${goal} (${doneToday ? st("vocabDoneToday") : st("vocabNotDoneToday")})`;
  if (vocabKpiStreakEl) vocabKpiStreakEl.textContent = `${st("vocabKpiStreak")}: ${streak}`;
  if (vocabKpiThemeEl) vocabKpiThemeEl.textContent = `${st("vocabKpiTheme")}: ${theme?.title || st("vocabNoTheme")}`;

  if (vocabThemeProgressEl) {
    vocabThemeProgressEl.textContent = `${st("vocabProgressLabel")} ${theme?.title || "--"}: ${themeProgress.learnedIds.length} / ${theme?.items?.length || 0} · ${st("vocabLastTrained")}: ${themeProgress.lastTrainedDate ? formatISODate(themeProgress.lastTrainedDate) : "--"}`;
  }

  const session = runtime.session;
  if (!session) {
    if (vocabSessionStatusEl) vocabSessionStatusEl.textContent = st("vocabSessionReady");
    if (vocabQuestionEl) vocabQuestionEl.textContent = st("vocabQuestionIdle");
    if (vocabAnswerEl) {
      vocabAnswerEl.hidden = true;
      vocabAnswerEl.textContent = "";
    }
    if (vocabOptionsEl) {
      vocabOptionsEl.hidden = true;
      vocabOptionsEl.innerHTML = "";
    }
    if (vocabWriteWrapEl) vocabWriteWrapEl.hidden = true;
    if (vocabSummaryEl) {
      const summary = runtime.lastSummary;
      if (summary) {
        vocabSummaryEl.hidden = false;
        vocabSummaryEl.textContent = `${st("vocabSummaryPrefix")}: ${st("vocabSummaryCorrect")} ${summary.correct}, ${st("vocabSummaryWrong")} ${summary.wrong}, ${st("vocabSummaryTime")} ${summary.durationSec}s, ${st("vocabSummaryStreak")} ${summary.streak} (${summary.dailyDone ? st("vocabDoneToday") : st("vocabNotDoneToday")})`;
      } else {
        vocabSummaryEl.hidden = true;
      }
    }
    if (vocabStartBtn) vocabStartBtn.hidden = false;
    if (vocabRevealBtn) vocabRevealBtn.hidden = true;
    if (vocabCorrectBtn) vocabCorrectBtn.hidden = true;
    if (vocabWrongBtn) vocabWrongBtn.hidden = true;
    if (vocabSubmitBtn) vocabSubmitBtn.hidden = true;
    if (vocabNextBtn) vocabNextBtn.hidden = true;
    return;
  }

  if (vocabSummaryEl) vocabSummaryEl.hidden = true;
  if (vocabStartBtn) vocabStartBtn.hidden = true;
  const item = session.queue[session.currentIndex];
  if (!item) return;
  const pair = getPromptAndAnswer(item, session.direction);
  if (vocabSessionStatusEl) {
    vocabSessionStatusEl.textContent = `${st("vocabSessionActive")}: ${session.currentIndex + 1}/${session.total} · ${st("vocabSummaryCorrect")} ${session.correct} · ${st("vocabSummaryWrong")} ${session.wrong}`;
  }
  if (vocabQuestionEl) vocabQuestionEl.textContent = pair.prompt;

  const mode = session.mode;
  if (mode === "flashcard") {
    if (vocabAnswerEl) {
      vocabAnswerEl.hidden = !session.revealed;
      vocabAnswerEl.textContent = pair.answer;
    }
    if (vocabOptionsEl) {
      vocabOptionsEl.hidden = true;
      vocabOptionsEl.innerHTML = "";
    }
    if (vocabWriteWrapEl) vocabWriteWrapEl.hidden = true;
    if (vocabRevealBtn) vocabRevealBtn.hidden = session.revealed;
    if (vocabCorrectBtn) vocabCorrectBtn.hidden = !session.revealed;
    if (vocabWrongBtn) vocabWrongBtn.hidden = !session.revealed;
    if (vocabSubmitBtn) vocabSubmitBtn.hidden = true;
    if (vocabNextBtn) vocabNextBtn.hidden = true;
    return;
  }

  if (mode === "quicktest") {
    if (!Array.isArray(session.mcqOptions) || session.mcqOptions.length < 4) {
      session.mcqOptions = VocabLogic?.buildMcqOptions ? VocabLogic.buildMcqOptions(item, session.queue, session.direction, 4) : [];
      saveState(state);
    }
    if (vocabAnswerEl) {
      vocabAnswerEl.hidden = true;
      vocabAnswerEl.textContent = "";
    }
    if (vocabWriteWrapEl) vocabWriteWrapEl.hidden = true;
    if (vocabOptionsEl) {
      vocabOptionsEl.hidden = false;
      vocabOptionsEl.innerHTML = "";
      session.mcqOptions.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn ghost vocab-option-btn";
        btn.textContent = option;
        btn.addEventListener("click", () => submitVocabQuickTest(option));
        vocabOptionsEl.appendChild(btn);
      });
    }
    if (vocabRevealBtn) vocabRevealBtn.hidden = true;
    if (vocabCorrectBtn) vocabCorrectBtn.hidden = true;
    if (vocabWrongBtn) vocabWrongBtn.hidden = true;
    if (vocabSubmitBtn) vocabSubmitBtn.hidden = true;
    if (vocabNextBtn) vocabNextBtn.hidden = true;
    return;
  }

  if (vocabAnswerEl) {
    vocabAnswerEl.hidden = true;
    vocabAnswerEl.textContent = "";
  }
  if (vocabOptionsEl) {
    vocabOptionsEl.hidden = true;
    vocabOptionsEl.innerHTML = "";
  }
  if (vocabWriteWrapEl) vocabWriteWrapEl.hidden = false;
  if (vocabRevealBtn) vocabRevealBtn.hidden = true;
  if (vocabCorrectBtn) vocabCorrectBtn.hidden = true;
  if (vocabWrongBtn) vocabWrongBtn.hidden = true;
  if (vocabSubmitBtn) vocabSubmitBtn.hidden = false;
  if (vocabNextBtn) vocabNextBtn.hidden = true;
};

const renderToday = (state) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const activeTracker = ["checklist", "weight", "sleep"].includes(state.todayTracker)
    ? state.todayTracker
    : "checklist";
  if (trackerChecklistBtn) {
    trackerChecklistBtn.classList.toggle("is-active", activeTracker === "checklist");
    trackerChecklistBtn.setAttribute("aria-selected", activeTracker === "checklist" ? "true" : "false");
  }
  if (trackerWeightBtn) {
    trackerWeightBtn.classList.toggle("is-active", activeTracker === "weight");
    trackerWeightBtn.setAttribute("aria-selected", activeTracker === "weight" ? "true" : "false");
  }
  if (trackerSleepBtn) {
    trackerSleepBtn.classList.toggle("is-active", activeTracker === "sleep");
    trackerSleepBtn.setAttribute("aria-selected", activeTracker === "sleep" ? "true" : "false");
  }
  if (quickTaskForm) quickTaskForm.hidden = activeTracker !== "checklist";
  if (unlockControls) unlockControls.hidden = activeTracker !== "checklist";
  if (todayList) todayList.hidden = activeTracker !== "checklist";
  if (sideQuestForm) sideQuestForm.hidden = activeTracker !== "checklist";
  if (weightTrackerPanel) weightTrackerPanel.hidden = activeTracker !== "weight";
  if (sleepTrackerPanel) sleepTrackerPanel.hidden = activeTracker !== "sleep";

  if (activeTracker === "weight") {
    if (todayCount) todayCount.textContent = s.weightTrackerMeta;
    if (todaySmartPlanEl) {
      todaySmartPlanEl.textContent = `${s.todaySmartPlanPrefix}: ${s.identityRecommendationMid}`;
    }
    renderWeightTracker(state);
    return;
  }
  if (activeTracker === "sleep") {
    if (todayCount) todayCount.textContent = s.sleepTrackerTitle;
    if (todaySmartPlanEl) {
      todaySmartPlanEl.textContent = `${s.todaySmartPlanPrefix}: ${s.sleepTrackerHint}`;
    }
    renderSleepTracker(state);
    return;
  }
  todayList.innerHTML = "";

  const quickTaskEntries = Object.values(state.quickTasks || {});
  const quickTomorrowEntries = Object.values(state.quickTasksTomorrow || {});
  const sideQuestEntries = state.sideQuests || [];
  const sideQuestFeatureEnabled = getFeatureAccess(state).sideQuest;
  const today = todayISO(state.simulationOffsetDays);
  const nextTask = [...state.todayTasks]
    .filter((task) => task.date === today && !task.done)
    .sort((a, b) => timeToMinutes(a.difficulty) - timeToMinutes(b.difficulty))[0];
  if (todaySmartPlanEl) {
    if (nextTask) {
      todaySmartPlanEl.textContent = `${s.todaySmartPlanPrefix}: ${nextTask.label} (${difficultyLabel(nextTask.difficulty)})`;
    } else {
      todaySmartPlanEl.textContent = `${s.todaySmartPlanPrefix}: ${s.identityRecommendationHigh}`;
    }
  }
  const actionableMainTasks = state.todayTasks.filter(
    (t) => t.date === today && !isRestDayForTask(state, t, today) && !t.isRestDay
  );
  const mainTasksDone =
    actionableMainTasks.length > 0 && actionableMainTasks.every((t) => t.done);
  const showSideQuestUI = sideQuestFeatureEnabled && mainTasksDone;
  if (sideQuestForm) {
    sideQuestForm.classList.toggle("is-collapsed", !showSideQuestUI);
    sideQuestForm.setAttribute("aria-hidden", showSideQuestUI ? "false" : "true");
    if (showSideQuestUI && !sideQuestVisibleCache) {
      sideQuestForm.classList.remove("unlock-celebrate");
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
        setTimeout(() => {
          sideQuestForm.classList.remove("unlock-celebrate");
          void sideQuestForm.offsetHeight;
          sideQuestForm.classList.add("unlock-celebrate");
          setTimeout(() => sideQuestForm.classList.remove("unlock-celebrate"), 1850);
        }, SIDE_QUEST_REVEAL_SCROLL_MS);
      });
    }
    if (!showSideQuestUI) {
      sideQuestForm.classList.remove("unlock-celebrate");
    }
  }
  sideQuestVisibleCache = showSideQuestUI;
  if (showSideQuestUI) {
    renderSideQuestOptions(state);
  }

  if (
    state.todayTasks.length === 0 &&
    quickTaskEntries.length === 0 &&
    quickTomorrowEntries.length === 0 &&
    sideQuestEntries.length === 0
  ) {
    const empty = document.createElement("li");
    empty.textContent = t("emptyToday");
    todayList.appendChild(empty);
  } else {
    const sortedTasks = [...state.todayTasks].sort((a, b) => {
      const aOrder = timeToMinutes(a.difficulty);
      const bOrder = timeToMinutes(b.difficulty);
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.label.localeCompare(b.label, "de");
    });
    sortedTasks.forEach((task) => {
      const restDay = isRestDayForTask(state, task, today) || task.isRestDay;
      const li = document.createElement("li");
      const label = document.createElement("label");
      label.className = "neon-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = restDay ? true : task.done;
      checkbox.disabled = restDay;

      const frame = document.createElement("div");
      frame.className = "neon-checkbox__frame";

      const box = document.createElement("div");
      box.className = "neon-checkbox__box";

      const checkContainer = document.createElement("div");
      checkContainer.className = "neon-checkbox__check-container";

      const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      check.setAttribute("class", "neon-checkbox__check");
      check.setAttribute("viewBox", "0 0 24 24");
      const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      checkPath.setAttribute("d", "M5 12l5 5L19 7");
      check.appendChild(checkPath);

      const glow = document.createElement("div");
      glow.className = "neon-checkbox__glow";

      const borders = document.createElement("div");
      borders.className = "neon-checkbox__borders";
      for (let i = 0; i < 4; i += 1) {
        borders.appendChild(document.createElement("span"));
      }

      const particles = document.createElement("div");
      particles.className = "neon-checkbox__particles";
      for (let i = 0; i < 12; i += 1) {
        particles.appendChild(document.createElement("span"));
      }

      const rings = document.createElement("div");
      rings.className = "neon-checkbox__rings";
      for (let i = 0; i < 3; i += 1) {
        const ring = document.createElement("div");
        ring.className = "ring";
        rings.appendChild(ring);
      }

      const sparks = document.createElement("div");
      sparks.className = "neon-checkbox__sparks";
      for (let i = 0; i < 4; i += 1) {
        sparks.appendChild(document.createElement("span"));
      }

      checkContainer.appendChild(check);
      frame.appendChild(box);
      frame.appendChild(checkContainer);
      frame.appendChild(glow);
      frame.appendChild(borders);
      frame.appendChild(particles);
      frame.appendChild(rings);
      frame.appendChild(sparks);

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.label;
      if (task.done && !restDay) text.classList.add("done");
      if (restDay) text.classList.add("rest-day");

      const badge = document.createElement("button");
      badge.type = "button";
      badge.className = `difficulty ${toneClassForTime(task.difficulty)}`;
      badge.classList.add("time-edit-trigger");
      badge.textContent = difficultyLabel(task.difficulty);
      badge.title = `${t("timePickerTitle")}: ${difficultyLabel(task.difficulty)}`;
      badge.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (task.goalId) startGoalTimeEdit(task.goalId);
      });

      label.appendChild(checkbox);
      label.appendChild(frame);
      label.appendChild(text);
      li.appendChild(label);
      li.appendChild(badge);
      li.dataset.taskId = task.id;
      if (!restDay) {
        checkbox.addEventListener("change", () => toggleTask(task.id, text, label));
      }
      todayList.appendChild(li);
    });

    quickTaskEntries.forEach((task) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      label.className = "neon-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      const frame = document.createElement("div");
      frame.className = "neon-checkbox__frame";

      const box = document.createElement("div");
      box.className = "neon-checkbox__box";

      const checkContainer = document.createElement("div");
      checkContainer.className = "neon-checkbox__check-container";

      const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      check.setAttribute("class", "neon-checkbox__check");
      check.setAttribute("viewBox", "0 0 24 24");
      const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      checkPath.setAttribute("d", "M5 12l5 5L19 7");
      check.appendChild(checkPath);

      const glow = document.createElement("div");
      glow.className = "neon-checkbox__glow";

      const borders = document.createElement("div");
      borders.className = "neon-checkbox__borders";
      for (let i = 0; i < 4; i += 1) {
        borders.appendChild(document.createElement("span"));
      }

      const particles = document.createElement("div");
      particles.className = "neon-checkbox__particles";
      for (let i = 0; i < 12; i += 1) {
        particles.appendChild(document.createElement("span"));
      }

      const rings = document.createElement("div");
      rings.className = "neon-checkbox__rings";
      for (let i = 0; i < 3; i += 1) {
        const ring = document.createElement("div");
        ring.className = "ring";
        rings.appendChild(ring);
      }

      const sparks = document.createElement("div");
      sparks.className = "neon-checkbox__sparks";
      for (let i = 0; i < 4; i += 1) {
        sparks.appendChild(document.createElement("span"));
      }

      checkContainer.appendChild(check);
      frame.appendChild(box);
      frame.appendChild(checkContainer);
      frame.appendChild(glow);
      frame.appendChild(borders);
      frame.appendChild(particles);
      frame.appendChild(rings);
      frame.appendChild(sparks);

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.label;
      if (task.done) text.classList.add("done");

      const badge = document.createElement("span");
      badge.className = "difficulty noon";
      badge.textContent = t("badgeOneTime");

      label.appendChild(checkbox);
      label.appendChild(frame);
      label.appendChild(text);
      li.appendChild(label);
      li.appendChild(badge);
      li.dataset.taskId = task.id;
      checkbox.addEventListener("change", () => toggleQuickTask(task.id, text, label));
      todayList.appendChild(li);
    });

    if (showSideQuestUI && sideQuestEntries.length > 0) {
      const head = document.createElement("li");
      head.className = "subhead";
      head.textContent = t("sideQuestHead");
      todayList.appendChild(head);
    }

    if (showSideQuestUI) {
      sideQuestEntries.forEach((quest) => {
        const goal = state.goals.find((g) => g.id === quest.goalId);
        if (!goal) return;
        const weekdayKey = weekdayKeyFromISO(today);
        const plan = getPlanForGoal(state, goal.id);
        const entry = plan[weekdayKey];
        const hasActivePlan = planHasAnyActive(plan);
        const label = getLabelForToday(goal, entry, hasActivePlan);
        const restDay = hasActivePlan && !isPlanEntryActive(entry);
        const done = restDay
          ? true
          : !!state.sideQuestChecks?.[today]?.[goal.id];

        const li = document.createElement("li");
        li.classList.add("side-quest-item");
        li.classList.add("side-quest-animated");
        const labelEl = document.createElement("label");
        labelEl.className = "neon-checkbox";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = done;
        checkbox.disabled = !!restDay;

        const frame = document.createElement("div");
        frame.className = "neon-checkbox__frame";

        const box = document.createElement("div");
        box.className = "neon-checkbox__box";

        const checkContainer = document.createElement("div");
        checkContainer.className = "neon-checkbox__check-container";

        const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        check.setAttribute("class", "neon-checkbox__check");
        check.setAttribute("viewBox", "0 0 24 24");
        const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        checkPath.setAttribute("d", "M5 12l5 5L19 7");
        check.appendChild(checkPath);

        const glow = document.createElement("div");
        glow.className = "neon-checkbox__glow";

        const borders = document.createElement("div");
        borders.className = "neon-checkbox__borders";
        for (let i = 0; i < 4; i += 1) {
          borders.appendChild(document.createElement("span"));
        }

        const particles = document.createElement("div");
        particles.className = "neon-checkbox__particles";
        for (let i = 0; i < 12; i += 1) {
          particles.appendChild(document.createElement("span"));
        }

        const rings = document.createElement("div");
        rings.className = "neon-checkbox__rings";
        for (let i = 0; i < 3; i += 1) {
          const ring = document.createElement("div");
          ring.className = "ring";
          rings.appendChild(ring);
        }

        const sparks = document.createElement("div");
        sparks.className = "neon-checkbox__sparks";
        for (let i = 0; i < 4; i += 1) {
          sparks.appendChild(document.createElement("span"));
        }

        checkContainer.appendChild(check);
        frame.appendChild(box);
        frame.appendChild(checkContainer);
        frame.appendChild(glow);
        frame.appendChild(borders);
        frame.appendChild(particles);
        frame.appendChild(rings);
        frame.appendChild(sparks);

        const text = document.createElement("span");
        text.className = "task-text";
        text.textContent = label;
        if (done && !restDay) text.classList.add("done");
        if (restDay) text.classList.add("rest-day");

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn ghost side-quest-remove";
        removeBtn.textContent = (STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).btnRemove;
        removeBtn.addEventListener("click", () => removeSideQuest(goal.id));

        labelEl.appendChild(checkbox);
        labelEl.appendChild(frame);
        labelEl.appendChild(text);
        li.appendChild(labelEl);
        li.appendChild(removeBtn);
        if (!restDay) {
          checkbox.addEventListener("change", () =>
            toggleSideQuest(goal.id, text, labelEl)
          );
        }
        todayList.appendChild(li);
      });
    }

    if (quickTomorrowEntries.length > 0) {
      const head = document.createElement("li");
      head.className = "subhead";
      head.textContent = t("tomorrowHead");
      todayList.appendChild(head);
    }

    quickTomorrowEntries.forEach((task) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      label.className = "neon-checkbox";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      const frame = document.createElement("div");
      frame.className = "neon-checkbox__frame";

      const box = document.createElement("div");
      box.className = "neon-checkbox__box";

      const checkContainer = document.createElement("div");
      checkContainer.className = "neon-checkbox__check-container";

      const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      check.setAttribute("class", "neon-checkbox__check");
      check.setAttribute("viewBox", "0 0 24 24");
      const checkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      checkPath.setAttribute("d", "M5 12l5 5L19 7");
      check.appendChild(checkPath);

      const glow = document.createElement("div");
      glow.className = "neon-checkbox__glow";

      const borders = document.createElement("div");
      borders.className = "neon-checkbox__borders";
      for (let i = 0; i < 4; i += 1) {
        borders.appendChild(document.createElement("span"));
      }

      const particles = document.createElement("div");
      particles.className = "neon-checkbox__particles";
      for (let i = 0; i < 12; i += 1) {
        particles.appendChild(document.createElement("span"));
      }

      const rings = document.createElement("div");
      rings.className = "neon-checkbox__rings";
      for (let i = 0; i < 3; i += 1) {
        const ring = document.createElement("div");
        ring.className = "ring";
        rings.appendChild(ring);
      }

      const sparks = document.createElement("div");
      sparks.className = "neon-checkbox__sparks";
      for (let i = 0; i < 4; i += 1) {
        sparks.appendChild(document.createElement("span"));
      }

      checkContainer.appendChild(check);
      frame.appendChild(box);
      frame.appendChild(checkContainer);
      frame.appendChild(glow);
      frame.appendChild(borders);
      frame.appendChild(particles);
      frame.appendChild(rings);
      frame.appendChild(sparks);

      const text = document.createElement("span");
      text.className = "task-text";
      text.textContent = task.label;
      if (task.done) text.classList.add("done");

      const badge = document.createElement("span");
      badge.className = "difficulty noon";
      badge.textContent = t("badgeTomorrow");

      label.appendChild(checkbox);
      label.appendChild(frame);
      label.appendChild(text);
      li.appendChild(label);
      li.appendChild(badge);
      li.dataset.taskId = task.id;
      checkbox.addEventListener("change", () => toggleQuickTaskTomorrow(task.id, text, label));
      todayList.appendChild(li);
    });
  }

  todayCount.textContent = `${state.todayTasks.length + quickTaskEntries.length} ${t("todayCountWord")}`;
};

const renderGoals = (state) => {
  goalsList.innerHTML = "";
  const activeGoalIds = new Set(state.todayTasks.map((task) => task.goalId));
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;

  if (state.goals.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = t("emptyGoals");
    goalsList.appendChild(empty);
    return;
  }

  state.goals.forEach((goal) => {
    const li = document.createElement("li");
    li.draggable = true;
    li.dataset.goalId = goal.id;
    li.title = s.dragHint;
    li.addEventListener("dragstart", () => {
      draggingGoalId = goal.id;
      li.classList.add("dragging-goal");
    });
    li.addEventListener("dragend", () => {
      draggingGoalId = null;
      li.classList.remove("dragging-goal");
    });
    li.addEventListener("dragover", (event) => event.preventDefault());
    li.addEventListener("drop", (event) => {
      event.preventDefault();
      if (!draggingGoalId || draggingGoalId === goal.id) return;
      reorderGoal(draggingGoalId, goal.id);
    });

    if (activeGoalIds.has(goal.id)) li.classList.add("active-goal");
    const title = document.createElement("span");
    title.textContent = goal.title;
    title.className = "goal-title";

    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = `difficulty ${toneClassForTime(goal.difficulty)}`;
    badge.textContent = difficultyLabel(goal.difficulty);
    badge.classList.add("time-edit-trigger");
    badge.title = `${t("timePickerTitle")}: ${difficultyLabel(goal.difficulty)}`;
    badge.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      startGoalTimeEdit(goal.id);
    });
    if (editingGoalId === goal.id) {
      const input = document.createElement("input");
      input.type = "text";
      input.value = goal.title;
      input.className = "goal-edit-input";

      const saveBtn = document.createElement("button");
      saveBtn.type = "button";
      saveBtn.className = "btn goal-edit-save";
      saveBtn.textContent = s.btnSave;
      saveBtn.addEventListener("click", () => finishEditGoal(goal.id, input.value));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn ghost goal-delete";
      removeBtn.textContent = s.btnRemove;
      removeBtn.disabled = false;
      removeBtn.title = s.deleteGoalTitle;
      removeBtn.addEventListener("click", () => deleteGoal(goal.id));

      li.appendChild(input);
      li.appendChild(saveBtn);
      li.appendChild(removeBtn);
    } else {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn ghost goal-edit";
      editBtn.textContent = s.btnEdit;
      editBtn.addEventListener("click", () => startEditGoal(goal.id));

      li.appendChild(title);
      li.appendChild(badge);
      li.appendChild(editBtn);
    }
    goalsList.appendChild(li);
  });
};

const renderProgress = (state) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  streakEl.textContent = state.streak;
  totalDoneEl.textContent = state.totalDone;
  const currentISO = todayISO(state.simulationOffsetDays);
  const weeklyStats = getWeeklyCompletionStats(state, currentISO);
  const records = getPersonalWeeklyRecords(state);
  const weekRate = getWeeklyRate(state, currentISO);
  const monthRate = getMonthlyRate(state, currentISO);
  const bestWeekday = getBestWeekday(state);
  if (activeWeekEl) {
    activeWeekEl.textContent = String(weeklyStats.activeDays);
  }
  if (perfectWeekEl) {
    perfectWeekEl.textContent = String(weeklyStats.perfectDays);
  }
  if (perfectRecordEl) {
    perfectRecordEl.textContent = `${t("record")}: ${records.perfectRecord}`;
  }
  if (progressWeekRateEl) {
    progressWeekRateEl.textContent = `${s.progressWeekRate}: ${weekRate}%`;
  }
  if (progressMonthRateEl) {
    progressMonthRateEl.textContent = `${s.progressMonthRate}: ${monthRate}%`;
  }
  if (progressBestDayEl) {
    progressBestDayEl.textContent = `${s.progressBestDay}: ${bestWeekday}`;
  }
  const identityScore = getIdentityScore(state, currentISO);
  if (identityScoreTitleEl) identityScoreTitleEl.textContent = s.identityScoreTitle;
  if (identityScoreValueEl) identityScoreValueEl.textContent = `${identityScore}/100`;
  if (identityScoreMetaEl) identityScoreMetaEl.textContent = s.identityScoreMeta;
  if (identityRecommendationEl) {
    let rec = s.identityRecommendationMid;
    if (identityScore >= 75) rec = s.identityRecommendationHigh;
    else if (identityScore < 45) rec = s.identityRecommendationLow;
    identityRecommendationEl.textContent = `${s.identityRecommendationPrefix}: ${rec}`;
  }
  const recent30 = Object.entries(state.daySummary || {})
    .filter(([iso]) => {
      const diff = daysBetween(iso, currentISO);
      return diff >= 0 && diff < 30;
    })
    .map(([, summary]) => summary)
    .filter((summary) => summary && summary.total > 0);
  const recent15 = Object.entries(state.daySummary || {})
    .filter(([iso]) => {
      const diff = daysBetween(iso, currentISO);
      return diff >= 0 && diff < 15;
    })
    .map(([, summary]) => summary)
    .filter((summary) => summary && summary.total > 0);
  const prev15 = Object.entries(state.daySummary || {})
    .filter(([iso]) => {
      const diff = daysBetween(iso, currentISO);
      return diff >= 15 && diff < 30;
    })
    .map(([, summary]) => summary)
    .filter((summary) => summary && summary.total > 0);
  const calcRate = (arr) => {
    if (!arr.length) return 0;
    const done = arr.reduce((sum, summary) => sum + Number(summary.done || 0), 0);
    const total = arr.reduce((sum, summary) => sum + Number(summary.total || 0), 0);
    if (!total) return 0;
    return Math.round((done / total) * 100);
  };
  const hitRate30 = calcRate(recent30);
  const current15Rate = calcRate(recent15);
  const previous15Rate = calcRate(prev15);
  let trendLabel = s.completionTrendStable;
  if (current15Rate - previous15Rate >= 4) trendLabel = s.completionTrendUp;
  if (previous15Rate - current15Rate >= 4) trendLabel = s.completionTrendDown;
  if (goalHitRateEl) goalHitRateEl.textContent = `${s.goalHitRateLabel}: ${hitRate30}%`;
  if (completionTrendEl) completionTrendEl.textContent = `${s.completionTrendLabel}: ${trendLabel}`;
  const startIso = state.onboardingStartDate || currentISO;
  const d1Iso = isoDateFromLocalDate(new Date(new Date(`${startIso}T00:00:00`).getTime() + (1 * 86400000)));
  const d7Iso = isoDateFromLocalDate(new Date(new Date(`${startIso}T00:00:00`).getTime() + (7 * 86400000)));
  const d1Done = Number(state.daySummary?.[d1Iso]?.done || 0) > 0;
  const d7Done = Number(state.daySummary?.[d7Iso]?.done || 0) > 0;
  if (retentionSnapshotEl) {
    retentionSnapshotEl.textContent = `${s.retentionLabel}: ${d1Done ? "1" : "0"} / ${d7Done ? "1" : "0"}`;
  }
  if (todaySmartPlanEl) {
    todaySmartPlanEl.textContent = `${s.todaySmartPlanPrefix}: ${s.identityRecommendationMid}`;
  }

  const currentYear = new Date(`${currentISO}T00:00:00`).getFullYear();
  let yearDone = 0;
  let yearActiveDays = 0;
  Object.entries(state.daySummary || {}).forEach(([iso, summary]) => {
    if (!iso.startsWith(`${currentYear}-`)) return;
    const done = Number(summary?.done || 0);
    yearDone += done;
    if (done > 0) yearActiveDays += 1;
  });
  if (annualGoalTitleEl) {
    annualGoalTitleEl.textContent = s.annualGoalTitle;
  }
  if (annualGoalValueEl) {
    annualGoalValueEl.textContent = state.annualGoal?.trim() || s.annualGoalEmpty;
  }
  if (annualGoalMetaEl) {
    annualGoalMetaEl.textContent = state.annualGoalUpdatedAt
      ? `${s.annualGoalSince}: ${formatISODate(state.annualGoalUpdatedAt)}`
      : "";
  }
  if (annualGoalStatsEl) {
    annualGoalStatsEl.textContent = `${s.annualGoalYearDone}: ${yearDone} · ${s.annualGoalYearActiveDays}: ${yearActiveDays}`;
  }

  const message = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
  motivationEl.textContent = message;
};

const isTabAllowed = (target) => {
  if (tutorialCompletedCache) return true;
  if (tutorialStepCache <= 1) return target === "goals";
  if (tutorialStepCache === 2) return target === "goals" || target === "today";
  return true;
};

const applyTutorial = (state) => {
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  const today = todayISO(state.simulationOffsetDays);
  const actionable = state.todayTasks.filter(
    (t) => !isRestDayForTask(state, t, today) && !t.isRestDay
  );
  const quickList = Object.values(state.quickTasks || {});
  const anyDone = actionable.some((t) => t.done) || quickList.some((t) => t.done);
  const hasLanguage = !!currentLanguage;
  const hasGoal = state.goals.length > 0;
  const firstTaskDone = anyDone;

  if (!state.tutorialCompleted) {
    if (state.tutorialStep === 1 && state.goals.length > 0) {
      state.tutorialStep = 2;
    }
    if (state.tutorialStep === 2 && anyDone) {
      state.tutorialStep = 3;
    }
    if (state.tutorialStep >= 3) {
      state.tutorialCompleted = true;
    }
  }

  tutorialStepCache = state.tutorialStep;
  tutorialCompletedCache = state.tutorialCompleted;

  const access = getFeatureAccess(state);
  const { weeklyPlan, quickTasks, sideQuest } = access.unlockDays;
  const unlockMessages = {
    [weeklyPlan]: {
      title: t("unlockWeekTitle"),
      text: t("unlockWeekText"),
    },
    [quickTasks]: {
      title: t("unlockQuickTitle"),
      text: t("unlockQuickText"),
    },
    [sideQuest]: {
      title: t("unlockSideTitle"),
      text: t("unlockSideText"),
    },
  };

  if (tutorialSection) {
    if (tutorialChecklist) {
      const showChecklist = !state.tutorialCompleted || access.day < 4;
      tutorialChecklist.style.display = showChecklist ? "" : "none";
      tutorialChecklist.innerHTML = "";
      if (showChecklist) {
        [
          { label: s.tutorialCheck1, done: hasLanguage },
          { label: s.tutorialCheck2, done: hasGoal },
          { label: s.tutorialCheck3, done: firstTaskDone },
        ].forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item.label;
          li.classList.toggle("is-done", item.done);
          tutorialChecklist.appendChild(li);
        });
      }
    }
    if (!state.tutorialCompleted) {
      tutorialSection.style.display = "block";
      tutorialSection.classList.remove("unlock-highlight");
      if (tutorialTitle) tutorialTitle.textContent = t("tutorialStart");
      if (tutorialStepLabel) tutorialStepLabel.textContent = `${t("tutorialStep")} ${state.tutorialStep}/3`;
      if (tutorialText) {
        if (state.tutorialStep === 1) {
          tutorialText.textContent = t("tutorialS1");
        } else if (state.tutorialStep === 2) {
          tutorialText.textContent = t("tutorialS2");
        } else {
          tutorialText.textContent = t("tutorialDone");
        }
      }
      if (tutorialCtaBtn) {
        tutorialCtaBtn.hidden = false;
        if (!hasLanguage) {
          tutorialCtaBtn.textContent = s.tutorialCta1;
          tutorialCtaBtn.dataset.action = "language";
          tutorialCtaBtn.dataset.target = "";
        } else if (!hasGoal) {
          tutorialCtaBtn.textContent = s.tutorialCta2;
          tutorialCtaBtn.dataset.action = "tab";
          tutorialCtaBtn.dataset.target = "goals";
        } else {
          tutorialCtaBtn.textContent = s.tutorialCta3;
          tutorialCtaBtn.dataset.action = "tab";
          tutorialCtaBtn.dataset.target = "today";
        }
      }
    } else if (access.onboardingActive) {
      tutorialSection.style.display = "block";
      const unlock = unlockMessages[access.day];
      tutorialSection.classList.toggle("unlock-highlight", !!unlock);
      if (tutorialStepLabel) tutorialStepLabel.textContent = `${t("dayWord")} ${access.day}/${access.onboardingTotal}`;
      if (unlock) {
        if (tutorialTitle) tutorialTitle.textContent = unlock.title;
        if (tutorialText) tutorialText.textContent = unlock.text;
      } else {
        if (tutorialTitle) tutorialTitle.textContent = t("onboardingTitle");
        if (tutorialText) {
          let onboardingPhaseText = t("onboardingText");
          if (access.day <= 3) onboardingPhaseText = t("onboardingTextEarly");
          else if (access.day >= 4 && access.day <= 6) onboardingPhaseText = t("onboardingTextWeekPlan");
          else if (access.day <= 8) onboardingPhaseText = t("onboardingTextMid");
          else onboardingPhaseText = t("onboardingTextLate");
          tutorialText.textContent = onboardingPhaseText;
        }
      }
      if (tutorialCtaBtn) tutorialCtaBtn.hidden = true;
    } else {
      tutorialSection.style.display = "none";
      tutorialSection.classList.remove("unlock-highlight");
      if (tutorialCtaBtn) tutorialCtaBtn.hidden = true;
    }
  }

  navItems.forEach((btn) => {
    const allowed = isTabAllowed(btn.dataset.target);
    btn.disabled = !allowed;
  });

  return state;
};

const applyMode = (state) => {
  if (modeSwitch) {
    modeSwitch.checked = !!state.proEnabled;
  }
  if (modeHint) {
    modeHint.style.display = "block";
  }
  setVersionLabel(state);
};

const renderAll = (state) => {
  if (lastStaticLanguageApplied !== currentLanguage) {
    applyStaticTranslations();
    lastStaticLanguageApplied = currentLanguage;
  }
  renderBackupStatus();
  renderWelcome(state);
  renderUnlock(state);
  renderToday(state);
  renderGoals(state);
  renderWeeklyPlan(state);
  renderTemplates();
  renderProgress(state);
  renderCalendar(state);
  renderSimulatedDate(state);
  applyFeatureGating(state);
  captureDayTaskHistory(state);
  const updated = applyTutorial(state);
  applyMode(updated);
  saveState(updated);
  setActiveTab(currentTab);
};

// ---------------------------
// Actions
// ---------------------------
const getInlineGoalWeeklyPlan = () => {
  const raw = {
    mon: goalPlanMonInput?.value || "",
    tue: goalPlanTueInput?.value || "",
    wed: goalPlanWedInput?.value || "",
    thu: goalPlanThuInput?.value || "",
    fri: goalPlanFriInput?.value || "",
    sat: goalPlanSatInput?.value || "",
    sun: goalPlanSunInput?.value || "",
  };
  const normalized = {};
  Object.entries(raw).forEach(([key, value]) => {
    const text = String(value || "").trim();
    normalized[key] = { text };
  });
  const hasAny = Object.values(normalized).some((entry) => (entry?.text || "").trim().length > 0);
  return hasAny ? normalized : null;
};

const clearInlineGoalWeeklyPlan = () => {
  [
    goalPlanMonInput,
    goalPlanTueInput,
    goalPlanWedInput,
    goalPlanThuInput,
    goalPlanFriInput,
    goalPlanSatInput,
    goalPlanSunInput,
  ].forEach((input) => {
    if (input) input.value = "";
  });
};

const addGoal = (title, difficulty, weeklyPlan = null) => {
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  const hadNoGoals = state.goals.length === 0;
  const goalId = crypto.randomUUID();

  if (!state.onboardingStartDate) {
    state.onboardingStartDate = today;
  }

  state.goals.push({
    id: goalId,
    title,
    difficulty: normalizeGoalTime(difficulty),
    createdAt: today,
  });
  if (weeklyPlan && typeof weeklyPlan === "object") {
    state.weeklyPlans = state.weeklyPlans || {};
    state.weeklyPlans[goalId] = weeklyPlan;
  }

  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);
  triggerHaptic(14);
  showToast(t("toastGoalAdded"));
  trackEvent("goal_added", {
    difficulty: normalizeGoalTime(difficulty),
    goals_count: state.goals.length,
  });
  if (hadNoGoals) {
    setActiveTab("today");
  }
};

const updateGoalTime = (goalId, timeValue) => {
  const state = loadState();
  const normalized = normalizeGoalTime(timeValue);
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.difficulty = normalized;

  state.todayTasks = state.todayTasks.map((task) => (
    task.goalId === goalId
      ? { ...task, difficulty: normalized }
      : task
  ));

  saveState(state);
  renderAll(state);
  showToast(t("toastGoalTimeUpdated"));
};

const startGoalTimeEdit = (goalId) => {
  const state = loadState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  editingGoalTimeId = goal.id;
  if (goalTimePicker) goalTimePicker.dataset.editGoalId = goal.id;
  setGoalTimeValue(goal.difficulty);
  setActiveTab("goals");
  toggleGoalTimePicker(true);
};

const updateMainDaySummary = (state) => {
  const today = todayISO(state.simulationOffsetDays);
  const actionableMainTasks = state.todayTasks.filter(
    (t) => t.date === today && !isRestDayForTask(state, t, today) && !t.isRestDay
  );
  const total = actionableMainTasks.length;
  const done = actionableMainTasks.filter((t) => t.done).length;

  if (total === 0) {
    delete state.daySummary[today];
    delete state.completedDays[today];
    return;
  }

  state.daySummary[today] = { done, total };
  if (done >= total) {
    state.completedDays[today] = true;
  } else {
    delete state.completedDays[today];
  }
};

const toggleTask = (taskId, textEl, labelEl) => {
  const state = loadState();
  const task = state.todayTasks.find((t) => t.id === taskId);
  if (!task) return;

  task.done = !task.done;
  triggerHaptic(task.done ? 16 : 8);

  if (task.done) {
    const today = todayISO(state.simulationOffsetDays);
    // Wurde die Aufgabe heute schon gezählt, nicht erneut erhöhen.
    if (task.doneAt !== today) {
      state.totalDone += 1;
      task.doneAt = today;
      updateStreak(state);
      trackEvent("main_task_completed", {
        difficulty: task.difficulty || "unknown",
      });
    }
  }

  updateMainDaySummary(state);

  saveState(state);
  applyTutorial(state);
  saveState(state);
  if (textEl) {
    textEl.classList.toggle("done", task.done);
  }
  if (labelEl) {
    // Ensure only one checkbox animates at a time.
    todayList.querySelectorAll(".neon-checkbox.burst").forEach((node) => {
      node.classList.remove("burst");
    });
    if (task.done) {
      // Force reflow to restart the animation on repeated checks.
      void labelEl.offsetHeight;
      labelEl.classList.add("burst");
      setTimeout(() => labelEl.classList.remove("burst"), 700);
    }
  }

  clearTimeout(todayRenderTimer);
  if (task.done) {
    // Delay full list rerender so the check burst remains visible.
    todayRenderTimer = setTimeout(() => renderToday(state), 360);
  } else {
    renderToday(state);
  }
  renderProgress(state);
  renderCalendar(state);
};

const addTaskFromGoal = (goalId, options = {}) => {
  const state = loadState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  const created = appendGoalTaskToState(state, goal);
  if (!created) return;
  saveState(state);
  renderAll(state);
  triggerHaptic(14);
  if (!options.skipToast) {
    showToast(t("toastTaskAdded"));
  }
  trackEvent("goal_task_added", {
    difficulty: goal.difficulty || "unknown",
  });
};

const addRandomTask = () => {
  const state = loadState();
  const goal = pickTaskFromGoals(state);
  if (!goal) return;
  addTaskFromGoal(goal.id);
};

const addQuickTask = (label) => {
  const state = loadState();
  if (!getFeatureAccess(state).quickTasks) return;
  const today = todayISO(state.simulationOffsetDays);
  const id = crypto.randomUUID();
  state.quickTasks[id] = {
    id,
    label,
    done: false,
    date: today,
  };
  saveState(state);
  renderAll(state);
  triggerHaptic(12);
  showToast(t("toastTodayAdded"));
  trackEvent("quick_task_today_added");
};

const addQuickTaskTomorrow = (label) => {
  const state = loadState();
  if (!getFeatureAccess(state).quickTasks) return;
  const tomorrow = todayISO(state.simulationOffsetDays + 1);
  const id = crypto.randomUUID();
  state.quickTasksTomorrow[id] = {
    id,
    label,
    done: false,
    date: tomorrow,
  };
  saveState(state);
  renderAll(state);
  triggerHaptic(12);
  showToast(t("toastTomorrowAdded"));
  trackEvent("quick_task_tomorrow_added");
};

const renderSideQuestOptions = (state) => {
  if (!sideQuestSelect) return;
  const selected = new Set((state.sideQuests || []).map((q) => q.goalId));
  const activeTodayGoalIds = new Set((state.todayTasks || []).map((task) => task.goalId));
  const options = state.goals.filter(
    (g) => !selected.has(g.id) && !activeTodayGoalIds.has(g.id)
  );

  sideQuestSelect.innerHTML = "";
  if (state.sideQuests.length >= 3) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("maxSideQuest");
    sideQuestSelect.appendChild(option);
    sideQuestSelect.disabled = true;
    return;
  }

  if (options.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = t("noGoalsAvailable");
    sideQuestSelect.appendChild(option);
    sideQuestSelect.disabled = true;
    return;
  }

  options.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = goal.title;
    sideQuestSelect.appendChild(option);
  });
  sideQuestSelect.disabled = false;
};

const addSideQuest = (goalId) => {
  const state = loadState();
  if (!getFeatureAccess(state).sideQuest) return;
  if ((state.sideQuests || []).length >= 3) return;
  if (state.sideQuests.some((q) => q.goalId === goalId)) return;
  if (state.todayTasks.some((task) => task.goalId === goalId)) return;
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  state.sideQuests.push({ goalId: goal.id });
  saveState(state);
  renderAll(state);
  triggerHaptic(12);
  showToast(t("toastSideAdded"));
  trackEvent("side_task_added");
};

const removeSideQuest = (goalId) => {
  const state = loadState();
  state.sideQuests = (state.sideQuests || []).filter((q) => q.goalId !== goalId);
  Object.keys(state.sideQuestChecks || {}).forEach((dateKey) => {
    if (!state.sideQuestChecks[dateKey]) return;
    delete state.sideQuestChecks[dateKey][goalId];
    if (Object.keys(state.sideQuestChecks[dateKey]).length === 0) {
      delete state.sideQuestChecks[dateKey];
    }
  });
  saveState(state);
  renderAll(state);
  triggerHaptic(8);
  showToast(t("toastSideRemoved"));
};

const toggleSideQuest = (goalId, textEl, labelEl) => {
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  state.sideQuestChecks = state.sideQuestChecks || {};
  state.sideQuestChecks[today] = state.sideQuestChecks[today] || {};
  const nowDone = !state.sideQuestChecks[today][goalId];
  state.sideQuestChecks[today][goalId] = nowDone;
  if (nowDone) trackEvent("side_task_completed");
  saveState(state);
  triggerHaptic(nowDone ? 14 : 8);

  if (textEl) {
    textEl.classList.toggle("done", nowDone);
  }
  if (labelEl && nowDone) {
    todayList.querySelectorAll(".neon-checkbox.burst").forEach((node) => {
      node.classList.remove("burst");
    });
    void labelEl.offsetHeight;
    labelEl.classList.add("burst");
    setTimeout(() => labelEl.classList.remove("burst"), 700);
  }
};

const toggleQuickTask = (taskId, textEl, labelEl) => {
  const state = loadState();
  const task = state.quickTasks[taskId];
  if (!task) return;
  task.done = !task.done;
  triggerHaptic(task.done ? 14 : 8);
  if (task.done) {
    const today = todayISO(state.simulationOffsetDays);
    if (task.doneAt !== today) {
      state.totalDone += 1;
      task.doneAt = today;
      updateStreak(state);
    }
  }
  updateMainDaySummary(state);
  saveState(state);
  applyTutorial(state);
  saveState(state);
  if (textEl) {
    textEl.classList.toggle("done", task.done);
  }
  if (labelEl && task.done) {
    todayList.querySelectorAll(".neon-checkbox.burst").forEach((node) => {
      node.classList.remove("burst");
    });
    void labelEl.offsetHeight;
    labelEl.classList.add("burst");
    setTimeout(() => labelEl.classList.remove("burst"), 700);
  }
  renderProgress(state);
  renderCalendar(state);
};

const toggleQuickTaskTomorrow = (taskId, textEl, labelEl) => {
  const state = loadState();
  const task = state.quickTasksTomorrow[taskId];
  if (!task) return;
  task.done = !task.done;
  saveState(state);
  if (textEl) {
    textEl.classList.toggle("done", task.done);
  }
  if (labelEl && task.done) {
    todayList.querySelectorAll(".neon-checkbox.burst").forEach((node) => {
      node.classList.remove("burst");
    });
    void labelEl.offsetHeight;
    labelEl.classList.add("burst");
    setTimeout(() => labelEl.classList.remove("burst"), 700);
  }
};

const setSimulationOffset = (value) => {
  const state = loadState();
  state.simulationOffsetDays = value;
  saveState(state);
  init();
  showToast(`${t("toastOffset")}: ${value}`);
};

let editingGoalId = null;

const startEditGoal = (goalId) => {
  editingGoalId = goalId;
  renderGoals(loadState());
};

const cancelEditGoal = () => {
  editingGoalId = null;
  renderGoals(loadState());
};

const finishEditGoal = (goalId, newTitle) => {
  const trimmed = (newTitle || "").trim();
  if (!trimmed) return;

  const state = loadState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  const oldTitle = goal.title;
  goal.title = trimmed;

  // Update today's tasks only if they still use the old goal title
  state.todayTasks = state.todayTasks.map((task) => {
    if (task.goalId !== goalId) return task;
    const shouldUpdate = task.label === oldTitle;
    if (!shouldUpdate) return task;
    return { ...task, label: trimmed };
  });

  saveState(state);
  editingGoalId = null;
  renderAll(state);
};

const reorderGoal = (sourceGoalId, targetGoalId) => {
  const state = loadState();
  const goals = [...state.goals];
  const sourceIndex = goals.findIndex((goal) => goal.id === sourceGoalId);
  const targetIndex = goals.findIndex((goal) => goal.id === targetGoalId);
  if (sourceIndex === -1 || targetIndex === -1) return;
  const [moved] = goals.splice(sourceIndex, 1);
  goals.splice(targetIndex, 0, moved);
  state.goals = goals;
  saveState(state);
  renderGoals(state);
  renderWeeklyPlan(state);
  renderUnlock(state);
};

const deleteGoal = (goalId) => {
  const state = loadState();
  state.goals = state.goals.filter((g) => g.id !== goalId);
  delete state.weeklyPlans[goalId];
  state.todayTasks = state.todayTasks.filter((t) => t.goalId !== goalId);
  state.sideQuests = (state.sideQuests || []).filter((q) => q.goalId !== goalId);
  Object.keys(state.sideQuestChecks || {}).forEach((dateKey) => {
    if (!state.sideQuestChecks[dateKey]) return;
    delete state.sideQuestChecks[dateKey][goalId];
    if (Object.keys(state.sideQuestChecks[dateKey]).length === 0) {
      delete state.sideQuestChecks[dateKey];
    }
  });

  saveState(state);
  renderAll(state);
};

const WEEKDAYS = [
  { key: "mon" },
  { key: "tue" },
  { key: "wed" },
  { key: "thu" },
  { key: "fri" },
  { key: "sat" },
  { key: "sun" },
];

const getPlanForGoal = (state, goalId) => {
  const plan = state.weeklyPlans[goalId];
  if (plan) return plan;
  const defaults = {};
  WEEKDAYS.forEach((d) => {
    defaults[d.key] = { text: "" };
  });
  return defaults;
};

const isPlanEntryActive = (entry) =>
  typeof entry?.text === "string" && entry.text.trim().length > 0;

const getWeekdayLabel = (key) => {
  const labels = I18N[currentLanguage]?.weekdays || I18N.de.weekdays;
  return labels[key] || key;
};

const getTemplateCategories = () =>
  I18N[currentLanguage]?.templates || I18N.de.templates;

const planHasAnyActive = (plan) =>
  WEEKDAYS.some((day) => isPlanEntryActive(plan[day.key]));

const getLabelForToday = (goal, planEntry, hasActivePlan) => {
  if (hasActivePlan && !isPlanEntryActive(planEntry)) {
    return `${t("restDayPrefix")} (${goal.title})`;
  }
  if (isPlanEntryActive(planEntry)) {
    return planEntry.text;
  }
  return goal.title;
};

const isRestDayForTask = (state, task, isoDate) => {
  const goal = state.goals.find((g) => g.id === task.goalId);
  if (!goal) return false;
  const plan = getPlanForGoal(state, goal.id);
  if (!planHasAnyActive(plan)) return false;
  const weekdayKey = weekdayKeyFromISO(isoDate);
  const entry = plan[weekdayKey];
  return !isPlanEntryActive(entry);
};

const getWeekStartFromDate = (date) => {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const mondayOffset = (day + 6) % 7;
  weekStart.setDate(weekStart.getDate() - mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const getWeeklyCompletionStats = (state, anchorISO) => {
  const anchorDate = new Date(anchorISO + "T00:00:00");
  const monday = getWeekStartFromDate(anchorDate);
  let activeDays = 0;
  let perfectDays = 0;

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = isoDateFromLocalDate(d);
    const summary = state.daySummary?.[iso];
    if (!summary || summary.total <= 0) continue;
    const ratio = summary.done / summary.total;
    if (ratio >= 0.5) activeDays += 1;
    if (ratio >= 1) perfectDays += 1;
  }

  return { activeDays, perfectDays };
};

const getPersonalWeeklyRecords = (state) => {
  const byWeek = {};
  const summaryEntries = Object.entries(state.daySummary || {});

  summaryEntries.forEach(([iso, summary]) => {
    if (!summary || summary.total <= 0) return;
    const date = new Date(iso + "T00:00:00");
    const weekStartISO = isoDateFromLocalDate(getWeekStartFromDate(date));
    if (!byWeek[weekStartISO]) {
      byWeek[weekStartISO] = { activeDays: 0, perfectDays: 0 };
    }
    const ratio = summary.done / summary.total;
    if (ratio >= 0.5) byWeek[weekStartISO].activeDays += 1;
    if (ratio >= 1) byWeek[weekStartISO].perfectDays += 1;
  });

  let activeRecord = 0;
  let perfectRecord = 0;
  Object.values(byWeek).forEach((week) => {
    if (week.activeDays > activeRecord) activeRecord = week.activeDays;
    if (week.perfectDays > perfectRecord) perfectRecord = week.perfectDays;
  });

  return { activeRecord, perfectRecord };
};

const getWeeklyRate = (state, anchorISO) => {
  const anchorDate = new Date(anchorISO + "T00:00:00");
  const monday = getWeekStartFromDate(anchorDate);
  let done = 0;
  let total = 0;
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = isoDateFromLocalDate(d);
    const summary = state.daySummary?.[iso];
    if (!summary || summary.total <= 0) continue;
    done += summary.done;
    total += summary.total;
  }
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
};

const getMonthlyRate = (state, anchorISO) => {
  const anchorDate = new Date(anchorISO + "T00:00:00");
  const year = anchorDate.getFullYear();
  const month = anchorDate.getMonth();
  let done = 0;
  let total = 0;
  Object.entries(state.daySummary || {}).forEach(([iso, summary]) => {
    if (!summary || summary.total <= 0) return;
    const date = new Date(iso + "T00:00:00");
    if (date.getFullYear() !== year || date.getMonth() !== month) return;
    done += summary.done;
    total += summary.total;
  });
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
};

const getBestWeekday = (state) => {
  const dayStats = {
    mon: { done: 0, total: 0 },
    tue: { done: 0, total: 0 },
    wed: { done: 0, total: 0 },
    thu: { done: 0, total: 0 },
    fri: { done: 0, total: 0 },
    sat: { done: 0, total: 0 },
    sun: { done: 0, total: 0 },
  };
  Object.entries(state.daySummary || {}).forEach(([iso, summary]) => {
    if (!summary || summary.total <= 0) return;
    const key = weekdayKeyFromISO(iso);
    if (!dayStats[key]) return;
    dayStats[key].done += summary.done;
    dayStats[key].total += summary.total;
  });
  let bestKey = null;
  let bestRate = -1;
  Object.entries(dayStats).forEach(([key, stats]) => {
    if (stats.total <= 0) return;
    const rate = stats.done / stats.total;
    if (rate > bestRate) {
      bestRate = rate;
      bestKey = key;
    }
  });
  if (!bestKey) return "-";
  return getWeekdayLabel(bestKey);
};

const renderWeeklyPlan = (state) => {
  if (!planGoalSelect || !planGrid || !planHint) return;

  const previousSelection = planGoalSelect.value;
  planGoalSelect.innerHTML = "";
  if (state.goals.length === 0) {
    const option = document.createElement("option");
    option.textContent = t("emptyGoals");
    option.value = "";
    planGoalSelect.appendChild(option);
    planGrid.innerHTML = "";
    planHint.textContent = "";
    return;
  }

  state.goals.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = goal.title;
    planGoalSelect.appendChild(option);
  });

  const selectedGoalId = previousSelection || state.goals[0].id;
  planGoalSelect.value = selectedGoalId;

  const plan = getPlanForGoal(state, selectedGoalId);
  planGrid.innerHTML = "";

  let activeCount = 0;
  WEEKDAYS.forEach((day) => {
    const row = document.createElement("div");
    row.className = "plan-row";

    const label = document.createElement("div");
    label.textContent = getWeekdayLabel(day.key);

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = t("planTaskPlaceholder");
    input.value = plan[day.key]?.text || "";
    if (input.value.trim().length > 0) activeCount += 1;

    input.addEventListener("input", () => {
      const stateNow = loadState();
      const currentPlan = getPlanForGoal(stateNow, selectedGoalId);
      currentPlan[day.key] = {
        text: input.value,
      };
      stateNow.weeklyPlans[selectedGoalId] = currentPlan;
      saveState(stateNow);
      const currentCount = WEEKDAYS.reduce((count, wd) => {
        const value = currentPlan[wd.key]?.text || "";
        return value.trim().length > 0 ? count + 1 : count;
      }, 0);
      if (currentCount < 4) {
        planHint.textContent = `${t("planNeed")} (${currentCount}). ${t("planRestDayInfo")}`;
      } else {
        planHint.textContent = `${t("planWeek")}: ${currentCount}. ${t("planRestDayInfo")}`;
      }
    });

    row.appendChild(label);
    row.appendChild(input);
    planGrid.appendChild(row);
  });

  if (activeCount < 4) {
    planHint.textContent = `${t("planNeed")} (${activeCount}). ${t("planRestDayInfo")}`;
  } else {
    planHint.textContent = `${t("planWeek")}: ${activeCount}. ${t("planRestDayInfo")}`;
  }
};

const renderTemplates = () => {
  if (!templateCategories) return;
  if (templatesRenderLangCache === currentLanguage && templateCategories.children.length > 0) return;
  templateCategories.innerHTML = "";

  getTemplateCategories().forEach((category, index) => {
    const wrapper = document.createElement("details");
    wrapper.className = "template-category";
    wrapper.open = index === 0;

    const title = document.createElement("summary");
    title.className = "template-title";
    title.textContent = category.title;

    const items = document.createElement("div");
    items.className = "template-items";

    category.items.forEach((item) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "template-chip";
      chip.textContent = item;
      chip.addEventListener("click", () => {
        const timeOfDay = goalTimeInput ? goalTimeInput.value : "12:00";
        addGoal(item, timeOfDay, null);
      });
      items.appendChild(chip);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(items);
    templateCategories.appendChild(wrapper);
  });
  templatesRenderLangCache = currentLanguage;
};

// ---------------------------
// Initialisierung
// ---------------------------
let listenersBound = false;
let calendarOffset = 0;

const setActiveTab = (target) => {
  const desired = target || "today";
  const previousTab = currentTab;
  currentTab = isTabAllowed(desired) ? desired : "goals";
  navItems.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === currentTab);
  });
  sections.forEach((section) => {
    const isActive = section.dataset.section === currentTab;
    section.classList.toggle("section-hidden", !isActive);
    section.hidden = !isActive;
    if (isActive) {
      section.classList.remove("section-enter");
      requestAnimationFrame(() => section.classList.add("section-enter"));
    }
  });
  if (currentTab !== previousTab) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const renderAllSmooth = (state) => {
  if (renderRafId) cancelAnimationFrame(renderRafId);
  renderRafId = requestAnimationFrame(() => {
    renderRafId = null;
    renderAll(state);
  });
};

const goToAdjacentTab = (direction) => {
  const index = tabOrder.indexOf(currentTab);
  if (index === -1) return;
  let nextIndex = direction === "next" ? index + 1 : index - 1;
  while (nextIndex >= 0 && nextIndex < tabOrder.length) {
    const candidate = tabOrder[nextIndex];
    if (isTabAllowed(candidate)) {
      setActiveTab(candidate);
      return;
    }
    nextIndex = direction === "next" ? nextIndex + 1 : nextIndex - 1;
  }
};

const init = () => {
  initAnalytics();
  const state = loadState();
  applyStaticTranslations();
  showLanguageModalIfNeeded();
  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);
  try {
    if (sessionStorage.getItem("onestep_update_applied") === "1") {
      sessionStorage.removeItem("onestep_update_applied");
      showToast((STATIC_TEXT[currentLanguage] || STATIC_TEXT.de).updateApplied);
    }
  } catch (_err) {
    // Ignore storage edge-cases.
  }
  syncRuntimeVersionWithActiveSW();
  // Keep templates collapsed on every page load/start.
  if (templatesSection) {
    templatesSection.open = false;
  }
  openIntroIfNeeded(state);
  const startTab = state.tutorialCompleted || state.tutorialStep >= 2 ? "today" : "goals";
  setActiveTab(startTab);
  setGoalTimeValue(goalTimeInput?.value || "12:00");

  if (!listenersBound) {
    goalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = goalInput.value.trim();
      if (!value) return;

      addGoal(value, goalTimeInput?.value || "12:00", getInlineGoalWeeklyPlan());
      goalInput.value = "";
      clearInlineGoalWeeklyPlan();
    });
    if (goalTimeToggle) {
      goalTimeToggle.addEventListener("click", () => {
        editingGoalTimeId = null;
        if (goalTimePicker) delete goalTimePicker.dataset.editGoalId;
        toggleGoalTimePicker();
      });
    }
    if (goalTimeApplyBtn) {
      goalTimeApplyBtn.addEventListener("click", () => {
        syncPickerFromWheelPositions();
        const pickerGoalId = goalTimePicker?.dataset?.editGoalId || "";
        const targetGoalId = editingGoalTimeId || pickerGoalId || null;
        if (targetGoalId) {
          updateGoalTime(targetGoalId, `${String(pickerHour).padStart(2, "0")}:${String(pickerMinute).padStart(2, "0")}`);
          editingGoalTimeId = null;
          if (goalTimePicker) delete goalTimePicker.dataset.editGoalId;
        }
        toggleGoalTimePicker(false);
      });
    }
    window.addEventListener("click", (event) => {
      if (!goalTimePicker || !goalTimeToggle || goalTimePicker.hidden) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      const targetEl = target instanceof Element ? target : null;
      if (targetEl?.closest(".time-edit-trigger")) return;
      if (goalTimePicker.contains(target) || goalTimeToggle.contains(target)) return;
      editingGoalTimeId = null;
      if (goalTimePicker) delete goalTimePicker.dataset.editGoalId;
      toggleGoalTimePicker(false);
    });

    applyOffsetBtn.addEventListener("click", () => {
      const value = Number(dayOffsetInput.value || 0);
      setSimulationOffset(value);
    });
    if (checkUpdatesBtn) {
      checkUpdatesBtn.addEventListener("click", () => {
        retryServiceWorkerUpdateCheck();
      });
    }

    resetBtn.addEventListener("click", () => {
      const confirmed = window.confirm(t("resetConfirm"));
      if (!confirmed) return;
      // Vollständiger Reset: State + Sprache löschen, Defaults speichern, UI neu rendern.
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LANGUAGE_KEY);
      localStorage.removeItem(ERROR_LOG_KEY);
      localStorage.removeItem(INTRO_VARIANT_KEY);
      localStorage.removeItem(LAST_BACKUP_KEY);
      currentLanguage = "";
      lastStaticLanguageApplied = "";
      const fresh = defaultState();
      saveState(fresh);
      goalInput.value = "";
      dayOffsetInput.value = 0;
      applyStaticTranslations();
      renderAll(fresh);
      setActiveTab("goals");
      showLanguageModalIfNeeded();
      if (introModal) introModal.hidden = true;
      triggerHaptic(18);
      showToast(t("toastReset"));
    });

    if (calPrev && calNext) {
      calPrev.addEventListener("click", () => {
        calendarOffset -= 1;
        renderCalendar(loadState());
      });
      calNext.addEventListener("click", () => {
        calendarOffset += 1;
        renderCalendar(loadState());
      });
    }

    navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        requestAnimationFrame(() => setActiveTab(btn.dataset.target));
      });
    });

    if (quickTaskForm) {
      quickTaskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = quickTaskInput.value.trim();
        if (!value) return;
        addQuickTask(value);
        quickTaskInput.value = "";
      });
    }
    if (quickTaskTomorrowBtn) {
      quickTaskTomorrowBtn.addEventListener("click", () => {
        const value = quickTaskInput.value.trim();
        if (!value) return;
        addQuickTaskTomorrow(value);
        quickTaskInput.value = "";
      });
    }
    if (sideQuestForm) {
      sideQuestForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!sideQuestSelect || !sideQuestSelect.value) return;
        addSideQuest(sideQuestSelect.value);
      });
    }
    if (weightForm) {
      weightForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveTodayWeight(weightInput?.value || "");
      });
    }
    if (weightTargetForm) {
      weightTargetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveWeightTarget(weightTargetInput?.value || "");
      });
    }
    if (sleepBedForm) {
      sleepBedForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveSleepBedtime(sleepBedInput?.value || "");
      });
    }
    if (sleepWakeForm) {
      sleepWakeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        saveSleepWakeTime(sleepWakeInput?.value || "");
      });
    }
    if (sleepNowBtn) {
      sleepNowBtn.addEventListener("click", () => {
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        if (sleepWakeInput) sleepWakeInput.value = time;
        saveSleepWakeTime(time);
      });
    }
    if (vocabStartBtn) {
      vocabStartBtn.addEventListener("click", () => {
        startVocabSession();
      });
    }
    if (vocabRevealBtn) {
      vocabRevealBtn.addEventListener("click", () => {
        const stateNow = loadState();
        const session = stateNow.vocabRuntime?.session;
        if (!session) return;
        session.revealed = true;
        saveState(stateNow);
        renderAll(stateNow);
      });
    }
    if (vocabCorrectBtn) {
      vocabCorrectBtn.addEventListener("click", () => submitVocabFlashcard(true));
    }
    if (vocabWrongBtn) {
      vocabWrongBtn.addEventListener("click", () => submitVocabFlashcard(false));
    }
    if (vocabSubmitBtn) {
      vocabSubmitBtn.addEventListener("click", () => submitVocabWrite());
    }
    if (vocabSettingsSaveBtn) {
      vocabSettingsSaveBtn.addEventListener("click", () => saveVocabSettings());
    }
    if (vocabThemeSelect) {
      vocabThemeSelect.addEventListener("change", () => {
        const stateNow = loadState();
        stateNow.vocabRuntime = stateNow.vocabRuntime || {};
        stateNow.vocabRuntime.activeThemeId = vocabThemeSelect.value;
        saveState(stateNow);
        renderAll(stateNow);
      });
    }
    if (vocabModeSelect) {
      vocabModeSelect.addEventListener("change", () => {
        const stateNow = loadState();
        stateNow.vocabRuntime = stateNow.vocabRuntime || {};
        stateNow.vocabRuntime.activeMode = vocabModeSelect.value;
        saveState(stateNow);
        renderAll(stateNow);
      });
    }
    if (vocabDirectionFrDeBtn) {
      vocabDirectionFrDeBtn.addEventListener("click", () => {
        setVocabDirection("fr-de");
      });
    }
    if (vocabDirectionDeFrBtn) {
      vocabDirectionDeFrBtn.addEventListener("click", () => {
        setVocabDirection("de-fr");
      });
    }
    if (vocabLibrarySearchInput) {
      vocabLibrarySearchInput.addEventListener("input", () => {
        const stateNow = loadState();
        renderVocabTracker(stateNow);
      });
    }
    if (trackerChecklistBtn) {
      trackerChecklistBtn.addEventListener("click", () => {
        const stateNow = loadState();
        if (stateNow.todayTracker === "checklist") return;
        stateNow.todayTracker = "checklist";
        saveState(stateNow);
        renderAllSmooth(stateNow);
      });
    }
    if (trackerWeightBtn) {
      trackerWeightBtn.addEventListener("click", () => {
        const stateNow = loadState();
        if (stateNow.todayTracker === "weight") return;
        stateNow.todayTracker = "weight";
        saveState(stateNow);
        renderAllSmooth(stateNow);
      });
    }
    if (trackerSleepBtn) {
      trackerSleepBtn.addEventListener("click", () => {
        const stateNow = loadState();
        if (stateNow.todayTracker === "sleep") return;
        stateNow.todayTracker = "sleep";
        saveState(stateNow);
        renderAllSmooth(stateNow);
      });
    }
    if (planGoalSelect) {
      planGoalSelect.addEventListener("change", () => {
        renderWeeklyPlan(loadState());
      });
    }
    if (modeSwitch) {
      modeSwitch.addEventListener("change", () => {
        const stateNow = loadState();
        stateNow.proEnabled = modeSwitch.checked;
        if (!stateNow.proEnabled) {
          stateNow.templatesOpenedOnce = false;
        }
        saveState(stateNow);
        applyMode(stateNow);
        triggerHaptic(10);
        showToast(stateNow.proEnabled ? t("toastProOn") : t("toastProOff"));
      });
    }
    if (languageSelect) {
      languageSelect.addEventListener("change", () => {
        setLanguage(languageSelect.value);
      });
    }
    if (templatesSection) {
      templatesSection.addEventListener("toggle", () => {
        if (!templatesSection.open) return;
        const stateNow = loadState();
        stateNow.templatesOpenedOnce = true;
        saveState(stateNow);
      });
    }

    const isInteractive = (target) =>
      target.closest("input, textarea, select, button, a");

    const startTracking = (x, y, pointerId = null) => {
      trackingPointerId = pointerId;
      touchStartX = x;
      touchStartY = y;
      touchStartTime = Date.now();
    };

    const endTracking = (x, y, pointerId = null) => {
      if (pointerId !== null && trackingPointerId !== pointerId) return;
      if (touchStartX === null || touchStartY === null) return;

      const dx = x - touchStartX;
      const dy = y - touchStartY;
      const dt = Date.now() - touchStartTime;

      // Horizontal swipe: at least 60px, vertical drift under 40px, within 700ms.
      if (Math.abs(dx) > 60 && Math.abs(dy) < 40 && dt < 700) {
        if (dx < 0) {
          goToAdjacentTab("next");
        } else {
          goToAdjacentTab("prev");
        }
      }

      trackingPointerId = null;
      touchStartX = null;
      touchStartY = null;
      touchStartTime = null;
    };

    window.addEventListener("pointerdown", (event) => {
      if (event.pointerType !== "touch") return;
      if (isInteractive(event.target)) return;
      startTracking(event.clientX, event.clientY, event.pointerId);
    }, { passive: true });

    window.addEventListener("pointerup", (event) => {
      if (event.pointerType !== "touch") return;
      endTracking(event.clientX, event.clientY, event.pointerId);
    }, { passive: true });

    // Fallback for browsers where pointer events are unreliable.
    window.addEventListener("touchstart", (event) => {
      if (isInteractive(event.target)) return;
      const touch = event.changedTouches[0];
      startTracking(touch.clientX, touch.clientY, null);
    }, { passive: true });

    window.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      endTracking(touch.clientX, touch.clientY, null);
    }, { passive: true });

    languageButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedLang = btn.dataset.lang;
        if (!selectedLang || languageSelectionInProgress) return;
        languageSelectionInProgress = true;
        languageButtons.forEach((node) => node.classList.remove("is-selecting"));
        btn.classList.add("is-selecting");
        if (languageGrid) languageGrid.classList.add("is-locked");
        window.setTimeout(() => {
          setLanguage(selectedLang);
        }, LANGUAGE_SELECT_ANIMATION_MS);
      });
    });
    if (introNextBtn) {
      introNextBtn.addEventListener("click", handleIntroNext);
    }
    if (introGoalInputEl) {
      introGoalInputEl.addEventListener("input", () => {
        introGoalDraft = introGoalInputEl.value;
      });
    }
    if (updateBannerBtn) {
      updateBannerBtn.addEventListener("click", requestServiceWorkerUpdate);
    }
    if (updateBannerRetryBtn) {
      updateBannerRetryBtn.addEventListener("click", retryServiceWorkerUpdateCheck);
    }
    if (dayDetailClose) {
      dayDetailClose.addEventListener("click", closeDayDetails);
    }
    if (dayDetailModal) {
      dayDetailModal.addEventListener("click", (event) => {
        if (event.target === dayDetailModal) closeDayDetails();
      });
    }
    if (exportDataBtn) {
      exportDataBtn.addEventListener("click", exportBackup);
    }
    if (importDataBtn && importFileInput) {
      importDataBtn.addEventListener("click", () => importFileInput.click());
      importFileInput.addEventListener("change", () => {
        const file = importFileInput.files?.[0];
        if (file) importBackup(file);
      });
    }
    if (tutorialCtaBtn) {
      tutorialCtaBtn.addEventListener("click", () => {
        const action = tutorialCtaBtn.dataset.action || "tab";
        if (action === "language") {
          if (languageModal) languageModal.hidden = false;
          return;
        }
        const target = tutorialCtaBtn.dataset.target || "today";
        setActiveTab(target);
      });
    }

    listenersBound = true;
  }
};

// ---------------------------
// Rendering: Unlock Controls
// ---------------------------
function renderUnlock(state) {
  unlockControls.innerHTML = "";

  const access = getFeatureAccess(state);
  const eligible = shouldUnlockNewTask(state);
  const candidates = state.goals.filter(
    (g) => !state.todayTasks.some((t) => t.goalId === g.id)
  );

  if (!eligible || candidates.length === 0) {
    unlockControls.classList.remove("active");
    return;
  }

  unlockControls.classList.add("active");

  const intro = document.createElement("div");
  intro.textContent = FAST_ONBOARDING_ENABLED && access.onboardingActive
    ? t("unlockIntroDaily")
    : t("unlockIntro");

  const row = document.createElement("div");
  row.className = "unlock-row";

  const select = document.createElement("select");
  candidates.forEach((goal) => {
    const option = document.createElement("option");
    option.value = goal.id;
    option.textContent = `${goal.title} (${difficultyLabel(goal.difficulty)})`;
    select.appendChild(option);
  });

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "btn";
  addBtn.textContent = t("btnAdd");
  addBtn.addEventListener("click", () => addTaskFromGoal(select.value));

  const randomBtn = document.createElement("button");
  randomBtn.type = "button";
  randomBtn.className = "btn ghost";
  randomBtn.textContent = t("btnRandom");
  randomBtn.addEventListener("click", addRandomTask);

  row.appendChild(select);
  row.appendChild(addBtn);
  row.appendChild(randomBtn);

  unlockControls.appendChild(intro);
  unlockControls.appendChild(row);
}

function renderSimulatedDate(state) {
  dayOffsetInput.value = state.simulationOffsetDays;
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
  simulatedDateEl.textContent = `${s.simPrefix}: ${todayISO(state.simulationOffsetDays)}`;
}

function renderCalendar(state) {
  if (!calGrid || !calTitle) return;
  const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + calendarOffset);

  const year = base.getFullYear();
  const month = base.getMonth();
  const today = todayISO(state.simulationOffsetDays);
  const monthName = base.toLocaleDateString(localeForLanguage(), { month: "long", year: "numeric" });
  calTitle.textContent = monthName;

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calGrid.innerHTML = "";
  const headers = s.calWeekdays || STATIC_TEXT.de.calWeekdays;
  headers.forEach((label) => {
    const cell = document.createElement("div");
    cell.className = "calendar-cell header";
    cell.textContent = label;
    calGrid.appendChild(cell);
  });

  for (let i = 0; i < startWeekday; i += 1) {
    const filler = document.createElement("div");
    filler.className = "calendar-cell filler";
    calGrid.appendChild(filler);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    const iso = isoDateFromLocalDate(new Date(year, month, day));
    const summary = state.daySummary?.[iso];
    const hasDetails = Array.isArray(state.dayTaskHistory?.[iso]) && state.dayTaskHistory[iso].length > 0;
    if (summary && summary.total > 0) {
      const percent = Math.max(0, Math.min(100, Math.round((summary.done / summary.total) * 100)));
      // Progress color gets stronger with higher completion.
      // 100% gets a dedicated strong style with outlined border.
      cell.classList.add("progress");
      cell.style.setProperty("--progress", String(percent));
      cell.title = `${summary.done}/${summary.total} ${s.calDoneTitle} (${percent}%)`;
      if (percent >= 100) {
        cell.classList.add("done-full");
      }
    }
    if (summary || hasDetails || iso === today) {
      cell.classList.add("has-detail");
      cell.addEventListener("click", () => openDayDetails(state, iso));
    }
    cell.textContent = String(day);
    calGrid.appendChild(cell);
  }
}

function isClockTime(value) {
  return /^\d{2}:\d{2}$/.test(value || "");
}

function normalizeGoalTime(value) {
  if (isClockTime(value)) return value;
  if (value === "morning") return "08:00";
  if (value === "evening") return "19:00";
  return "12:00";
}

function timeToMinutes(value) {
  const normalized = normalizeGoalTime(value);
  const [h, m] = normalized.split(":").map(Number);
  return (h * 60) + m;
}

function formatTime(value) {
  const normalized = normalizeGoalTime(value);
  const [h, m] = normalized.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function toneClassForTime(value) {
  const minutes = timeToMinutes(value);
  if (minutes < 11 * 60) return "morning";
  if (minutes < 17 * 60) return "noon";
  return "evening";
}

function setGoalTimeValue(value, options = {}) {
  const { syncWheels = true } = options;
  const formatted = formatTime(value);
  const [h, m] = formatted.split(":").map(Number);
  pickerHour = h;
  pickerMinute = m;
  if (goalTimeInput) goalTimeInput.value = formatted;
  if (goalTimeToggle) goalTimeToggle.textContent = `${t("timePrefix")}: ${formatted}`;
  if (timePickerValueEl) timePickerValueEl.textContent = formatted;
  if (syncWheels && goalTimePicker && !goalTimePicker.hidden) {
    setWheelToValue(timeHourWheel, HOUR_VALUES, pickerHour);
    setWheelToValue(timeMinuteWheel, MINUTE_VALUES, pickerMinute);
  }
}

function mod(value, base) {
  return ((value % base) + base) % base;
}

function buildWheel(container, values, selected) {
  if (!container) return;
  container.innerHTML = "";
  const focus = document.createElement("div");
  focus.className = "time-wheel-focus";
  container.appendChild(focus);

  for (let repeat = 0; repeat < WHEEL_REPEAT; repeat += 1) {
    values.forEach((value) => {
      const item = document.createElement("div");
      item.className = "time-wheel-item";
      item.dataset.value = String(value);
      item.textContent = String(value).padStart(2, "0");
      if (value === selected && repeat === WHEEL_CENTER_REPEAT) {
        item.classList.add("active");
      }
      container.appendChild(item);
    });
  }
}

function updateWheelCylinderEffect(container) {
  if (!container) return;
  const centerY = container.scrollTop + (container.clientHeight / 2);
  const items = container.querySelectorAll(".time-wheel-item");
  items.forEach((node) => {
    const itemCenter = node.offsetTop + (node.offsetHeight / 2);
    const delta = itemCenter - centerY;
    const ratio = Math.max(-4, Math.min(4, delta / WHEEL_ITEM_HEIGHT));
    const absRatio = Math.min(Math.abs(ratio), 4);
    const scale = 1 - (absRatio * 0.09);
    const opacity = 1 - (absRatio * 0.17);
    const blur = absRatio * 0.35;
    node.style.transform = `scale(${scale})`;
    node.style.opacity = String(Math.max(0.34, opacity));
    node.style.filter = `blur(${blur}px)`;
  });
}

function highlightWheelSelection(container, values) {
  if (!container) return;
  const items = container.querySelectorAll(".time-wheel-item");
  const index = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
  const safeIndex = Math.max(0, Math.min(items.length - 1, index));
  items.forEach((node, i) => {
    node.classList.toggle("active", i === safeIndex);
  });
  updateWheelCylinderEffect(container);
}

function recenterWheel(container, values) {
  if (!container) return;
  const rawIndex = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
  const normalized = mod(rawIndex, values.length);
  const minSafe = values.length;
  const maxSafe = (WHEEL_REPEAT - 2) * values.length;
  if (rawIndex >= minSafe && rawIndex <= maxSafe) return;
  const recentered = (WHEEL_CENTER_REPEAT * values.length) + normalized;
  wheelSyncLock = true;
  container.scrollTop = recentered * WHEEL_ITEM_HEIGHT;
  wheelSyncLock = false;
}

function getCenteredWheelValue(container, values) {
  if (!container) return values[0];
  recenterWheel(container, values);
  const index = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
  return values[mod(index, values.length)];
}

function syncPickerFromWheelPositions() {
  const hourValue = getCenteredWheelValue(timeHourWheel, HOUR_VALUES);
  const minuteValue = getCenteredWheelValue(timeMinuteWheel, MINUTE_VALUES);
  pickerHour = hourValue;
  pickerMinute = minuteValue;
  setGoalTimeValue(
    `${String(pickerHour).padStart(2, "0")}:${String(pickerMinute).padStart(2, "0")}`,
    { syncWheels: false }
  );
}

function finalizeWheelSelection(container, values, wheelKey) {
  recenterWheel(container, values);
  const index = Math.round(container.scrollTop / WHEEL_ITEM_HEIGHT);
  const value = values[mod(index, values.length)];
  setWheelToValue(container, values, value);
  if (wheelKey === "hour") pickerHour = value;
  if (wheelKey === "minute") pickerMinute = value;
  setGoalTimeValue(
    `${String(pickerHour).padStart(2, "0")}:${String(pickerMinute).padStart(2, "0")}`,
    { syncWheels: false }
  );
  highlightWheelSelection(container, values);
}

function bindWheelScroll(container, values, wheelKey) {
  if (!container) return;
  if (container.dataset.boundWheel === wheelKey) return;
  container.dataset.boundWheel = wheelKey;
  const timerKey = wheelKey === "hour" ? "hour" : "minute";
  container.addEventListener("scroll", () => {
    if (wheelSyncLock) return;
    updateWheelCylinderEffect(container);
    if (wheelScrollTimers[timerKey]) clearTimeout(wheelScrollTimers[timerKey]);
    wheelScrollTimers[timerKey] = setTimeout(() => {
      finalizeWheelSelection(container, values, wheelKey);
    }, 160);
  });
}

function setWheelToValue(container, values, value) {
  if (!container) return;
  const baseIndex = values.indexOf(value);
  const safeIndex = baseIndex >= 0 ? baseIndex : 0;
  const targetIndex = (WHEEL_CENTER_REPEAT * values.length) + safeIndex;
  const targetTop = targetIndex * WHEEL_ITEM_HEIGHT;
  if (Math.abs(container.scrollTop - targetTop) < 0.5) {
    highlightWheelSelection(container, values);
    return;
  }
  wheelSyncLock = true;
  container.scrollTop = targetTop;
  wheelSyncLock = false;
  highlightWheelSelection(container, values);
}

function renderGoalTimePicker() {
  buildWheel(timeHourWheel, HOUR_VALUES, pickerHour);
  buildWheel(timeMinuteWheel, MINUTE_VALUES, pickerMinute);
  setWheelToValue(timeHourWheel, HOUR_VALUES, pickerHour);
  setWheelToValue(timeMinuteWheel, MINUTE_VALUES, pickerMinute);
}

function toggleGoalTimePicker(forceOpen = null) {
  if (!goalTimePicker || !goalTimeToggle) return;
  const shouldOpen = forceOpen === null ? goalTimePicker.hidden : forceOpen;
  goalTimePicker.hidden = !shouldOpen;
  goalTimeToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  if (shouldOpen) {
    renderGoalTimePicker();
    bindWheelScroll(timeHourWheel, HOUR_VALUES, "hour");
    bindWheelScroll(timeMinuteWheel, MINUTE_VALUES, "minute");
  }
}

function difficultyLabel(value) {
  if (value === "morning") return t("difficultyMorning");
  if (value === "noon") return t("difficultyNoon");
  if (value === "evening") return t("difficultyEvening");
  return formatTime(value);
}

const registerServiceWorker = () => {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (isRefreshingFromServiceWorker) return;
    isRefreshingFromServiceWorker = true;
    window.location.reload();
  });
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js");
      swRegistrationRef = registration;
      syncRuntimeVersionWithActiveSW();
      if (registration.waiting) {
        showUpdateBanner(registration.waiting);
      }
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateBanner(installing);
          }
        });
      });
      setInterval(() => {
        retryServiceWorkerUpdateCheck();
      }, 10 * 60 * 1000);
    } catch (error) {
      console.warn("Service Worker Registrierung fehlgeschlagen", error);
      logClientError("sw_register", error?.message || error);
      hideUpdateBanner();
    }
  });
};

window.addEventListener("error", (event) => {
  logClientError("window_error", event?.message || "unknown");
});

window.addEventListener("unhandledrejection", (event) => {
  logClientError("unhandled_rejection", event?.reason || "unknown");
});

registerServiceWorker();
init();
