(function (root) {
  const STORAGE_KEY = "delf-a2-vocab-progress";
  const LEGACY_STORAGE_KEYS = [
    "delf-a2-vocab-progress-v5",
    "delf-a2-vocab-progress-v4",
    "delf-a2-vocab-progress-v3",
    "delf-a2-vocab-progress-v2",
  ];
  const DEFAULT_ACTIVE_BATCH_SIZE = 6;
  const DEFAULT_HISTORY_SIZE = 5;
  const TARGET_PERCENT = 90;
  const MATCH_PAIR_COUNT = 5;
  const TEST_OPTION_COUNT = 4;

  let hostEl = null;
  let initialized = false;
  let vocabulary = {};
  let categories = [];
  let state = null;

  const shuffle = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const flattenVocabulary = (selectedCategories) =>
    selectedCategories.flatMap((category) =>
      (vocabulary[category] || []).map((item) => ({
        de: item.de,
        fr: item.fr,
        category,
        id: item.id || `${category}__${item.de}__${item.fr}`,
      }))
    );

  const normalizeStoredState = (raw) => {
    if (!raw || typeof raw !== "object") {
      return {
        cardStats: {},
        activeBatchSize: DEFAULT_ACTIVE_BATCH_SIZE,
        historySize: DEFAULT_HISTORY_SIZE,
      };
    }

    return {
      cardStats: raw.cardStats && typeof raw.cardStats === "object" ? raw.cardStats : {},
      activeBatchSize:
        typeof raw.activeBatchSize === "number" && raw.activeBatchSize > 0
          ? raw.activeBatchSize
          : DEFAULT_ACTIVE_BATCH_SIZE,
      historySize:
        typeof raw.historySize === "number" && raw.historySize > 0
          ? raw.historySize
          : DEFAULT_HISTORY_SIZE,
    };
  };

  const persistTrainerState = (cardStats, activeBatchSize, historySize) => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({
      cardStats,
      activeBatchSize,
      historySize,
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
    LEGACY_STORAGE_KEYS.forEach((key) => {
      if (key !== STORAGE_KEY) window.localStorage.setItem(key, payload);
    });
  };

  const loadTrainerState = () => {
    if (typeof window === "undefined") return normalizeStoredState(null);
    const keysToTry = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
    for (const key of keysToTry) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const normalized = normalizeStoredState(parsed);
        persistTrainerState(normalized.cardStats, normalized.activeBatchSize, normalized.historySize);
        return normalized;
      } catch (_err) {
        continue;
      }
    }
    return normalizeStoredState(null);
  };

  const getSuccessHistory = (stats, id) => stats[id]?.history || [];

  const getKnownPercent = (stats, id) => {
    const history = getSuccessHistory(stats, id);
    if (!history.length) return 0;
    const successCount = history.filter(Boolean).length;
    return Math.round((successCount / history.length) * 100);
  };

  const isLearned = (stats, id, historySize) => {
    const history = getSuccessHistory(stats, id);
    return history.length === historySize && getKnownPercent(stats, id) >= TARGET_PERCENT;
  };

  const buildActivePool = (cards, stats, activeBatchSize, historySize) => {
    const unlearned = cards.filter((card) => !isLearned(stats, card.id, historySize));
    return shuffle(unlearned).slice(0, activeBatchSize);
  };

  const buildFlashcardCycle = (activePool, excludedId = null) => {
    const source =
      excludedId && activePool.length > 1
        ? activePool.filter((card) => card.id !== excludedId)
        : activePool;
    return shuffle(source);
  };

  const buildMatchRound = (allCards, excludeIds = []) => {
    const preferredPool = allCards.filter((card) => !excludeIds.includes(card.id));
    const sourcePool =
      preferredPool.length >= Math.min(MATCH_PAIR_COUNT, allCards.length) ? preferredPool : allCards;
    const pairs = shuffle(sourcePool).slice(0, Math.min(MATCH_PAIR_COUNT, sourcePool.length));

    return {
      pairs,
      leftItems: shuffle(pairs.map((card) => ({ side: "left", cardId: card.id, label: card.de }))),
      rightItems: shuffle(pairs.map((card) => ({ side: "right", cardId: card.id, label: card.fr }))),
    };
  };

  const applyResultsToStats = (stats, results, historySize) => {
    const nextStats = { ...stats };
    results.forEach(({ card, known }) => {
      const previous = getSuccessHistory(nextStats, card.id);
      nextStats[card.id] = {
        history: [...previous, known].slice(-historySize),
      };
    });
    return nextStats;
  };

  const refreshPoolAfterResults = (activePool, availableCards, nextStats, activeBatchSize, historySize) => {
    const stillActive = activePool.filter((card) => !isLearned(nextStats, card.id, historySize));
    const usedIds = new Set(stillActive.map((card) => card.id));
    const replacements = shuffle(
      availableCards.filter((card) => !usedIds.has(card.id) && !isLearned(nextStats, card.id, historySize))
    );
    const completedPool = [...stillActive];
    while (completedPool.length < activeBatchSize && replacements.length > 0) {
      completedPool.push(replacements.shift());
    }
    return completedPool;
  };

  const filterStatsForCategories = (stats, categoriesToReset) => {
    const prefixes = new Set(categoriesToReset.map((category) => `${category}__`));
    return Object.fromEntries(
      Object.entries(stats).filter(([id]) => !Array.from(prefixes).some((prefix) => id.startsWith(prefix)))
    );
  };

  const buildTestQuestion = (cards, direction, excludedId = null) => {
    if (!cards.length) return null;
    const pool = excludedId && cards.length > 1 ? cards.filter((card) => card.id !== excludedId) : cards;
    const correctCard = shuffle(pool)[0] || pool[0];
    if (!correctCard) return null;
    const correctAnswer = direction === "de-fr" ? correctCard.fr : correctCard.de;
    const distractors = shuffle(
      cards
        .filter((card) => card.id !== correctCard.id)
        .map((card) => (direction === "de-fr" ? card.fr : card.de))
        .filter((value, index, array) => array.indexOf(value) === index && value !== correctAnswer)
    ).slice(0, Math.max(0, TEST_OPTION_COUNT - 1));

    return {
      card: correctCard,
      prompt: direction === "de-fr" ? correctCard.de : correctCard.fr,
      correctAnswer,
      options: shuffle([correctAnswer, ...distractors]),
    };
  };

  const ensureState = () => {
    if (state) return;
    const persisted = loadTrainerState();
    state = {
      selectedCategories: [],
      direction: "de-fr",
      mode: "flashcards",
      showAnswer: false,
      activeBatchSize: persisted.activeBatchSize,
      historySize: persisted.historySize,
      sessionKnownCount: 0,
      sessionUnknownCount: 0,
      matchRound: { pairs: [], leftItems: [], rightItems: [] },
      selectedLeft: null,
      selectedRight: null,
      matchedIds: [],
      wrongLeftId: null,
      wrongRightId: null,
      matchFeedback: "",
      categoryResetTarget: "",
      pendingReset: null,
      testQuestion: null,
      testAnswered: false,
      selectedTestAnswer: "",
      testScore: { correct: 0, wrong: 0 },
      cardStats: persisted.cardStats,
      activePool: [],
      flashcardQueue: [],
      current: null,
      loading: true,
    };
  };

  const syncTrainerState = () => {
    persistTrainerState(state.cardStats, state.activeBatchSize, state.historySize);
  };

  const availableCards = () => {
    const selected = state.selectedCategories.length ? state.selectedCategories : categories;
    return flattenVocabulary(selected);
  };

  const learnedCards = () => availableCards().filter((card) => isLearned(state.cardStats, card.id, state.historySize));
  const learningCards = () => availableCards().filter((card) => !isLearned(state.cardStats, card.id, state.historySize));

  const resetInteractionState = () => {
    state.matchedIds = [];
    state.selectedLeft = null;
    state.selectedRight = null;
    state.wrongLeftId = null;
    state.wrongRightId = null;
    state.matchFeedback = "";
    state.showAnswer = false;
    state.testAnswered = false;
    state.selectedTestAnswer = "";
  };

  const rebuildLearningState = (statsOverride = state.cardStats, batchOverride = state.activeBatchSize, historyOverride = state.historySize) => {
    const cards = availableCards();
    state.activePool = buildActivePool(cards, statsOverride, batchOverride, historyOverride);
    state.matchRound = buildMatchRound(cards, []);
    state.flashcardQueue = buildFlashcardCycle(state.activePool);
    state.current = state.flashcardQueue[0] || null;
    resetInteractionState();
  };

  const commitStatsOnly = (results, statsBase = state.cardStats) => {
    const knownAdds = results.filter((result) => result.known).length;
    const unknownAdds = results.filter((result) => !result.known).length;
    state.sessionKnownCount += knownAdds;
    state.sessionUnknownCount += unknownAdds;
    const nextStats = applyResultsToStats(statsBase, results, state.historySize);
    state.cardStats = nextStats;
    syncTrainerState();
    return nextStats;
  };

  const buildNextTestQuestion = (excludedId = null) => {
    state.testQuestion = buildTestQuestion(learnedCards(), state.direction, excludedId);
    state.testAnswered = false;
    state.selectedTestAnswer = "";
  };

  const finishMatchingRound = (statsOverride) => {
    const refreshedPool = refreshPoolAfterResults(
      state.activePool,
      availableCards(),
      statsOverride,
      state.activeBatchSize,
      state.historySize
    );
    state.activePool = refreshedPool;
    state.matchRound = buildMatchRound(availableCards(), state.matchRound.pairs.map((card) => card.id));
    state.flashcardQueue = buildFlashcardCycle(refreshedPool, state.current?.id || null);
    state.current = state.flashcardQueue[0] || null;
    resetInteractionState();
    state.matchFeedback = "Neue Matching-Runde gestartet.";
  };

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const render = () => {
    if (!hostEl) return;
    if (state.loading) {
      hostEl.innerHTML = '<div class="delf-card delf-loading">Vokabeltrainer wird geladen...</div>';
      return;
    }

    const current = state.current;
    const question = current ? (state.direction === "de-fr" ? current.de : current.fr) : "Keine Karten verfügbar";
    const answer = current ? (state.direction === "de-fr" ? current.fr : current.de) : "";
    const learned = learnedCards();
    const learning = learningCards();
    const learnedPercent = availableCards().length
      ? Math.round((learned.length / availableCards().length) * 100)
      : 0;

    const matchingLeft = state.matchRound.leftItems
      .filter((item) => state.matchedIds.includes(item.cardId))
      .concat(state.matchRound.leftItems.filter((item) => !state.matchedIds.includes(item.cardId)));
    const matchingRight = state.matchRound.rightItems
      .filter((item) => state.matchedIds.includes(item.cardId))
      .concat(state.matchRound.rightItems.filter((item) => !state.matchedIds.includes(item.cardId)));

    hostEl.innerHTML = `
      ${state.pendingReset ? `
        <div class="delf-modal-backdrop">
          <div class="delf-modal-card">
            <h3>Reset bestätigen</h3>
            <p>${state.pendingReset.type === "all"
              ? "Willst du wirklich den gesamten Fortschritt zurücksetzen?"
              : `Willst du wirklich die Kategorie „${escapeHtml(state.pendingReset.category)}“ zurücksetzen?`}</p>
            <div class="delf-modal-actions">
              <button type="button" class="btn ghost" data-action="cancel-reset">Abbrechen</button>
              <button type="button" class="btn ghost delf-danger-btn" data-action="confirm-reset">Reset ausführen</button>
            </div>
          </div>
        </div>` : ""}
      <div class="delf-shell">
        <div class="delf-card">
          <h1>DELF A2 Vokabeltrainer</h1>
          <p>Karteikarten und Verbindungsmodus mit gemeinsamer Themenauswahl.</p>
        </div>

        <div class="delf-card delf-config-grid">
          <label>
            <span>Aktive Wörter gleichzeitig</span>
            <input id="delf-active-batch-size" type="number" min="1" max="30" value="${state.activeBatchSize}" />
          </label>
          <label>
            <span>Gespeicherte letzte Antworten</span>
            <input id="delf-history-size" type="number" min="1" max="20" value="${state.historySize}" />
          </label>
          <div class="delf-reset-row">
            <label>
              <span>Einzelne Kategorie zurücksetzen</span>
              <select id="delf-category-reset-target">
                <option value="">Kategorie wählen</option>
                ${categories.map((category) => `
                  <option value="${escapeHtml(category)}" ${state.categoryResetTarget === category ? "selected" : ""}>${escapeHtml(category)}</option>
                `).join("")}
              </select>
            </label>
            <button type="button" class="btn ghost" data-action="reset-category">Kategorie resetten</button>
          </div>
        </div>

        <div class="delf-main-grid">
          <div class="delf-card">
            <div class="delf-toolbar">
              <button type="button" class="${state.mode === "flashcards" ? "delf-chip is-active" : "delf-chip"}" data-set-mode="flashcards">Karteikarten</button>
              <button type="button" class="${state.mode === "matching" ? "delf-chip is-active" : "delf-chip"}" data-set-mode="matching">Verbinden</button>
              <button type="button" class="${state.mode === "test" ? "delf-chip is-active" : "delf-chip"}" data-set-mode="test">Vokabeltest</button>
              <button type="button" class="${state.direction === "de-fr" ? "delf-chip is-active" : "delf-chip"}" data-set-direction="de-fr">Deutsch → Französisch</button>
              <button type="button" class="${state.direction === "fr-de" ? "delf-chip is-active" : "delf-chip"}" data-set-direction="fr-de">Französisch → Deutsch</button>
            </div>

            ${state.mode === "flashcards" ? `
              <div class="delf-study-card">
                <div>
                  <div class="delf-meta-line">Kategorie: <strong>${escapeHtml(current?.category || "-")}</strong></div>
                  <div class="delf-meta-line">
                    Trefferquote dieses Wortes: <strong>${current ? getKnownPercent(state.cardStats, current.id) : 0}%</strong>
                    ${current ? `(${getSuccessHistory(state.cardStats, current.id).length}/${state.historySize} Antworten)` : ""}
                  </div>
                  <div class="delf-question">${escapeHtml(question)}</div>
                  ${state.showAnswer ? `
                    <div class="delf-answer-block">
                      <div class="delf-answer-label">Antwort</div>
                      <div class="delf-answer-text">${escapeHtml(answer)}</div>
                    </div>` : ""}
                </div>
                <div class="delf-actions">
                  <button type="button" class="btn" data-action="toggle-answer">${state.showAnswer ? "Antwort ausblenden" : "Antwort zeigen"}</button>
                  <button type="button" class="btn ghost" data-action="mark-known">Gewusst</button>
                  <button type="button" class="btn ghost" data-action="mark-unknown">Nochmal lernen</button>
                  <button type="button" class="btn ghost" data-action="next-card">Überspringen</button>
                </div>
              </div>` : ""}

            ${state.mode === "test" ? `
              <div class="delf-study-card">
                <div class="delf-header-inline">
                  <div>
                    <div class="delf-meta-line">Testet nur gelernte Wörter aus den ausgewählten Themen</div>
                    <div class="delf-section-title">Vokabeltest</div>
                  </div>
                  <div class="delf-score-box">
                    <div>Richtig: ${state.testScore.correct}</div>
                    <div>Falsch: ${state.testScore.wrong}</div>
                  </div>
                </div>
                ${!learned.length || !state.testQuestion ? `
                  <div class="delf-empty-box">Für die aktuell ausgewählten Themen gibt es noch keine gelernten Wörter für den Test.</div>
                ` : `
                  <div class="delf-question-box">
                    <div class="delf-answer-label">Frage</div>
                    <div class="delf-question">${escapeHtml(state.testQuestion.prompt)}</div>
                  </div>
                  <div class="delf-option-list">
                    ${state.testQuestion.options.map((option) => {
                      const isCorrect = option === state.testQuestion.correctAnswer;
                      const isSelected = state.selectedTestAnswer === option;
                      let className = "delf-option-btn";
                      if (state.testAnswered) {
                        if (isCorrect) className += " is-correct";
                        else if (isSelected) className += " is-wrong";
                      }
                      return `<button type="button" class="${className}" data-test-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`;
                    }).join("")}
                  </div>
                  <div class="delf-actions">
                    <button type="button" class="btn ghost" data-action="next-test">Nächste Testfrage</button>
                    <button type="button" class="btn ghost" data-action="reset-test">Test neu starten</button>
                  </div>`}
              </div>` : ""}

            ${state.mode === "matching" ? `
              <div class="delf-study-card">
                <div class="delf-header-inline">
                  <div>
                    <div class="delf-meta-line">Verbinde 5 Vokabelpaare</div>
                    <div class="delf-section-title">Richtig = grün, falsch = kurz rot, danach nochmal probieren</div>
                  </div>
                  <div class="delf-score-box">Gelöst: ${state.matchedIds.length} / ${state.matchRound.pairs.length}</div>
                </div>
                ${state.matchFeedback ? `<div class="delf-feedback">${escapeHtml(state.matchFeedback)}</div>` : ""}
                <div class="delf-match-grid">
                  <div class="delf-option-list">
                    ${matchingLeft.map((item) => {
                      let className = "delf-option-btn";
                      if (state.matchedIds.includes(item.cardId)) className += " is-correct";
                      else if (state.wrongLeftId === item.cardId) className += " is-wrong";
                      else if (state.selectedLeft?.cardId === item.cardId) className += " is-selected";
                      return `<button type="button" class="${className}" data-match-side="left" data-card-id="${escapeHtml(item.cardId)}" ${state.matchedIds.includes(item.cardId) ? "disabled" : ""}>${escapeHtml(item.label)}</button>`;
                    }).join("")}
                  </div>
                  <div class="delf-option-list">
                    ${matchingRight.map((item) => {
                      let className = "delf-option-btn";
                      if (state.matchedIds.includes(item.cardId)) className += " is-correct";
                      else if (state.wrongRightId === item.cardId) className += " is-wrong";
                      else if (state.selectedRight?.cardId === item.cardId) className += " is-selected";
                      return `<button type="button" class="${className}" data-match-side="right" data-card-id="${escapeHtml(item.cardId)}" ${state.matchedIds.includes(item.cardId) ? "disabled" : ""}>${escapeHtml(item.label)}</button>`;
                    }).join("")}
                  </div>
                </div>
              </div>` : ""}
          </div>

          <div class="delf-card">
            <h2>Themen auswählen</h2>
            <div class="delf-theme-list">
              ${categories.map((category) => {
                const active = state.selectedCategories.includes(category);
                return `
                  <button type="button" class="${active ? "delf-theme-btn is-active" : "delf-theme-btn"}" data-toggle-category="${escapeHtml(category)}">
                    <div>${escapeHtml(category)}</div>
                    <div class="delf-theme-meta">${vocabulary[category].length} Karten</div>
                  </button>`;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="delf-stats-grid">
          <div class="delf-card"><div class="delf-stat-label">Aktive Lernwörter</div><div class="delf-stat-value">${state.activePool.length} / ${state.activeBatchSize}</div></div>
          <div class="delf-card"><div class="delf-stat-label">Gewusst in dieser Sitzung</div><div class="delf-stat-value">${state.sessionKnownCount}</div></div>
          <div class="delf-card"><div class="delf-stat-label">Nochmal lernen in dieser Sitzung</div><div class="delf-stat-value">${state.sessionUnknownCount}</div></div>
          <div class="delf-card"><div class="delf-stat-label">Gelernt</div><div class="delf-stat-value">${learnedPercent}%</div><div class="delf-meta-line">${learned.length} von ${availableCards().length} Wörtern haben 90%+ bei den letzten ${state.historySize} Antworten.</div></div>
          <div class="delf-card delf-wide-card">
            <div class="delf-stat-label">Lernlogik</div>
            <p>Es sind immer maximal ${state.activeBatchSize} Wörter gleichzeitig aktiv. Im Karteikarten-Modus wird zuerst jedes aktive Wort genau einmal pro Durchgang abgefragt. Erst wenn alle aktiven Wörter einmal dran waren, wird der nächste zufällige Durchgang mit denselben aktiven Wörtern erzeugt. Sobald ein Wort bei diesen ${state.historySize} Antworten mindestens 90% richtige Antworten hat, wird es aus der aktiven Liste entfernt und durch ein neues Wort ersetzt.</p>
            <div class="delf-learning-grid">
              <div class="delf-mini-card"><strong>Noch lernen</strong><span>${learning.length} Wörter</span></div>
              <div class="delf-mini-card"><strong>Schon gelernt</strong><span>${learned.length} Wörter</span></div>
            </div>
          </div>
        </div>

        <div class="delf-card delf-reset-footer">
          <button type="button" class="btn ghost delf-danger-btn" data-action="reset-all">Gesamten Fortschritt zurücksetzen</button>
        </div>
      </div>`;
  };

  const handleMatchingSelection = (side, cardId) => {
    if (state.matchedIds.includes(cardId)) return;
    if (state.wrongLeftId || state.wrongRightId) return;
    const item = side === "left"
      ? state.matchRound.leftItems.find((entry) => entry.cardId === cardId)
      : state.matchRound.rightItems.find((entry) => entry.cardId === cardId);
    if (!item) return;
    if (side === "left") state.selectedLeft = item;
    else state.selectedRight = item;

    if (!state.selectedLeft || !state.selectedRight) {
      render();
      return;
    }

    const leftCard = state.matchRound.pairs.find((card) => card.id === state.selectedLeft.cardId);
    const rightCard = state.matchRound.pairs.find((card) => card.id === state.selectedRight.cardId);
    if (!leftCard || !rightCard) {
      state.selectedLeft = null;
      state.selectedRight = null;
      render();
      return;
    }

    if (state.selectedLeft.cardId === state.selectedRight.cardId) {
      const nextStats = commitStatsOnly([{ card: leftCard, known: true }], state.cardStats);
      state.matchedIds = [...state.matchedIds, leftCard.id];
      state.matchFeedback = "Richtig verbunden.";
      state.selectedLeft = null;
      state.selectedRight = null;
      render();
      if (state.matchedIds.length >= state.matchRound.pairs.length) {
        window.setTimeout(() => {
          finishMatchingRound(nextStats);
          render();
        }, 250);
      }
      return;
    }

    state.matchFeedback = "Falsch verbunden.";
    state.wrongLeftId = state.selectedLeft.cardId;
    state.wrongRightId = state.selectedRight.cardId;
    commitStatsOnly([
      { card: leftCard, known: false },
      { card: rightCard, known: false },
    ], state.cardStats);
    render();
    window.setTimeout(() => {
      state.wrongLeftId = null;
      state.wrongRightId = null;
      state.selectedLeft = null;
      state.selectedRight = null;
      state.matchFeedback = "";
      render();
    }, 650);
  };

  const handleClick = (event) => {
    const actionEl = event.target.closest("[data-action], [data-set-mode], [data-set-direction], [data-toggle-category], [data-test-answer], [data-match-side]");
    if (!actionEl) return;

    if (actionEl.dataset.setMode) {
      state.mode = actionEl.dataset.setMode;
      state.showAnswer = false;
      if (state.mode === "test") buildNextTestQuestion();
      render();
      return;
    }

    if (actionEl.dataset.setDirection) {
      state.direction = actionEl.dataset.setDirection;
      state.showAnswer = false;
      if (state.mode === "test") buildNextTestQuestion();
      render();
      return;
    }

    if (actionEl.dataset.toggleCategory) {
      const category = actionEl.dataset.toggleCategory;
      state.showAnswer = false;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter((item) => item !== category);
      } else {
        state.selectedCategories = [...state.selectedCategories, category];
      }
      rebuildLearningState();
      if (state.mode === "test") buildNextTestQuestion();
      render();
      return;
    }

    if (actionEl.dataset.testAnswer) {
      if (!state.testQuestion || state.testAnswered) return;
      const option = actionEl.dataset.testAnswer;
      const isCorrect = option === state.testQuestion.correctAnswer;
      state.selectedTestAnswer = option;
      if (isCorrect) {
        state.testScore.correct += 1;
        render();
        window.setTimeout(() => {
          buildNextTestQuestion(state.testQuestion.card.id);
          render();
        }, 300);
      } else {
        state.testAnswered = true;
        state.testScore.wrong += 1;
        render();
      }
      return;
    }

    if (actionEl.dataset.matchSide) {
      handleMatchingSelection(actionEl.dataset.matchSide, actionEl.dataset.cardId);
      return;
    }

    const action = actionEl.dataset.action;
    if (action === "toggle-answer") {
      state.showAnswer = !state.showAnswer;
    } else if (action === "mark-known" || action === "mark-unknown") {
      if (state.current) {
        const nextStats = commitStatsOnly([{ card: state.current, known: action === "mark-known" }], state.cardStats);
        state.matchRound = buildMatchRound(availableCards(), state.matchRound.pairs.map((card) => card.id));
        state.activePool = refreshPoolAfterResults(
          state.activePool,
          availableCards(),
          nextStats,
          state.activeBatchSize,
          state.historySize
        );
        const remainingQueue = state.flashcardQueue.slice(1);
        state.flashcardQueue = remainingQueue.length > 0 ? remainingQueue : buildFlashcardCycle(state.activePool, state.current.id);
        state.current = state.flashcardQueue[0] || null;
        resetInteractionState();
      }
    } else if (action === "next-card") {
      state.showAnswer = false;
      const remainingQueue = state.flashcardQueue.slice(1);
      state.flashcardQueue = remainingQueue.length > 0 ? remainingQueue : buildFlashcardCycle(state.activePool, state.current?.id || null);
      state.current = state.flashcardQueue[0] || null;
    } else if (action === "next-test") {
      buildNextTestQuestion(state.testQuestion?.card?.id || null);
    } else if (action === "reset-test") {
      state.testScore = { correct: 0, wrong: 0 };
      buildNextTestQuestion();
    } else if (action === "reset-all") {
      state.pendingReset = { type: "all" };
    } else if (action === "reset-category") {
      if (state.categoryResetTarget) state.pendingReset = { type: "category", category: state.categoryResetTarget };
    } else if (action === "cancel-reset") {
      state.pendingReset = null;
    } else if (action === "confirm-reset") {
      if (state.pendingReset?.type === "all") {
        state.sessionKnownCount = 0;
        state.sessionUnknownCount = 0;
        state.categoryResetTarget = "";
        state.cardStats = {};
        window.localStorage.removeItem(STORAGE_KEY);
        persistTrainerState({}, state.activeBatchSize, state.historySize);
        rebuildLearningState({}, state.activeBatchSize, state.historySize);
        buildNextTestQuestion();
      } else if (state.pendingReset?.category) {
        state.cardStats = filterStatsForCategories(state.cardStats, [state.pendingReset.category]);
        syncTrainerState();
        rebuildLearningState(state.cardStats, state.activeBatchSize, state.historySize);
        buildNextTestQuestion();
      }
      state.pendingReset = null;
    }
    render();
  };

  const handleInput = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.id === "delf-active-batch-size") {
      state.activeBatchSize = Math.max(1, Math.min(30, Number(target.value) || 1));
      syncTrainerState();
      rebuildLearningState();
      if (state.mode === "test") buildNextTestQuestion();
      render();
      return;
    }
    if (target.id === "delf-history-size") {
      state.historySize = Math.max(1, Math.min(20, Number(target.value) || 1));
      syncTrainerState();
      rebuildLearningState();
      if (state.mode === "test") buildNextTestQuestion();
      render();
      return;
    }
    if (target.id === "delf-category-reset-target") {
      state.categoryResetTarget = target.value;
    }
  };

  const bindEvents = () => {
    if (!hostEl || initialized) return;
    hostEl.addEventListener("click", handleClick);
    hostEl.addEventListener("input", handleInput);
    initialized = true;
  };

  const convertSeedThemesToVocabulary = (seed) => {
    const result = {};
    (seed?.themes || []).forEach((theme) => {
      result[theme.title] = (theme.items || []).map((item) => ({
        de: item.de,
        fr: item.fr,
        id: item.id,
      }));
    });
    return result;
  };

  const loadVocabulary = async () => {
    const response = await fetch("./data/vocab.fr-de.a2.json", { cache: "no-store" });
    const seed = await response.json();
    vocabulary = convertSeedThemesToVocabulary(seed);
    categories = Object.keys(vocabulary);
    if (!state.selectedCategories.length) {
      state.selectedCategories = categories.slice(0, Math.min(4, categories.length));
    }
    rebuildLearningState();
    buildNextTestQuestion();
    state.loading = false;
    render();
  };

  const mount = (host) => {
    if (!host) return;
    hostEl = host;
    ensureState();
    bindEvents();
    render();
    if (state.loading) {
      loadVocabulary().catch(() => {
        state.loading = false;
        hostEl.innerHTML = '<div class="delf-card delf-loading">Vokabeldaten konnten nicht geladen werden.</div>';
      });
    }
  };

  root.DelfVocabTrainer = { mount };
})(typeof window !== "undefined" ? window : globalThis);
