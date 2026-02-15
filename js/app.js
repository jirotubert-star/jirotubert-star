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
const APP_VERSION = "1.5.14";

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
const consistencyEl = document.getElementById("consistency");
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
const modeHint = document.getElementById("mode-hint");
const templateCategories = document.getElementById("template-categories");
const templatesSection = document.getElementById("templates-section");
const navItems = document.querySelectorAll(".bottom-nav .nav-item");
const sections = document.querySelectorAll("[data-section]");
const tutorialSection = document.getElementById("tutorial");
const tutorialTitle = document.getElementById("tutorial-title");
const tutorialStepLabel = document.getElementById("tutorial-step");
const tutorialText = document.getElementById("tutorial-text");
let currentTab = "today";
const tabOrder = ["today", "goals", "progress", "info"];
let touchStartX = null;
let touchStartY = null;
let touchStartTime = null;
let trackingPointerId = null;
let tutorialStepCache = 1;
let tutorialCompletedCache = false;
let sideQuestVisibleCache = false;
const SIDE_QUEST_REVEAL_SCROLL_MS = 520;

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
    empty.textContent = "Noch keine Tagesaufgaben – füge ein Ziel hinzu.";
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
      badge.textContent = "Einmalig";

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
      head.textContent = "Side Quest";
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

        const badge = document.createElement("span");
        badge.className = "difficulty noon";
        badge.textContent = "Side Quest";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "btn ghost side-quest-remove";
        removeBtn.textContent = "Entfernen";
        removeBtn.addEventListener("click", () => removeSideQuest(goal.id));

        labelEl.appendChild(checkbox);
        labelEl.appendChild(frame);
        labelEl.appendChild(text);
        li.appendChild(labelEl);
        li.appendChild(badge);
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
      head.textContent = "Morgen";
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
      badge.textContent = "Morgen";

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

  todayCount.textContent = `${state.todayTasks.length + quickTaskEntries.length} Aufgaben`;
};

const renderGoals = (state) => {
  goalsList.innerHTML = "";
  const activeGoalIds = new Set(state.todayTasks.map((task) => task.goalId));

  if (state.goals.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "Noch keine Ziele – beginne mit einem kleinen Schritt.";
    goalsList.appendChild(empty);
    return;
  }

  state.goals.forEach((goal) => {
    const li = document.createElement("li");
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
      saveBtn.textContent = "Speichern";
      saveBtn.addEventListener("click", () => finishEditGoal(goal.id, input.value));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "btn ghost goal-delete";
      removeBtn.textContent = "Entfernen";
      removeBtn.disabled = false;
      removeBtn.title = "Ziel entfernen";
      removeBtn.addEventListener("click", () => deleteGoal(goal.id));

      li.appendChild(input);
      li.appendChild(saveBtn);
      li.appendChild(removeBtn);
    } else {
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn ghost goal-edit";
      editBtn.textContent = "Bearbeiten";
      editBtn.addEventListener("click", () => startEditGoal(goal.id));

      li.appendChild(title);
      li.appendChild(badge);
      li.appendChild(editBtn);
    }
    goalsList.appendChild(li);
  });
};

