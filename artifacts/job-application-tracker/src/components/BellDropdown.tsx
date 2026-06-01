import { useMemo } from "react";
import { parseISO, differenceInDays, format } from "date-fns";
import { Bell, AlarmClock, Clock, CalendarClock, CheckCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobApplication } from "@/lib/types";

interface ReminderItem {
  app: JobApplication;
  type: "overdue" | "today" | "upcoming";
  daysUntil: number;
}

interface BellDropdownProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onSnooze: (id: string, days: number) => void;
  onMarkDone: (id: string) => void;
}

export function BellDropdown({
  applications,
  onEdit,
  onSnooze,
  onMarkDone,
}: BellDropdownProps) {
  const reminders = useMemo((): ReminderItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return applications
      .filter(
        (app) =>
          app.followUpDate &&
          app.status !== "Rejected" &&
          app.status !== "Withdrawn" &&
          app.status !== "Offer"
      )
      .map((app) => {
        const d = parseISO(app.followUpDate!);
        d.setHours(0, 0, 0, 0);
        const daysUntil = differenceInDays(d, today);
        if (daysUntil > 7) return null;
        const type: ReminderItem["type"] =
          daysUntil < 0 ? "overdue" : daysUntil === 0 ? "today" : "upcoming";
        return { app, type, daysUntil } as ReminderItem;
      })
      .filter((r): r is ReminderItem => r !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [applications]);

  const count = reminders.length;
  const overdueCount = reminders.filter((r) => r.type === "overdue").length;

  if (count === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          data-testid="button-reminders-bell"
          aria-label="View reminders"
        >
          <Bell className="h-4 w-4" />
          <span
            className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white leading-none ${
              overdueCount > 0 ? "bg-red-500" : "bg-primary"
            }`}
          >
            {count}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[360px] p-0 shadow-lg"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-semibold">Follow-up Reminders</span>
            <Badge className="bg-primary/10 text-primary border-0 text-xs font-semibold">
              {count}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">Next 7 days + overdue</span>
        </div>

        <ScrollArea className="max-h-[380px]">
          {overdueCount > 0 && (
            <GroupHeader
              icon={<AlarmClock className="h-3 w-3" />}
              label="Overdue"
              color="text-red-600 dark:text-red-400"
              bg="bg-red-50 dark:bg-red-950/30"
            />
          )}
          {reminders
            .filter((r) => r.type === "overdue")
            .map((r) => (
              <ReminderRow
                key={r.app.id}
                item={r}
                onEdit={onEdit}
                onSnooze={onSnooze}
                onMarkDone={onMarkDone}
              />
            ))}

          {reminders.filter((r) => r.type === "today").length > 0 && (
            <GroupHeader
              icon={<Clock className="h-3 w-3" />}
              label="Due Today"
              color="text-amber-600 dark:text-amber-400"
              bg="bg-amber-50 dark:bg-amber-950/30"
            />
          )}
          {reminders
            .filter((r) => r.type === "today")
            .map((r) => (
              <ReminderRow
                key={r.app.id}
                item={r}
                onEdit={onEdit}
                onSnooze={onSnooze}
                onMarkDone={onMarkDone}
              />
            ))}

          {reminders.filter((r) => r.type === "upcoming").length > 0 && (
            <GroupHeader
              icon={<CalendarClock className="h-3 w-3" />}
              label="Upcoming"
              color="text-blue-600 dark:text-blue-400"
              bg="bg-blue-50 dark:bg-blue-950/30"
            />
          )}
          {reminders
            .filter((r) => r.type === "upcoming")
            .map((r) => (
              <ReminderRow
                key={r.app.id}
                item={r}
                onEdit={onEdit}
                onSnooze={onSnooze}
                onMarkDone={onMarkDone}
              />
            ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function GroupHeader({
  icon,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-4 py-1.5 ${bg}`}>
      <span className={color}>{icon}</span>
      <span className={`text-[11px] font-semibold uppercase tracking-wide ${color}`}>
        {label}
      </span>
    </div>
  );
}

function ReminderRow({
  item: { app, daysUntil },
  onEdit,
  onSnooze,
  onMarkDone,
}: {
  item: ReminderItem;
  onEdit: (app: JobApplication) => void;
  onSnooze: (id: string, days: number) => void;
  onMarkDone: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-2 px-4 py-2.5 hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-sm leading-tight">{app.company}</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground truncate leading-tight">{app.role}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
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
        </p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[11px] px-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => onSnooze(app.id, 3)}
          title="Snooze 3 days"
        >
          <Clock className="h-2.5 w-2.5 mr-1" />
          Snooze
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[11px] px-1.5 text-muted-foreground hover:text-green-600 dark:hover:text-green-400"
          onClick={() => onMarkDone(app.id)}
          title="Mark done"
        >
          <CheckCheck className="h-2.5 w-2.5 mr-1" />
          Done
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[11px] px-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(app)}
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
