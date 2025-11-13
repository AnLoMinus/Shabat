const DATA_URL = "data/panel-content.json";
const ROTATION_FALLBACK_SECONDS = 25;

const currentTimeEl = document.getElementById("current-time");
const shabbatStatusEl = document.getElementById("shabbat-status");
const heroQuoteEl = document.getElementById("hero-text");
const heroEmojiEl = document.getElementById("hero-emoji");
const heroSourceEl = document.getElementById("hero-source");
const cardCategoryEl = document.getElementById("card-category");
const cardTitleEl = document.getElementById("card-title");
const cardDescriptionEl = document.getElementById("card-description");
const cardPracticalEl = document.getElementById("card-practical");
const cardActionEl = document.getElementById("card-action");
const cardReflectionEl = document.getElementById("card-reflection");
const cardReflectionSectionEl = document.getElementById("card-reflection-section");
const tickerListEl = document.getElementById("ticker-list");
const nextCardTitleEl = document.getElementById("next-card-title");
const nextCardCategoryEl = document.getElementById("next-card-category");
const metaInfoEl = document.getElementById("meta-info");
const progressFillEl = document.getElementById("progress-bar-fill");
const fullscreenTriggerEl = document.getElementById("fullscreen-trigger");

let cards = [];
let tickerMessages = [];
let rotationSeconds = ROTATION_FALLBACK_SECONDS;
let shabbatTimes = null;
let currentIndex = 0;
let progressIntervalId = null;
let rotationTimeoutId = null;

init().catch((error) => {
  console.error("שגיאה בטעינת הפאנל:", error);
  heroQuoteEl.textContent = "שגיאה בטעינת התוכן. נסו לרענן את העמוד.";
});

async function init() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load panel data (${response.status})`);
  }

  const data = await response.json();
  cards = Array.isArray(data.cards) ? data.cards : [];
  tickerMessages = Array.isArray(data.ticker) ? data.ticker : [];
  rotationSeconds = Number(data.settings?.rotationSeconds) || ROTATION_FALLBACK_SECONDS;
  shabbatTimes = data.shabbatTimes ?? null;

  if (!cards.length) {
    throw new Error("No cards found in panel data.");
  }

  buildTicker();
  startClock();
  showCard(0);

  fullscreenTriggerEl.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenLabel);
  updateFullscreenLabel();
}

function buildTicker() {
  tickerListEl.innerHTML = "";
  tickerMessages.forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    tickerListEl.appendChild(li);
  });
}

function startClock() {
  const updateTime = () => {
    const now = new Date();
    currentTimeEl.textContent = now.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });
    shabbatStatusEl.textContent = buildShabbatStatus(now);
  };

  updateTime();
  setInterval(updateTime, 1000);
}

function buildShabbatStatus(now) {
  if (!shabbatTimes) {
    return "ברוכים הבאים לפאנל שבת";
  }

  const entry = shabbatTimes.entry ? new Date(shabbatTimes.entry) : null;
  const exit = shabbatTimes.exit ? new Date(shabbatTimes.exit) : null;
  const city = shabbatTimes.city ?? "ירושלים";

  if (entry && now < entry) {
    return `כניסת שבת ב${city} בעוד ${formatDuration(entry - now)}`;
  }
  if (exit && now >= entry && now <= exit) {
    return `שבת ב${city} בעיצומה · מוצאי שבת בעוד ${formatDuration(exit - now)}`;
  }
  if (exit && now > exit) {
    return `שבת הסתיימה ב${city} לפני ${formatDuration(now - exit)}`;
  }

  return `שבת ב${city}`;
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

function showCard(index) {
  if (!cards.length) return;

  currentIndex = index % cards.length;
  const card = cards[currentIndex];
  const nextCard = cards[(currentIndex + 1) % cards.length];

  heroEmojiEl.textContent = card.media?.emoji ?? "✨";
  heroQuoteEl.textContent = card.quote ?? card.title ?? "שבת שלום";
  heroSourceEl.textContent = card.quoteSource ?? "";

  cardCategoryEl.textContent = card.category ?? "השראה";
  cardTitleEl.textContent = card.title ?? "קלף שבת";
  cardDescriptionEl.textContent = card.description ?? "";
  cardPracticalEl.textContent = card.practical ?? "";
  cardActionEl.textContent = card.action ?? "";

  updateReflection(card.reflection);
  updateBackground(card.media?.background);
  updateMetaInfo(card);

  nextCardTitleEl.textContent = nextCard.title ?? "קלף נוסף";
  nextCardCategoryEl.textContent = `קטגוריה: ${nextCard.category ?? "כללי"}`;

  restartRotationTimer();
}

function updateReflection(reflection) {
  cardReflectionEl.innerHTML = "";

  if (!reflection || !reflection.length) {
    cardReflectionSectionEl.style.display = "none";
    return;
  }

  cardReflectionSectionEl.style.display = "";
  reflection.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    cardReflectionEl.appendChild(li);
  });
}

function updateBackground(imagePath) {
  const body = document.body;
  if (imagePath) {
    body.style.setProperty(
      "--panel-overlay",
      `linear-gradient(120deg, rgba(11, 26, 45, 0.85), rgba(18, 42, 68, 0.85)), url('${imagePath}') center/cover no-repeat`
    );
    body.style.backgroundImage = `var(--panel-overlay)`;
  } else {
    body.style.backgroundImage = "linear-gradient(120deg, #0b1a2d, #122a44, #1f3d5c)";
  }
}

function updateMetaInfo(card) {
  const setLabel = card.batch ? `סט ${card.batch}` : "סט שבת";
  const idLabel = card.id ? `קלף #${String(card.id).padStart(3, "0")}` : "";
  metaInfoEl.textContent = `${setLabel}${idLabel ? " · " + idLabel : ""}`;
}

function restartRotationTimer() {
  if (rotationTimeoutId) {
    clearTimeout(rotationTimeoutId);
  }
  if (progressIntervalId) {
    clearInterval(progressIntervalId);
  }

  animateProgress(rotationSeconds);
  rotationTimeoutId = setTimeout(() => {
    showCard((currentIndex + 1) % cards.length);
  }, rotationSeconds * 1000);
}

function animateProgress(seconds) {
  const start = Date.now();
  progressFillEl.style.width = "0%";

  progressIntervalId = setInterval(() => {
    const elapsed = (Date.now() - start) / 1000;
    const percent = Math.min(100, (elapsed / seconds) * 100);
    progressFillEl.style.width = `${percent}%`;
    if (elapsed >= seconds) {
      clearInterval(progressIntervalId);
    }
  }, 250);
}

function updateFullscreenLabel() {
  const isFullscreen = Boolean(document.fullscreenElement);
  fullscreenTriggerEl.textContent = isFullscreen ? "יציאה ממסך מלא" : "מסך מלא";
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("שגיאה בכניסה למסך מלא:", err);
    });
  } else {
    document.exitFullscreen().catch((err) => {
      console.error("שגיאה ביציאה ממסך מלא:", err);
    });
  }
}

