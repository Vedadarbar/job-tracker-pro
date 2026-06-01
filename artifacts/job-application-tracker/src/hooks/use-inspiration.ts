import { useEffect, useRef } from "react";
import {
  getRandomQuote,
  shouldShowDailyInspiration,
  markDailyInspirationShown,
} from "@/lib/inspiration";
import { useToast } from "@/hooks/use-toast";
import type { JobApplication } from "@/lib/types";

function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function sendBrowserNotification(title: string, body: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body, silent: false });
  }
}

export function useInspiration(applications: JobApplication[], isLoaded: boolean) {
  const { toast } = useToast();
  const dailyFiredRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || dailyFiredRef.current) return;
    if (!shouldShowDailyInspiration()) return;

    dailyFiredRef.current = true;
    markDailyInspirationShown();

    const quote = getRandomQuote();
    const rejectedCount = applications.filter((a) => a.status === "Rejected").length;
    const title = rejectedCount > 0 ? `💛 Keep going — you've got this` : `💛 Good to see you today`;

    toast({
      title,
      description: `"${quote.message}"`,
      duration: 9000,
    });

    requestNotificationPermission();
    setTimeout(() => {
      sendBrowserNotification(title.replace(/💛 /, ""), quote.message);
    }, 500);
  }, [isLoaded, applications, toast]);

  function showRejectionAlert(company: string) {
    const quote = getRandomQuote();
    const title = `One door closed at ${company}`;
    const body = quote.message;

    toast({
      title: `💛 ${title}`,
      description: `"${body}"`,
      duration: 8000,
    });

    sendBrowserNotification(title, body);
  }

  return { showRejectionAlert };
}
