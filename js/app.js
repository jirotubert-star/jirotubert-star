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

// ---------------------------
// Grundlegende Zeit-Utilities
// ---------------------------
const todayISO = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

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
  lastTaskUnlockDate: null,
  lastActiveDate: null,
  streak: 0,
  totalDone: 0,
});

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState();

  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
    };
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
const goalsList = document.getElementById("goals-list");
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const streakEl = document.getElementById("streak");
const totalDoneEl = document.getElementById("total-done");
const motivationEl = document.getElementById("motivation");

// ---------------------------
// Motivationstexte
// ---------------------------
const MOTIVATION = [
  "Klein, ruhig, konstant – dein Weg entsteht Schritt für Schritt.",
  "Ein erfüllter Tag beginnt mit einer machbaren Aufgabe.",
  "Du musst heute nicht perfekt sein – nur präsent.",
  "Langsamer Fortschritt ist echter Fortschritt.",
  "Deine Energie zählt. Ein kleiner Schritt reicht.",
];

// ---------------------------
// Task-Logik: 3-Tage-Freischaltung
// ---------------------------
const shouldUnlockNewTask = (state) => {
  // Wenn noch nie freigeschaltet wurde, ist es sofort möglich.
  if (!state.lastTaskUnlockDate) return true;

  // Alle 3 Tage wird eine neue Aufgabe freigeschaltet.
  const diff = daysBetween(state.lastTaskUnlockDate, todayISO());
  return diff >= 3;
};

const pickTaskFromGoals = (state) => {
  // Wählt ein Goal aus, das heute noch nicht in der Checkliste ist.
  const usedGoalIds = new Set(state.todayTasks.map((t) => t.goalId));
  const candidates = state.goals.filter((g) => !usedGoalIds.has(g.id));
  if (candidates.length === 0) return null;

  // Zufällige Auswahl, damit die Erfahrung abwechslungsreich bleibt.
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
};

const ensureTodayTasks = (state) => {
  // Wenn das Datum wechselt, bleiben die Tasks sichtbar,
  // aber wir markieren sie als neue Tagesliste.
  const today = todayISO();

  // Wenn wir noch keine Tasks für heute haben, setzen wir das Datum neu.
  if (!state.todayTasks.length || state.todayTasks[0].date !== today) {
    state.todayTasks = state.todayTasks.map((task) => ({
      ...task,
      date: today,
      done: false,
    }));
  }

  // Erster Start: genau eine Aufgabe aus Zielen hinzufügen.
  if (state.goals.length > 0 && state.todayTasks.length === 0) {
    const firstGoal = state.goals[0];
    state.todayTasks.push({
      id: crypto.randomUUID(),
      goalId: firstGoal.id,
      label: firstGoal.title,
      done: false,
      date: today,
    });
    state.lastTaskUnlockDate = today;
  }

  // Alle 3 Tage eine weitere Aufgabe freischalten.
  if (state.goals.length > 0 && shouldUnlockNewTask(state)) {
    const newGoal = pickTaskFromGoals(state);
    if (newGoal) {
      state.todayTasks.push({
        id: crypto.randomUUID(),
        goalId: newGoal.id,
        label: newGoal.title,
        done: false,
        date: today,
      });
      state.lastTaskUnlockDate = today;
    }
  }
};

// ---------------------------
// Streak-Logik
// ---------------------------
const updateStreak = (state) => {
  const today = todayISO();

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

  if (state.todayTasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Noch keine Tagesaufgaben – füge ein Ziel hinzu.";
    todayList.appendChild(empty);
  } else {
    state.todayTasks.forEach((task) => {
      const li = document.createElement("li");
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => toggleTask(task.id));

      const span = document.createElement("span");
      span.textContent = task.label;
      if (task.done) span.classList.add("done");

      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      todayList.appendChild(li);
    });
  }

  todayCount.textContent = `${state.todayTasks.length} Aufgaben`;
};

const renderGoals = (state) => {
  goalsList.innerHTML = "";

  if (state.goals.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Noch keine Ziele – beginne mit einem kleinen Schritt.";
    goalsList.appendChild(empty);
    return;
  }

  state.goals.forEach((goal) => {
    const li = document.createElement("li");
    li.textContent = goal.title;
    goalsList.appendChild(li);
  });
};

const renderProgress = (state) => {
  streakEl.textContent = state.streak;
  totalDoneEl.textContent = state.totalDone;

  const message = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
  motivationEl.textContent = message;
};

const renderAll = (state) => {
  renderWelcome(state);
  renderToday(state);
  renderGoals(state);
  renderProgress(state);
};

// ---------------------------
// Actions
// ---------------------------
const addGoal = (title) => {
  const state = loadState();

  state.goals.push({
    id: crypto.randomUUID(),
    title,
    createdAt: todayISO(),
  });

  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);
};

const toggleTask = (taskId) => {
  const state = loadState();
  const task = state.todayTasks.find((t) => t.id === taskId);
  if (!task) return;

  task.done = !task.done;

  if (task.done) {
    state.totalDone += 1;
    updateStreak(state);
  }

  saveState(state);
  renderAll(state);
};

// ---------------------------
// Initialisierung
// ---------------------------
const init = () => {
  const state = loadState();
  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);

  goalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = goalInput.value.trim();
    if (!value) return;

    addGoal(value);
    goalInput.value = "";
  });
};

init();
