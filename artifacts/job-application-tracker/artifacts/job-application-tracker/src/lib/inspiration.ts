export const INSPIRATION_QUOTES = [
  {
    message: "Every 'no' brings you one step closer to the right 'yes'. Keep going.",
    author: "Job search wisdom",
  },
  {
    message: "Rejection is redirection. The role that truly fits you is still ahead.",
    author: "Job search wisdom",
  },
  {
    message: "You are not defined by one company's decision. Your worth is immeasurable.",
    author: "Job search wisdom",
  },
  {
    message: "The most successful people collected the most rejections before their breakthrough.",
    author: "Job search wisdom",
  },
  {
    message: "This wasn't the right fit — and that protects you for the opportunity that is.",
    author: "Job search wisdom",
  },
  {
    message: "Your skills, your story, your potential — none of that changed today.",
    author: "Job search wisdom",
  },
  {
    message: "Hiring is imperfect. You are not. Dust off and keep moving forward.",
    author: "Job search wisdom",
  },
  {
    message: "Every expert was once rejected. This is part of the path, not the end of it.",
    author: "Job search wisdom",
  },
  {
    message: "You showed up, you applied, you tried. That courage counts every single time.",
    author: "Job search wisdom",
  },
  {
    message: "The right team will recognize what you bring. They're out there — keep looking.",
    author: "Job search wisdom",
  },
];

const DAILY_KEY = "last_inspiration_date";

export function getRandomQuote(): (typeof INSPIRATION_QUOTES)[0] {
  return INSPIRATION_QUOTES[Math.floor(Math.random() * INSPIRATION_QUOTES.length)];
}

export function shouldShowDailyInspiration(): boolean {
  const last = localStorage.getItem(DAILY_KEY);
  if (!last) return true;
  const lastDate = new Date(last);
  const today = new Date();
  return (
    lastDate.getFullYear() !== today.getFullYear() ||
    lastDate.getMonth() !== today.getMonth() ||
    lastDate.getDate() !== today.getDate()
  );
}

export function markDailyInspirationShown(): void {
  localStorage.setItem(DAILY_KEY, new Date().toISOString());
}
