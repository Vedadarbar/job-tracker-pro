import { useMemo } from "react";
import { format, isPast, isToday, isFuture, addDays, parseISO, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, AlarmClock, CalendarClock, CheckCheck, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobApplication } from "@/lib/types";

interface ReminderItem {
  app: JobApplication;
  type: "overdue" | "today" | "upcoming";
  daysUntil: number;
}

interface RemindersPanelProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onSnooze: (id: string, days: number) => void;
  onMarkDone: (id: string) => void;
}

export function RemindersPanel({
  applications,
  onEdit,
  onSnooze,
  onMarkDone,
}: RemindersPanelProps) {
  const reminders = useMemo((): ReminderItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return applications
      .filter((app) => app.followUpDate && app.status !== "Rejected" && app.status !== "Withdrawn" && app.status !== "Offer")
      .map((app) => {
        const d = parseISO(app.followUpDate!);
        d.setHours(0, 0, 0, 0);
        const daysUntil = differenceInDays(d, today);
        let type: ReminderItem["type"] = "upcoming";
        if (daysUntil < 0) type = "overdue";
        else if (daysUntil === 0) type = "today";
        else if (daysUntil <= 7) type = "upcoming";
        else return null;
        return { app, type, daysUntil } as ReminderItem;
      })
      .filter((r): r is ReminderItem => r !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [applications]);

  const overdue = reminders.filter((r) => r.type === "overdue");
  const today = reminders.filter((r) => r.type === "today");
  const upcoming = reminders.filter((r) => r.type === "upcoming");

  if (reminders.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid="reminders-panel">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">Follow-up Reminders</span>
          <Badge className="bg-primary/10 text-primary border-0 text-xs font-semibold">
            {reminders.length}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">Next 7 days + overdue</span>
      </div>

      <div className="divide-y divide-border">
        {overdue.length > 0 && (
          <Section
            icon={<AlarmClock className="h-3.5 w-3.5" />}
            label="Overdue"
            color="text-red-600 dark:text-red-400"
            bg="bg-red-50 dark:bg-red-950/30"
            items={overdue}
            onEdit={onEdit}
            onSnooze={onSnooze}
            onMarkDone={onMarkDone}
          />
        )}
        {today.length > 0 && (
          <Section
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Due Today"
            color="text-amber-600 dark:text-amber-400"
            bg="bg-amber-50 dark:bg-amber-950/30"
            items={today}
            onEdit={onEdit}
            onSnooze={onSnooze}
            onMarkDone={onMarkDone}
          />
        )}
        {upcoming.length > 0 && (
          <Section
            icon={<CalendarClock className="h-3.5 w-3.5" />}
            label="Upcoming"
            color="text-blue-600 dark:text-blue-400"
            bg="bg-blue-50 dark:bg-blue-950/30"
            items={upcoming}
            onEdit={onEdit}
            onSnooze={onSnooze}
            onMarkDone={onMarkDone}
          />
        )}
      </div>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
  items: ReminderItem[];
  onEdit: (app: JobApplication) => void;
  onSnooze: (id: string, days: number) => void;
  onMarkDone: (id: string) => void;
}

function Section({ icon, label, color, bg, items, onEdit, onSnooze, onMarkDone }: SectionProps) {
  return (
    <div>
      <div className={`flex items-center gap-1.5 px-4 py-2 ${bg}`}>
        <span className={color}>{icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{label}</span>
        <span className={`text-xs font-medium ml-1 ${color} opacity-70`}>({items.length})</span>
      </div>
      <AnimatePresence initial={false}>
        {items.map(({ app, daysUntil }) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            data-testid={`reminder-item-${app.id}`}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{app.company}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">{app.role}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {daysUntil === 0
                      ? "Follow up today"
                      : daysUntil < 0
                      ? `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? "s" : ""} overdue`
                      : `Follow up in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`}
                    {app.followUpDate && (
                      <span className="ml-1 opacity-60">
                        · {format(parseISO(app.followUpDate), "MMM d")}
                      </span>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onSnooze(app.id, 3)}
                  data-testid={`button-snooze-${app.id}`}
                  title="Snooze 3 days"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Snooze 3d
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
                  onClick={() => onMarkDone(app.id)}
                  data-testid={`button-markdone-${app.id}`}
                  title="Mark follow-up done"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Done
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(app)}
                  data-testid={`button-reminder-edit-${app.id}`}
                >
                  Edit
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
