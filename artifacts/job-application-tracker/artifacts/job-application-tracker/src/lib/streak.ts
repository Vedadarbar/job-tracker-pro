const STREAK_COUNT_KEY = "jt_streak_count";
const STREAK_DATE_KEY = "jt_streak_date";

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface StreakResult {
  count: number;
  isFirstVisitToday: boolean;
  wasReset: boolean;
}

export function computeStreak(): StreakResult {
  const today = toDateStr(new Date());
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000));
  const lastDate = localStorage.getItem(STREAK_DATE_KEY) ?? "";
  const stored = parseInt(localStorage.getItem(STREAK_COUNT_KEY) ?? "0", 10);

  if (lastDate === today) {
    return { count: stored, isFirstVisitToday: false, wasReset: false };
  }

  let count: number;
  let wasReset = false;

  if (lastDate === yesterday) {
    count = stored + 1;
  } else if (lastDate === "") {
    count = 1;
  } else {
    count = 1;
    wasReset = stored > 1;
  }

  localStorage.setItem(STREAK_COUNT_KEY, String(count));
  localStorage.setItem(STREAK_DATE_KEY, today);

  return { count, isFirstVisitToday: true, wasReset };
}

export function getStoredStreak(): number {
  return parseInt(localStorage.getItem(STREAK_COUNT_KEY) ?? "0", 10);
}

const MILESTONE_MESSAGES: Record<number, string> = {
  3:   "3-day streak! You're building real momentum.",
  7:   "One full week! Consistency is your superpower.",
  14:  "Two weeks straight! This is becoming a habit.",
  30:  "30 days! You're a job-search legend. 🏆",
  60:  "60 days of dedication. Absolutely unstoppable.",
  100: "100-day streak. You are extraordinary.",
};

export function getMilestoneMessage(count: number): string | null {
  return MILESTONE_MESSAGES[count] ?? null;
}
