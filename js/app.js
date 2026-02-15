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
const APP_VERSION = "1.6.19";
const BACKUP_SCHEMA_VERSION = 2;
const LANGUAGE_KEY = "onestep_language_v1";
const ERROR_LOG_KEY = "onestep_error_log_v1";
const SUPPORTED_LANGS = ["de", "en", "ru", "es", "fr"];
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || "";

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
    btnAdd: "Hinzufügen",
    btnTomorrow: "Für morgen",
    btnSideQuestAdd: "Side Quest hinzufügen",
    btnRandom: "Zufällig auswählen",
    emptyToday: "Noch keine Tagesaufgaben – füge ein Ziel hinzu.",
    emptyGoals: "Noch keine Ziele – beginne mit einem kleinen Schritt.",
    sideQuestHead: "Side Quest",
    tomorrowHead: "Morgen",
    badgeOneTime: "Einmalig",
    badgeTomorrow: "Morgen",
    maxSideQuest: "Maximal 3 Side Quests erreicht",
    noGoalsAvailable: "Keine weiteren Ziele verfügbar",
    unlockIntro: "3 Tage sind vorbei – du kannst eine weitere Aufgabe hinzufügen oder zufällig auswählen.",
    resetConfirm: "Möchtest du wirklich alles zurücksetzen?",
    toastGoalAdded: "Ziel hinzugefügt",
    toastTaskAdded: "Neue Tagesaufgabe hinzugefügt",
    toastTodayAdded: "Aufgabe für heute hinzugefügt",
    toastTomorrowAdded: "Aufgabe für morgen geplant",
    toastSideAdded: "Side Quest hinzugefügt",
    toastSideRemoved: "Side Quest entfernt",
    toastReset: "App wurde zurückgesetzt",
    toastOffset: "Tag-Offset gesetzt",
    toastProOn: "Pro-Modus aktiv",
    toastProOff: "Pro-Modus deaktiviert",
    planNeed: "Bitte mindestens 4 Tage eintragen",
    planWeek: "Woche geplant",
    tutorialStart: "Start",
    tutorialStep: "Schritt",
    dayWord: "Tag",
    tutorialS1: "Lege dein erstes Ziel an.",
    tutorialS2: "Hake heute eine Aufgabe ab.",
    tutorialDone: "Super! Alles ist freigeschaltet.",
    unlockWeekTitle: "Neu: Wochenplan",
    unlockWeekText: "Wochenplan ist jetzt aktiv.",
    unlockQuickTitle: "Neu: Einmalige Aufgaben",
    unlockQuickText: "Einmalige Aufgaben sind jetzt aktiv.",
    unlockSideTitle: "Neu: Side Quest",
    unlockSideText: "Side Quest ist jetzt aktiv.",
    onboardingTitle: "Onboarding aktiv",
    onboardingText: "Bleib bei kleinen, täglichen Schritten.",
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
    btnAdd: "Add",
    btnTomorrow: "For tomorrow",
    btnSideQuestAdd: "Add side quest",
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
    resetConfirm: "Reset all app data?",
    toastGoalAdded: "Goal added",
    toastTaskAdded: "Daily task added",
    toastTodayAdded: "Task added for today",
    toastTomorrowAdded: "Task planned for tomorrow",
    toastSideAdded: "Side quest added",
    toastSideRemoved: "Side quest removed",
    toastReset: "App reset",
    toastOffset: "Day offset set",
    toastProOn: "Pro mode on",
    toastProOff: "Pro mode off",
    planNeed: "Please set at least 4 days",
    planWeek: "Week planned",
    tutorialStart: "Start",
    tutorialStep: "Step",
    dayWord: "Day",
    tutorialS1: "Create your first goal.",
    tutorialS2: "Complete one task today.",
    tutorialDone: "Great! All sections unlocked.",
    unlockWeekTitle: "New: Weekly plan",
    unlockWeekText: "Weekly plan is now unlocked.",
    unlockQuickTitle: "New: One-time tasks",
    unlockQuickText: "One-time tasks are now unlocked.",
    unlockSideTitle: "New: Side Quest",
    unlockSideText: "Side Quest is now unlocked.",
    onboardingTitle: "Onboarding active",
    onboardingText: "Keep it small and daily.",
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
    btnAdd: "Добавить",
    btnTomorrow: "На завтра",
    btnSideQuestAdd: "Добавить side quest",
    btnRandom: "Случайно",
    emptyToday: "Пока нет задач — добавьте цель.",
    emptyGoals: "Пока нет целей — начните с малого.",
    sideQuestHead: "Side Quest",
    tomorrowHead: "Завтра",
    badgeOneTime: "Разово",
    badgeTomorrow: "Завтра",
    maxSideQuest: "Достигнут лимит 3 side quests",
    noGoalsAvailable: "Больше целей нет",
    unlockIntro: "Прошло 3 дня — добавьте задачу или выберите случайно.",
    resetConfirm: "Сбросить все данные?",
    toastGoalAdded: "Цель добавлена",
    toastTaskAdded: "Задача дня добавлена",
    toastTodayAdded: "Задача на сегодня добавлена",
    toastTomorrowAdded: "Задача на завтра запланирована",
    toastSideAdded: "Side quest добавлен",
    toastSideRemoved: "Side quest удалён",
    toastReset: "Приложение сброшено",
    toastOffset: "Смещение дня установлено",
    toastProOn: "Pro режим включён",
    toastProOff: "Pro режим выключен",
    planNeed: "Укажите минимум 4 дня",
    planWeek: "Неделя запланирована",
    tutorialStart: "Старт",
    tutorialStep: "Шаг",
    dayWord: "День",
    tutorialS1: "Создайте первую цель.",
    tutorialS2: "Отметьте одну задачу сегодня.",
    tutorialDone: "Отлично! Всё разблокировано.",
    unlockWeekTitle: "Новое: план недели",
    unlockWeekText: "План недели теперь доступен.",
    unlockQuickTitle: "Новое: разовые задачи",
    unlockQuickText: "Разовые задачи теперь доступны.",
    unlockSideTitle: "Новое: Side Quest",
    unlockSideText: "Side Quest теперь доступен.",
    onboardingTitle: "Онбординг активен",
    onboardingText: "Маленькие шаги каждый день.",
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
    btnAdd: "Añadir",
    btnTomorrow: "Para mañana",
    btnSideQuestAdd: "Añadir side quest",
    btnRandom: "Aleatorio",
    emptyToday: "Aún no hay tareas: añade una meta.",
    emptyGoals: "Aún no hay metas: empieza pequeño.",
    sideQuestHead: "Side Quest",
    tomorrowHead: "Mañana",
    badgeOneTime: "Puntual",
    badgeTomorrow: "Mañana",
    maxSideQuest: "Máximo 3 side quests alcanzado",
    noGoalsAvailable: "No hay más metas",
    unlockIntro: "Pasaron 3 días: añade una tarea o elige al azar.",
    resetConfirm: "¿Restablecer todos los datos?",
    toastGoalAdded: "Meta añadida",
    toastTaskAdded: "Tarea diaria añadida",
    toastTodayAdded: "Tarea añadida para hoy",
    toastTomorrowAdded: "Tarea planificada para mañana",
    toastSideAdded: "Side quest añadido",
    toastSideRemoved: "Side quest eliminado",
    toastReset: "App reiniciada",
    toastOffset: "Desfase de día aplicado",
    toastProOn: "Modo Pro activado",
    toastProOff: "Modo Pro desactivado",
    planNeed: "Añade al menos 4 días",
    planWeek: "Semana planificada",
    tutorialStart: "Inicio",
    tutorialStep: "Paso",
    dayWord: "Día",
    tutorialS1: "Crea tu primera meta.",
    tutorialS2: "Marca una tarea hoy.",
    tutorialDone: "¡Perfecto! Todo desbloqueado.",
    unlockWeekTitle: "Nuevo: plan semanal",
    unlockWeekText: "El plan semanal ya está activo.",
    unlockQuickTitle: "Nuevo: tareas puntuales",
    unlockQuickText: "Las tareas puntuales ya están activas.",
    unlockSideTitle: "Nuevo: Side Quest",
    unlockSideText: "Side Quest ya está activo.",
    onboardingTitle: "Onboarding activo",
    onboardingText: "Pequeños pasos cada día.",
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
    btnAdd: "Ajouter",
    btnTomorrow: "Pour demain",
    btnSideQuestAdd: "Ajouter side quest",
    btnRandom: "Aléatoire",
    emptyToday: "Pas encore de tâches : ajoute un objectif.",
    emptyGoals: "Pas encore d'objectifs : commence petit.",
    sideQuestHead: "Side Quest",
    tomorrowHead: "Demain",
    badgeOneTime: "Ponctuel",
    badgeTomorrow: "Demain",
    maxSideQuest: "Maximum 3 side quests atteint",
    noGoalsAvailable: "Plus d'objectifs disponibles",
    unlockIntro: "3 jours passés : ajoute une tâche ou choisis au hasard.",
    resetConfirm: "Réinitialiser toutes les données ?",
    toastGoalAdded: "Objectif ajouté",
    toastTaskAdded: "Tâche du jour ajoutée",
    toastTodayAdded: "Tâche ajoutée pour aujourd'hui",
    toastTomorrowAdded: "Tâche planifiée pour demain",
    toastSideAdded: "Side quest ajouté",
    toastSideRemoved: "Side quest retiré",
    toastReset: "App réinitialisée",
    toastOffset: "Décalage de jour défini",
    toastProOn: "Mode Pro activé",
    toastProOff: "Mode Pro désactivé",
    planNeed: "Ajoute au moins 4 jours",
    planWeek: "Semaine planifiée",
    tutorialStart: "Début",
    tutorialStep: "Étape",
    dayWord: "Jour",
    tutorialS1: "Crée ton premier objectif.",
    tutorialS2: "Coche une tâche aujourd'hui.",
    tutorialDone: "Super ! Tout est débloqué.",
    unlockWeekTitle: "Nouveau : plan hebdo",
    unlockWeekText: "Le plan hebdo est maintenant actif.",
    unlockQuickTitle: "Nouveau : tâches ponctuelles",
    unlockQuickText: "Les tâches ponctuelles sont actives.",
    unlockSideTitle: "Nouveau : Side Quest",
    unlockSideText: "Side Quest est maintenant actif.",
    onboardingTitle: "Onboarding actif",
    onboardingText: "Petits pas chaque jour.",
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

