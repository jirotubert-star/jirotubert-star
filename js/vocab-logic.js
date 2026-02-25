(function (root) {
  const normalizeText = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s'-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const levenshteinDistance = (a, b) => {
    const x = normalizeText(a);
    const y = normalizeText(b);
    if (x === y) return 0;
    if (!x.length) return y.length;
    if (!y.length) return x.length;

    const rows = x.length + 1;
    const cols = y.length + 1;
    const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 0; i < rows; i += 1) dp[i][0] = i;
    for (let j = 0; j < cols; j += 1) dp[0][j] = j;

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = x[i - 1] === y[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[x.length][y.length];
  };

  const isWriteAnswerAccepted = (input, expected, toleranceCfg = 1) => {
    const normalizedInput = normalizeText(input);
    const normalizedExpected = normalizeText(expected);
    if (!normalizedInput || !normalizedExpected) return false;
    if (normalizedInput === normalizedExpected) return true;
    const tolerance = Number.isFinite(Number(toleranceCfg)) ? Math.max(0, Number(toleranceCfg)) : 0;
    return levenshteinDistance(normalizedInput, normalizedExpected) <= tolerance;
  };

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const buildMcqOptions = (correctItem, pool, direction = "fr-de", count = 4) => {
    const answerKey = direction === "de-fr" ? "fr" : "de";
    const correctValue = correctItem?.[answerKey] || "";
    const distractors = shuffleArray(
      (pool || [])
        .filter((item) => item?.id !== correctItem?.id)
        .map((item) => item?.[answerKey])
        .filter((value) => value && value !== correctValue)
    );

    const picks = [correctValue, ...distractors.slice(0, Math.max(0, count - 1))];
    return shuffleArray(picks);
  };

  const scoreAnswer = (mode, payload = {}) => {
    if (mode === "quicktest") {
      const correct = payload.selected === payload.expected;
      return { correct, expected: payload.expected, received: payload.selected || "" };
    }
    if (mode === "write") {
      const correct = isWriteAnswerAccepted(payload.input, payload.expected, payload.tolerance);
      return { correct, expected: payload.expected, received: payload.input || "" };
    }
    const correct = Boolean(payload.correct);
    return { correct, expected: payload.expected || "", received: payload.received || "" };
  };

  const updateVocabProgress = (stateSlice, result) => {
    const next = JSON.parse(JSON.stringify(stateSlice || {}));
    next.byTheme = next.byTheme || {};
    next.daily = next.daily || {};

    const themeId = result.themeId;
    const iso = result.dateISO;
    next.byTheme[themeId] = next.byTheme[themeId] || {
      learnedIds: [],
      correctCount: 0,
      wrongCount: 0,
      lastTrainedDate: null,
    };
    next.daily[iso] = next.daily[iso] || { correct: 0, wrong: 0, sessions: 0 };

    const theme = next.byTheme[themeId];
    const day = next.daily[iso];

    if (result.correct) {
      theme.correctCount += 1;
      day.correct += 1;
      if (result.itemId && !theme.learnedIds.includes(result.itemId)) {
        theme.learnedIds.push(result.itemId);
      }
    } else {
      theme.wrongCount += 1;
      day.wrong += 1;
    }
    theme.lastTrainedDate = iso;

    return next;
  };

  const computeVocabStreak = (progress, todayIso, dailyGoal) => {
    const daily = progress?.daily || {};
    const goal = Number.isFinite(Number(dailyGoal)) ? Number(dailyGoal) : 10;
    let streak = 0;
    let cursor = new Date(`${todayIso}T00:00:00`);

    while (true) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      const day = daily[iso];
      if (!day || Number(day.correct || 0) < goal) break;
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
      if (streak > 3660) break;
    }
    return streak;
  };

  const api = {
    normalizeText,
    levenshteinDistance,
    isWriteAnswerAccepted,
    buildMcqOptions,
    scoreAnswer,
    updateVocabProgress,
    computeVocabStreak,
    shuffleArray,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.VocabLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