const renderProgress = (state) => {
  streakEl.textContent = state.streak;
  totalDoneEl.textContent = state.totalDone;
  if (consistencyEl) {
    consistencyEl.textContent = `${computeWeeklyConsistency(state)}%`;
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
  const today = todayISO(state.simulationOffsetDays);
  const actionable = state.todayTasks.filter(
    (t) => !isRestDayForTask(state, t, today) && !t.isRestDay
  );
  const quickList = Object.values(state.quickTasks || {});
  const anyDone = actionable.some((t) => t.done) || quickList.some((t) => t.done);

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
      title: "Neu freigeschaltet: Wochenplan",
      text: "Heute ist der Wochenplan aktiv. Du findest ihn bei Goals ganz unten. Plane mindestens 4 Tage, damit deine Routine stabil und realistisch bleibt.",
    },
    7: {
      title: "Neu freigeschaltet: Einmalige Aufgaben",
      text: "Heute sind einmalige Aufgaben aktiv. Nutze sie für spontane To-dos, ohne deine Hauptziele zu verwässern.",
    },
    10: {
      title: "Neu freigeschaltet: Side Quest",
      text: "Heute ist Side Quest aktiv. Wähle bis zu 5 Ziele, die später Teil deiner Routine werden sollen.",
    },
  };

  if (tutorialSection) {
    if (!state.tutorialCompleted) {
      tutorialSection.style.display = "block";
      tutorialSection.classList.remove("unlock-highlight");
      if (tutorialTitle) tutorialTitle.textContent = "Start";
      if (tutorialStepLabel) tutorialStepLabel.textContent = `Schritt ${state.tutorialStep}/3`;
      if (tutorialText) {
        if (state.tutorialStep === 1) {
          tutorialText.textContent = "Lege dein erstes Ziel an. Danach erscheint deine erste Tagesaufgabe.";
        } else if (state.tutorialStep === 2) {
          tutorialText.textContent = "Hake heute eine Aufgabe ab. Danach werden alle Bereiche freigeschaltet.";
        } else {
          tutorialText.textContent = "Super! Alle Bereiche sind jetzt freigeschaltet.";
        }
      }
    } else if (access.onboardingActive) {
      tutorialSection.style.display = "block";
      const unlock = unlockMessages[access.day];
      tutorialSection.classList.toggle("unlock-highlight", !!unlock);
      if (tutorialStepLabel) tutorialStepLabel.textContent = `Tag ${access.day}/12`;
      if (unlock) {
        if (tutorialTitle) tutorialTitle.textContent = unlock.title;
        if (tutorialText) tutorialText.textContent = unlock.text;
      } else {
        if (tutorialTitle) tutorialTitle.textContent = "Onboarding aktiv";
        if (tutorialText) {
          if (access.day <= 3) {
            tutorialText.textContent = "Fokus auf die Hauptfunktionen: Ziele anlegen und Today-Liste abhaken. Weitere Funktionen werden schrittweise freigeschaltet.";
          } else if (access.day <= 6) {
            tutorialText.textContent = "Nutze jetzt den Wochenplan, um deine Tage zu strukturieren. Die nächsten Funktionen folgen in den kommenden Tagen.";
          } else if (access.day <= 9) {
            tutorialText.textContent = "Einmalige Aufgaben sind aktiv. Hauptaufgaben bleiben Priorität, einmalige Aufgaben sind nur Ergänzung.";
          } else {
            tutorialText.textContent = "Side Quests sind aktiv. Nutze sie für zukünftige Routinen, während deine Kernziele stabil bleiben.";
          }
        }
      }
    } else {
      tutorialSection.style.display = "none";
      tutorialSection.classList.remove("unlock-highlight");
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
  renderToday(state);
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
    option.textContent = "Maximal 3 Side Quests erreicht";
    sideQuestSelect.appendChild(option);
    sideQuestSelect.disabled = true;
    return;
  }

  if (options.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Keine weiteren Ziele verfügbar";
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
};

const toggleSideQuest = (goalId, textEl, labelEl) => {
  const state = loadState();
  const today = todayISO(state.simulationOffsetDays);
  state.sideQuestChecks = state.sideQuestChecks || {};
  state.sideQuestChecks[today] = state.sideQuestChecks[today] || {};
  const nowDone = !state.sideQuestChecks[today][goalId];
  state.sideQuestChecks[today][goalId] = nowDone;
  saveState(state);

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
  { key: "mon", label: "Montag" },
  { key: "tue", label: "Dienstag" },
  { key: "wed", label: "Mittwoch" },
  { key: "thu", label: "Donnerstag" },
  { key: "fri", label: "Freitag" },
  { key: "sat", label: "Samstag" },
  { key: "sun", label: "Sonntag" },
];

const TEMPLATE_CATEGORIES = [
  {
    title: "Fitness & Bewegung",
    items: [
      "10.000 Schritte",
      "5 km Lauf",
      "Krafttraining 20 Min",
      "Mobility 10 Min",
      "2 L Wasser täglich",
      "Treppen statt Aufzug",
      "Dehnen 8 Min",
      "Radfahren 30 Min",
      "Schwimmen 30 Min",
      "Spaziergang 20 Min",
    ],
  },
  {
    title: "Ausdauer & Cardio",
    items: [
      "Intervalltraining 15 Min",
      "Zügiger Walk 30 Min",
      "Rudern 20 Min",
      "Treppenläufe 10 Min",
      "Seilspringen 5 Min",
      "2 L Wasser täglich",
      "Ergometer 20 Min",
      "Joggen 20 Min",
      "Atemtraining 5 Min",
      "Cooldown 5 Min",
    ],
  },
  {
    title: "Ernährung",
    items: [
      "Proteinreiche Mahlzeit",
      "Gemüse zu jeder Mahlzeit",
      "Zuckerfrei heute",
      "2 L Wasser täglich",
      "Intervallfasten 14/10",
      "Kein Softdrink",
      "Gesundes Frühstück",
      "Küchen‑Reset 10 Min",
      "Supplements morgens",
      "Spätessen vermeiden",
    ],
  },
  {
    title: "Schlaf & Erholung",
    items: [
      "22:30 ins Bett",
      "Abendroutine 15 Min",
      "Bildschirmfrei 30 Min",
      "Nickerchen 20 Min",
      "Tagebuch 5 Min",
      "Stretching 10 Min",
      "Koffein nur bis 14 Uhr",
      "Schlafraum lüften",
      "Wasser neben Bett",
      "Atemübung 5 Min",
    ],
  },
  {
    title: "Lernen",
    items: [
      "20 Min Lesen",
      "1 Kapitel Kurs",
      "Vokabeln 15 Min",
      "Notizen ordnen",
      "1 Übungsaufgabe",
      "Wiederholung 10 Min",
      "Lernziel definieren",
      "Karteikarten 10 Min",
      "Podcast 15 Min",
      "Zusammenfassung schreiben",
    ],
  },
  {
    title: "Fokus & Produktivität",
    items: [
      "1 Deep‑Work‑Block",
      "Inbox auf Null",
      "Top‑3 Aufgaben",
      "Meeting‑Notizen",
      "Ablenkungen aus",
      "5‑Minuten Planung",
      "1 schwierige Aufgabe",
      "Dateien sortieren",
      "Arbeitsplatz reset",
      "Pomodoro x2",
    ],
  },
  {
    title: "Mindset",
    items: [
      "Dankbarkeit 3 Punkte",
      "Kurze Meditation",
      "Affirmation schreiben",
      "1 Erkenntnis notieren",
      "Negatives reframen",
      "Zielvisualisierung",
      "Mini‑Reflexion",
      "Atemübung 4‑7‑8",
      "Heute stolz sein",
      "Abendlicher Rückblick",
    ],
  },
  {
    title: "Haushalt",
    items: [
      "10 Min Aufräumen",
      "Wäsche starten",
      "Bad kurz reinigen",
      "Geschirr sofort",
      "Müll rausbringen",
      "Küche wischen",
      "Bett machen",
      "Oberflächen abwischen",
      "Schreibtisch clean",
      "Einkaufsliste",
    ],
  },
  {
    title: "Soziales",
    items: [
      "Nachricht an Freund",
      "Anruf Familie",
      "Danke sagen",
      "Treffen planen",
      "Kurzes Check‑in",
      "Kompliment geben",
      "Hilfsangebot",
      "Antworten auf Mails",
      "Geburtstag merken",
      "Zeit bewusst teilen",
    ],
  },
  {
    title: "Selbstentwicklung",
    items: [
      "Neue Gewohnheit testen",
      "Skill 20 Min üben",
      "1 kleiner Mut‑Schritt",
      "Feedback einholen",
      "Lernziel definieren",
      "Plan für morgen",
      "Eigenes Projekt 30 Min",
      "Ziel reviewen",
      "Fortschritt tracken",
      "Mini‑Challenge",
    ],
  },
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

const computeWeeklyConsistency = (state) => {
  const today = todayISO(state.simulationOffsetDays);
  const date = new Date(today + "T00:00:00");
  const day = date.getDay();
  const mondayOffset = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - mondayOffset);

  let plannedDays = 0;
  let completedDays = 0;

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const summary = state.daySummary?.[iso];
    if (!summary || summary.total === 0) continue;
    plannedDays += 1;
    if (summary.done >= summary.total) completedDays += 1;
  }

  if (plannedDays === 0) return 0;
  return Math.round((completedDays / plannedDays) * 100);
};

const renderWeeklyPlan = (state) => {
  if (!planGoalSelect || !planGrid || !planHint) return;

  const previousSelection = planGoalSelect.value;
  planGoalSelect.innerHTML = "";
  if (state.goals.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Zuerst ein Ziel anlegen";
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
    label.textContent = day.label;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = plan[day.key]?.active || false;
    if (checkbox.checked) activeCount += 1;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "z. B. 5 km Lauf / Schwimmen / Rest Day";
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
    planHint.textContent = `Bitte mindestens 4 Tage eintragen (aktuell ${activeCount}).`;
  } else {
    planHint.textContent = `Woche geplant: ${activeCount} Tage.`;
  }
};

const renderTemplates = () => {
  if (!templateCategories) return;
  templateCategories.innerHTML = "";

  TEMPLATE_CATEGORIES.forEach((category) => {
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
      setActiveTab("goals");
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
  if (value === "morning") return "🌅 Morgens";
  if (value === "evening") return "🌙 Abends";
  return "☀️ Mittags";
}

init();