const STATIC_TEXT = {
  de: {
    welcomeTitle: "Willkommen bei OneStep",
    welcomeP1: "Kleine Schritte, jeden Tag.",
    welcomeP2: "Starte mit einem Ziel.",
    todayTitle: "Today",
    goalsTitle: "Life Goals",
    progressTitle: "Progress",
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
    btnEdit: "Bearbeiten",
    btnSave: "Speichern",
    btnRemove: "Entfernen",
    deleteGoalTitle: "Ziel entfernen",
    infoSubtitle: "App-Optionen und Hinweise",
    infoMainSummary: "Info",
    infoMainP1: "Kleine Schritte schlagen Perfektion.",
    infoMainP2: "Konstanz ist wichtiger als Intensität.",
    infoListSummary: "So entsteht deine Tagesliste",
    infoList1: "Life Goals sind dein Aufgaben-Pool.",
    infoList2: "Zu Beginn startet ein Goal als Tagesaufgabe.",
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
    updateAvailable: "Neue Version verfügbar",
    updateNow: "Jetzt aktualisieren",
    updateRetry: "Erneut prüfen",
    updateNote: "Bugfixes und Verbesserungen sind bereit.",
    tutorialCheck1: "Sprache festlegen",
    tutorialCheck2: "Erstes Ziel erstellen",
    tutorialCheck3: "Erste Aufgabe erledigen",
    tutorialCta1: "Zu Einstellungen",
    tutorialCta2: "Ziel erstellen",
    tutorialCta3: "Zu Today",
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
    todayTitle: "Today",
    goalsTitle: "Life Goals",
    progressTitle: "Progress",
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
    updateAvailable: "New version available",
    updateNow: "Update now",
    updateRetry: "Check again",
    updateNote: "Bug fixes and improvements are ready.",
    tutorialCheck1: "Set language",
    tutorialCheck2: "Create first goal",
    tutorialCheck3: "Complete first task",
    tutorialCta1: "Open settings",
    tutorialCta2: "Create goal",
    tutorialCta3: "Go to Today",
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
    todayTitle: "Today",
    goalsTitle: "Life Goals",
    progressTitle: "Progress",
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
    btnEdit: "Изменить",
    btnSave: "Сохранить",
    btnRemove: "Удалить",
    deleteGoalTitle: "Удалить цель",
    infoSubtitle: "Параметры и информация",
    infoMainSummary: "Инфо",
    infoMainP1: "Маленькие шаги лучше идеала.",
    infoMainP2: "Регулярность важнее интенсивности.",
    infoListSummary: "Как формируется список дня",
    infoList1: "Life Goals — это пул задач.",
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
    updateAvailable: "Доступна новая версия",
    updateNow: "Обновить сейчас",
    updateRetry: "Проверить снова",
    updateNote: "Исправления и улучшения готовы.",
    tutorialCheck1: "Выбрать язык",
    tutorialCheck2: "Создать первую цель",
    tutorialCheck3: "Выполнить первую задачу",
    tutorialCta1: "Открыть настройки",
    tutorialCta2: "Создать цель",
    tutorialCta3: "Открыть Today",
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
    todayTitle: "Today",
    goalsTitle: "Life Goals",
    progressTitle: "Progress",
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
    btnEdit: "Editar",
    btnSave: "Guardar",
    btnRemove: "Eliminar",
    deleteGoalTitle: "Eliminar meta",
    infoSubtitle: "Opciones y notas",
    infoMainSummary: "Info",
    infoMainP1: "Los pasos pequeños superan la perfección.",
    infoMainP2: "La constancia importa más que la intensidad.",
    infoListSummary: "Cómo se crea tu lista diaria",
    infoList1: "Life Goals es tu pool de tareas.",
    infoList2: "Al inicio, una meta pasa a Today.",
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
    updateAvailable: "Nueva versión disponible",
    updateNow: "Actualizar ahora",
    updateRetry: "Comprobar de nuevo",
    updateNote: "Hay correcciones y mejoras disponibles.",
    tutorialCheck1: "Elegir idioma",
    tutorialCheck2: "Crear primera meta",
    tutorialCheck3: "Completar primera tarea",
    tutorialCta1: "Abrir ajustes",
    tutorialCta2: "Crear meta",
    tutorialCta3: "Ir a Today",
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
    todayTitle: "Today",
    goalsTitle: "Life Goals",
    progressTitle: "Progress",
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
    btnEdit: "Modifier",
    btnSave: "Enregistrer",
    btnRemove: "Supprimer",
    deleteGoalTitle: "Supprimer l'objectif",
    infoSubtitle: "Options et informations",
    infoMainSummary: "Info",
    infoMainP1: "Les petits pas battent la perfection.",
    infoMainP2: "La régularité compte plus que l'intensité.",
    infoListSummary: "Comment la liste du jour est créée",
    infoList1: "Life Goals est ton pool de tâches.",
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
    updateAvailable: "Nouvelle version disponible",
    updateNow: "Mettre à jour",
    updateRetry: "Vérifier encore",
    updateNote: "Des correctifs et améliorations sont prêts.",
    tutorialCheck1: "Choisir la langue",
    tutorialCheck2: "Créer le premier objectif",
    tutorialCheck3: "Terminer la première tâche",
    tutorialCta1: "Ouvrir réglages",
    tutorialCta2: "Créer objectif",
    tutorialCta3: "Aller à Today",
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
const todayISO = (offsetDays = 0) => {
  // Testmodus: Wir können das Datum um X Tage verschieben,
  // um die 3-Tage-Logik schnell zu testen.
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
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
  weeklyPlans: {},
  tutorialStep: 1,
  tutorialCompleted: false,
  onboardingStartDate: null,
  proEnabled: false,
  templatesOpenedOnce: false,
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
      difficulty: goal.difficulty || "noon",
    }));
    normalized.todayTasks = normalized.todayTasks.map((task) => ({
      ...task,
      difficulty: task.difficulty || "noon",
      doneAt: task.doneAt || null,
      isRestDay: task.isRestDay || false,
    }));
    normalized.quickTasks = normalized.quickTasks || {};
    normalized.quickTasksTomorrow = normalized.quickTasksTomorrow || {};
    normalized.sideQuests = normalized.sideQuests || [];
    normalized.sideQuestChecks = normalized.sideQuestChecks || {};
    normalized.completedDays = normalized.completedDays || {};
    normalized.daySummary = normalized.daySummary || {};
    normalized.weeklyPlans = normalized.weeklyPlans || {};
    normalized.tutorialStep = normalized.tutorialStep || 1;
    normalized.tutorialCompleted = normalized.tutorialCompleted || false;
    normalized.onboardingStartDate = normalized.onboardingStartDate || null;
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
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalDifficulty = document.getElementById("goal-difficulty");
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
const updateBanner = document.getElementById("update-banner");
const updateBannerText = document.getElementById("update-banner-text");
const updateBannerNote = document.getElementById("update-banner-note");
const updateBannerBtn = document.getElementById("update-banner-btn");
const updateBannerRetryBtn = document.getElementById("update-banner-retry");
const exportDataBtn = document.getElementById("export-data");
const importDataBtn = document.getElementById("import-data");
const importFileInput = document.getElementById("import-file");
const progressWeekRateEl = document.getElementById("progress-week-rate");
const progressMonthRateEl = document.getElementById("progress-month-rate");
const progressBestDayEl = document.getElementById("progress-best-day");
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
const SIDE_QUEST_REVEAL_SCROLL_MS = 520;

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

