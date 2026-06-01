import { useEffect, useState } from "react";
import { computeStreak, getMilestoneMessage } from "@/lib/streak";
import { useToast } from "@/hooks/use-toast";

export function useStreak() {
  const { toast } = useToast();
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    const { count, isFirstVisitToday, wasReset } = computeStreak();
    setStreakCount(count);

    if (!isFirstVisitToday) return;

    if (wasReset) {
      setTimeout(() => {
        toast({
          title: "Streak reset — but you're back! 💪",
          description: "Miss a day, lose the streak — but starting over is still showing up.",
          duration: 6000,
        });
      }, 2000);
      return;
    }

    const milestone = getMilestoneMessage(count);
    if (milestone) {
      setTimeout(() => {
        toast({
          title: `🔥 ${milestone}`,
          description: `${count} days visiting your tracker and keeping momentum alive.`,
          duration: 8000,
        });
        sendBrowserNotification(`🔥 ${count}-day streak!`, milestone);
      }, 2500);
    }
  }, [toast]);

  return { streakCount };
}

function sendBrowserNotification(title: string, body: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
