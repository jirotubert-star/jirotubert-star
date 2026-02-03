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
const todayISO = (offsetDays = 0) => {
  // Testmodus: Wir können das Datum um X Tage verschieben,
  // um die 3-Tage-Logik schnell zu testen.
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
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
  lastTaskUnlockDate: null,
  lastActiveDate: null,
  streak: 0,
  totalDone: 0,
  simulationOffsetDays: 0,
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
      difficulty: goal.difficulty || "medium",
    }));
    normalized.todayTasks = normalized.todayTasks.map((task) => ({
      ...task,
      difficulty: task.difficulty || "medium",
      doneAt: task.doneAt || null,
    }));
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
const goalForm = document.getElementById("goal-form");
const goalInput = document.getElementById("goal-input");
const goalDifficulty = document.getElementById("goal-difficulty");
const streakEl = document.getElementById("streak");
const totalDoneEl = document.getElementById("total-done");
const motivationEl = document.getElementById("motivation");
const dayOffsetInput = document.getElementById("day-offset");
const applyOffsetBtn = document.getElementById("apply-offset");
const simulatedDateEl = document.getElementById("simulated-date");
const resetBtn = document.getElementById("reset-app");

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
  const diff = daysBetween(
    state.lastTaskUnlockDate,
    todayISO(state.simulationOffsetDays)
  );
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
  const today = todayISO(state.simulationOffsetDays);

  // Wenn wir noch keine Tasks für heute haben, setzen wir das Datum neu.
  if (!state.todayTasks.length || state.todayTasks[0].date !== today) {
    state.todayTasks = state.todayTasks.map((task) => ({
      ...task,
      date: today,
      done: false,
      doneAt: null,
    }));
  }

  // Erster Start: genau eine Aufgabe aus Zielen hinzufügen.
  if (state.goals.length > 0 && state.todayTasks.length === 0) {
    const firstGoal = state.goals[0];
    state.todayTasks.push({
      id: crypto.randomUUID(),
      goalId: firstGoal.id,
      label: firstGoal.title,
      difficulty: firstGoal.difficulty,
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

      const badge = document.createElement("span");
      badge.className = `difficulty ${task.difficulty}`;
      badge.textContent = difficultyLabel(task.difficulty);

      label.appendChild(checkbox);
      label.appendChild(span);
      li.appendChild(label);
      li.appendChild(badge);
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
    const title = document.createElement("span");
    title.textContent = goal.title;
    const badge = document.createElement("span");
    badge.className = `difficulty ${goal.difficulty}`;
    badge.textContent = difficultyLabel(goal.difficulty);
    li.appendChild(title);
    li.appendChild(badge);
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
  renderUnlock(state);
  renderToday(state);
  renderGoals(state);
  renderProgress(state);
  renderSimulatedDate(state);
};

// ---------------------------
// Actions
// ---------------------------
const addGoal = (title, difficulty) => {
  const state = loadState();

  state.goals.push({
    id: crypto.randomUUID(),
    title,
    difficulty,
    createdAt: todayISO(state.simulationOffsetDays),
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
    const today = todayISO(state.simulationOffsetDays);
    // Wurde die Aufgabe heute schon gezählt, nicht erneut erhöhen.
    if (task.doneAt !== today) {
      state.totalDone += 1;
      task.doneAt = today;
      updateStreak(state);
    }
  }

  saveState(state);
  renderAll(state);
};

const addTaskFromGoal = (goalId) => {
  const state = loadState();
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;

  const today = todayISO(state.simulationOffsetDays);
  state.todayTasks.push({
    id: crypto.randomUUID(),
    goalId: goal.id,
    label: goal.title,
    difficulty: goal.difficulty,
    done: false,
    doneAt: null,
    date: today,
  });

  state.lastTaskUnlockDate = today;
  saveState(state);
  renderAll(state);
};

const addRandomTask = () => {
  const state = loadState();
  const goal = pickTaskFromGoals(state);
  if (!goal) return;
  addTaskFromGoal(goal.id);
};

const setSimulationOffset = (value) => {
  const state = loadState();
  state.simulationOffsetDays = value;
  saveState(state);
  init();
};

// ---------------------------
// Initialisierung
// ---------------------------
let listenersBound = false;

const init = () => {
  const state = loadState();
  ensureTodayTasks(state);
  updateStreak(state);
  saveState(state);
  renderAll(state);

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
      const confirmed = window.confirm(
        "Möchtest du wirklich alles zurücksetzen? (Ziele, Fortschritt, Aufgaben)"
      );
      if (!confirmed) return;
      // Vollständiger Reset: State löschen, Defaults speichern, UI neu rendern.
      localStorage.removeItem(STORAGE_KEY);
      const fresh = defaultState();
      saveState(fresh);
      goalInput.value = "";
      dayOffsetInput.value = 0;
      renderAll(fresh);
    });

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
  intro.textContent =
    "3 Tage sind vorbei – du kannst eine weitere Aufgabe hinzufügen oder zufällig auswählen.";

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
  addBtn.textContent = "Hinzufügen";
  addBtn.addEventListener("click", () => addTaskFromGoal(select.value));

  const randomBtn = document.createElement("button");
  randomBtn.type = "button";
  randomBtn.className = "btn ghost";
  randomBtn.textContent = "Zufällig auswählen";
  randomBtn.addEventListener("click", addRandomTask);

  row.appendChild(select);
  row.appendChild(addBtn);
  row.appendChild(randomBtn);

  unlockControls.appendChild(intro);
  unlockControls.appendChild(row);
}

function renderSimulatedDate(state) {
  dayOffsetInput.value = state.simulationOffsetDays;
  simulatedDateEl.textContent = `Heute: ${todayISO(state.simulationOffsetDays)}`;
}

function difficultyLabel(value) {
  if (value === "easy") return "Einfach";
  if (value === "hard") return "Schwer";
  return "Mittel";
}

init();