const setLanguage = (lang) => {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLanguage = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
  MOTIVATION = [...t("motivation")];
  applyStaticTranslations();
  renderAll(loadState());
  if (languageModal) languageModal.hidden = true;
  showToast(t("languageSaved"));
};

const showLanguageModalIfNeeded = () => {
  if (!languageModal) return;
  languageModal.hidden = !!currentLanguage;
};

const showUpdateBanner = (worker) => {
  if (!updateBanner || !worker) return;
  waitingServiceWorker = worker;
  if (updateBannerNote) {
    const s = STATIC_TEXT[currentLanguage] || STATIC_TEXT.de;
    updateBannerNote.textContent = `${s.updateNote} v${APP_VERSION}`;
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
  hideUpdateBanner();
  waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
};

const retryServiceWorkerUpdateCheck = async () => {
  if (!swRegistrationRef) return;
  try {
    await swRegistrationRef.update();
  } catch (error) {
    logClientError("sw_update_retry", error?.message || error);
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
  merged.streak = Math.max(Number(current.streak || 0), Number(incoming.streak || 0));
  merged.totalDone = Math.max(Number(current.totalDone || 0), Number(incoming.totalDone || 0));
  return merged;
};

const exportBackup = () => {
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

  setText("language-modal-title", t("chooseLanguage"));
  setText("language-modal-text", t("chooseLanguageText"));
  setText("tagline", t("tagline"));
  const welcomeTitle = welcomeSection?.querySelector("h1");
  const welcomeParagraphs = welcomeSection?.querySelectorAll("p");
  if (welcomeTitle) welcomeTitle.textContent = s.welcomeTitle;
  if (welcomeParagraphs?.length >= 2) {
    welcomeParagraphs[0].textContent = s.welcomeP1;
    welcomeParagraphs[1].textContent = s.welcomeP2;
  }
  setText("today-title", s.todayTitle);
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
    const btn = sideQuestForm.querySelector("button[type='submit']");
    if (btn) btn.textContent = t("btnSideQuestAdd");
  }
  const goalSubmit = goalForm?.querySelector("button[type='submit']");
  if (goalSubmit) goalSubmit.textContent = t("btnAdd");
  if (applyOffsetBtn) applyOffsetBtn.textContent = s.applyBtn;
  if (resetBtn) resetBtn.textContent = s.resetBtn;
  if (exportDataBtn) exportDataBtn.textContent = s.exportData;
  if (importDataBtn) importDataBtn.textContent = s.importData;
  if (simulatedDateEl) simulatedDateEl.textContent = `${s.simPrefix}: --`;
  if (progressWeekRateEl) progressWeekRateEl.textContent = `${s.progressWeekRate}: 0%`;
  if (progressMonthRateEl) progressMonthRateEl.textContent = `${s.progressMonthRate}: 0%`;
  if (progressBestDayEl) progressBestDayEl.textContent = `${s.progressBestDay}: -`;

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

  const diffOptions = goalDifficulty?.querySelectorAll("option");
  if (diffOptions?.length >= 3) {
    diffOptions[0].textContent = t("difficultyMorning").replace("🌅 ", "");
    diffOptions[1].textContent = t("difficultyNoon").replace("☀️ ", "");
    diffOptions[2].textContent = t("difficultyEvening").replace("🌙 ", "");
  }

  const navLabels = document.querySelectorAll(".nav-label");
  if (navLabels.length === 4) {
    navLabels[0].textContent = "Today";
    navLabels[1].textContent = "Goals";
    navLabels[2].textContent = "Progress";
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
  return {
    day,
    weeklyPlan: day >= 4,
    quickTasks: day >= 7,
    sideQuest: day >= 10,
    onboardingActive: day <= 12,
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
// Task-Logik: 3-Tage-Freischaltung
// ---------------------------
const shouldUnlockNewTask = (state) => {
  // Wenn noch nie freigeschaltet wurde, ist es sofort möglich.
  if (!state.lastTaskUnlockDate) return true;

  // Alle 3 Tage wird eine neue Aufgabe freigeschaltet.
  const diff = daysBetween(
    state.lastTaskUnlockDate,
    todayISO(state.simulationOffsetDays)
  );
  return diff >= 3;
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
    if (!entry.active) return false;
    return true;
  });
  if (candidates.length === 0) return null;

  // Zufällige Auswahl, damit die Erfahrung abwechslungsreich bleibt.
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
};

const ensureTodayTasks = (state) => {
  // Wenn das Datum wechselt, bleiben die Tasks sichtbar,
  // aber wir markieren sie als neue Tagesliste.
  const today = todayISO(state.simulationOffsetDays);
  const weekdayKey = weekdayKeyFromISO(today);

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
          isRestDay: hasActivePlan && entry && !entry.active,
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
  if (state.goals.length > 0 && state.todayTasks.length === 0) {
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
      isRestDay: hasActivePlan && entry && !entry.active,
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

const renderToday = (state) => {
  todayList.innerHTML = "";

  const quickTaskEntries = Object.values(state.quickTasks || {});
  const quickTomorrowEntries = Object.values(state.quickTasksTomorrow || {});
  const sideQuestEntries = state.sideQuests || [];
  const sideQuestFeatureEnabled = getFeatureAccess(state).sideQuest;
  const today = todayISO(state.simulationOffsetDays);
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
    const order = { morning: 0, noon: 1, evening: 2 };
    const sortedTasks = [...state.todayTasks].sort((a, b) => {
      const aOrder = order[a.difficulty] ?? 3;
      const bOrder = order[b.difficulty] ?? 3;
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

      const badge = document.createElement("span");
      badge.className = `difficulty ${task.difficulty}`;
      badge.textContent = difficultyLabel(task.difficulty);

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
        const restDay = hasActivePlan && entry && !entry.active;
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

    const badge = document.createElement("span");
    badge.className = `difficulty ${goal.difficulty}`;
    badge.textContent = difficultyLabel(goal.difficulty);

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
  const unlockMessages = {
    4: {
      title: t("unlockWeekTitle"),
      text: t("unlockWeekText"),
    },
    7: {
      title: t("unlockQuickTitle"),
      text: t("unlockQuickText"),
    },
    10: {
      title: t("unlockSideTitle"),
      text: t("unlockSideText"),
    },
  };

  if (tutorialSection) {
    if (tutorialChecklist) {
      tutorialChecklist.innerHTML = "";
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
      if (tutorialStepLabel) tutorialStepLabel.textContent = `${t("dayWord")} ${access.day}/12`;
      if (unlock) {
        if (tutorialTitle) tutorialTitle.textContent = unlock.title;
        if (tutorialText) tutorialText.textContent = unlock.text;
      } else {
        if (tutorialTitle) tutorialTitle.textContent = t("onboardingTitle");
        if (tutorialText) {
          tutorialText.textContent = t("onboardingText");
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
  const versionEl = document.getElementById("version");
  if (versionEl) {
    versionEl.textContent = state.proEnabled
      ? `Version ${APP_VERSION} Pro`
      : `Version ${APP_VERSION}`;
  }
};

const renderAll = (state) => {
  applyStaticTranslations();
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
  const updated = applyTutorial(state);
  applyMode(updated);
  saveState(updated);
  setActiveTab(currentTab);
};

// ---------------------------
// Actions
// ---------------------------
const addGoal = (title, difficulty) => {
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  const hadNoGoals = state.goals.length === 0;

  if (!state.onboardingStartDate) {
    state.onboardingStartDate = today;
  }

  state.goals.push({
    id: crypto.randomUUID(),
    title,
    difficulty,
    createdAt: today,
  });

  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);
  triggerHaptic(14);
  showToast(t("toastGoalAdded"));
  if (hadNoGoals) {
    setActiveTab("today");
  }
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

const addTaskFromGoal = (goalId) => {
  const state = loadState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  const today = todayISO(state.simulationOffsetDays);
  const weekdayKey = weekdayKeyFromISO(today);
  const plan = getPlanForGoal(state, goal.id);
  const entry = plan[weekdayKey];
  const hasActivePlan = planHasAnyActive(plan);
  state.todayTasks.push({
    id: crypto.randomUUID(),
    goalId: goal.id,
    label: getLabelForToday(goal, entry, hasActivePlan),
    difficulty: goal.difficulty,
    isRestDay: hasActivePlan && entry && !entry.active,
    done: false,
    doneAt: null,
    date: today,
  });

  // If this goal was tracked as a side quest, remove it once it joins the main routine.
  state.sideQuests = (state.sideQuests || []).filter((q) => q.goalId !== goalId);
  Object.keys(state.sideQuestChecks || {}).forEach((dateKey) => {
    if (!state.sideQuestChecks[dateKey]) return;
    delete state.sideQuestChecks[dateKey][goalId];
    if (Object.keys(state.sideQuestChecks[dateKey]).length === 0) {
      delete state.sideQuestChecks[dateKey];
    }
  });

  state.lastTaskUnlockDate = today;
  saveState(state);
  renderAll(state);
  triggerHaptic(14);
  showToast(t("toastTaskAdded"));
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
    defaults[d.key] = { active: false, text: "" };
  });
  return defaults;
};

const getWeekdayLabel = (key) => {
  const labels = I18N[currentLanguage]?.weekdays || I18N.de.weekdays;
  return labels[key] || key;
};

const getTemplateCategories = () =>
  I18N[currentLanguage]?.templates || I18N.de.templates;

const planHasAnyActive = (plan) =>
  WEEKDAYS.some((day) => plan[day.key]?.active);

const getLabelForToday = (goal, planEntry, hasActivePlan) => {
  if (hasActivePlan && planEntry && !planEntry.active) {
    return `Rest Day (${goal.title})`;
  }
  if (planEntry && planEntry.active && planEntry.text) {
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
  return !!(entry && !entry.active);
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
    const iso = d.toISOString().slice(0, 10);
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
    const weekStartISO = getWeekStartFromDate(date).toISOString().slice(0, 10);
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
    const iso = d.toISOString().slice(0, 10);
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

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = plan[day.key]?.active || false;
    if (checkbox.checked) activeCount += 1;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = t("planTaskPlaceholder");
    input.value = plan[day.key]?.text || "";
    input.disabled = !checkbox.checked;

    checkbox.addEventListener("change", () => {
      const stateNow = loadState();
      const currentPlan = getPlanForGoal(stateNow, selectedGoalId);
      currentPlan[day.key] = {
        active: checkbox.checked,
        text: checkbox.checked ? input.value : "",
      };
      stateNow.weeklyPlans[selectedGoalId] = currentPlan;
      saveState(stateNow);
      renderWeeklyPlan(stateNow);
    });

    input.addEventListener("input", () => {
      const stateNow = loadState();
      const currentPlan = getPlanForGoal(stateNow, selectedGoalId);
      currentPlan[day.key] = {
        active: checkbox.checked,
        text: input.value,
      };
      stateNow.weeklyPlans[selectedGoalId] = currentPlan;
      saveState(stateNow);
    });

    row.appendChild(label);
    row.appendChild(checkbox);
    row.appendChild(input);
    planGrid.appendChild(row);
  });

  if (activeCount < 4) {
    planHint.textContent = `${t("planNeed")} (${activeCount}).`;
  } else {
    planHint.textContent = `${t("planWeek")}: ${activeCount}`;
  }
};

const renderTemplates = () => {
  if (!templateCategories) return;
  templateCategories.innerHTML = "";

  getTemplateCategories().forEach((category) => {
    const wrapper = document.createElement("div");
    wrapper.className = "template-category";

    const title = document.createElement("div");
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
        const timeOfDay = goalDifficulty ? goalDifficulty.value : "noon";
        addGoal(item, timeOfDay);
      });
      items.appendChild(chip);
    });

    wrapper.appendChild(title);
    wrapper.appendChild(items);
    templateCategories.appendChild(wrapper);
  });
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
      void section.offsetHeight;
      section.classList.add("section-enter");
    }
  });
  if (currentTab !== previousTab) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
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
  const state = loadState();
  applyStaticTranslations();
  showLanguageModalIfNeeded();
  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);
  // Keep templates collapsed on every page load/start.
  if (templatesSection) {
    templatesSection.open = false;
  }
  const startTab = state.tutorialCompleted || state.tutorialStep >= 2 ? "today" : "goals";
  setActiveTab(startTab);

  if (!listenersBound) {
    goalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = goalInput.value.trim();
      if (!value) return;

      addGoal(value, goalDifficulty.value);
      goalInput.value = "";
    });

    applyOffsetBtn.addEventListener("click", () => {
      const value = Number(dayOffsetInput.value || 0);
      setSimulationOffset(value);
    });

    resetBtn.addEventListener("click", () => {
      const confirmed = window.confirm(t("resetConfirm"));
      if (!confirmed) return;
      // Vollständiger Reset: State + Sprache löschen, Defaults speichern, UI neu rendern.
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LANGUAGE_KEY);
      localStorage.removeItem(ERROR_LOG_KEY);
      currentLanguage = "";
      const fresh = defaultState();
      saveState(fresh);
      goalInput.value = "";
      dayOffsetInput.value = 0;
      applyStaticTranslations();
      renderAll(fresh);
      setActiveTab("goals");
      showLanguageModalIfNeeded();
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
      btn.addEventListener("click", () => setActiveTab(btn.dataset.target));
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
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
    });
    if (updateBannerBtn) {
      updateBannerBtn.addEventListener("click", requestServiceWorkerUpdate);
    }
    if (updateBannerRetryBtn) {
      updateBannerRetryBtn.addEventListener("click", retryServiceWorkerUpdateCheck);
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
  intro.textContent = t("unlockIntro");

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

  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + calendarOffset);

  const year = base.getFullYear();
  const month = base.getMonth();
  const monthName = base.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  calTitle.textContent = monthName;

  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calGrid.innerHTML = "";
  const headers = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
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
    const iso = new Date(year, month, day).toISOString().slice(0, 10);
    const summary = state.daySummary?.[iso];
    if (summary && summary.total > 0) {
      const percent = Math.max(0, Math.min(100, Math.round((summary.done / summary.total) * 100)));
      // Progress color gets stronger with higher completion.
      // 100% gets a dedicated strong style with outlined border.
      cell.classList.add("progress");
      cell.style.setProperty("--progress", String(percent));
      cell.title = `${summary.done}/${summary.total} erledigt (${percent}%)`;
      if (percent >= 100) {
        cell.classList.add("done-full");
      }
    }
    cell.textContent = String(day);
    calGrid.appendChild(cell);
  }
}

function difficultyLabel(value) {
  if (value === "morning") return t("difficultyMorning");
  if (value === "evening") return t("difficultyEvening");
  return t("difficultyNoon");
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
