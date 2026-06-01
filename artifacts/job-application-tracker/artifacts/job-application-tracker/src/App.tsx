import { useState, useMemo, useEffect, useRef } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Sun, Moon, Briefcase, Search, X } from "lucide-react";
import { addDays, parseISO, differenceInDays } from "date-fns";
import { StatsBar } from "@/components/StatsBar";
import { ApplicationsTable } from "@/components/ApplicationsTable";
import { ApplicationDialog } from "@/components/ApplicationDialog";
import { DeleteDialog } from "@/components/DeleteDialog";
import { RemindersPanel } from "@/components/RemindersPanel";
import { BellDropdown } from "@/components/BellDropdown";
import { useApplications } from "@/hooks/use-applications";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { useInspiration } from "@/hooks/use-inspiration";
import { useStreak } from "@/hooks/use-streak";
import {
  JobApplication,
  ApplicationStatus,
  STATUS_OPTIONS,
} from "@/lib/types";

const queryClient = new QueryClient();

function Tracker() {
  const { applications, isLoaded, addApplication, updateApplication, deleteApplication } =
    useApplications();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { showRejectionAlert } = useInspiration(applications, isLoaded);
  const { streakCount } = useStreak();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("All");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobApplication | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);

  const toastFiredRef = useRef(false);

  const urgentReminders = useMemo(() => {
    if (!isLoaded) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return applications.filter((app) => {
      if (!app.followUpDate) return false;
      if (app.status === "Rejected" || app.status === "Withdrawn" || app.status === "Offer") return false;
      const d = parseISO(app.followUpDate);
      d.setHours(0, 0, 0, 0);
      return differenceInDays(d, today) <= 0;
    });
  }, [applications, isLoaded]);

  useEffect(() => {
    if (!isLoaded || toastFiredRef.current) return;
    if (urgentReminders.length === 0) return;
    toastFiredRef.current = true;
    const overdue = urgentReminders.filter((a) => {
      const d = parseISO(a.followUpDate!);
      d.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return differenceInDays(d, today) < 0;
    });
    const dueToday = urgentReminders.length - overdue.length;

    const parts: string[] = [];
    if (overdue.length > 0) parts.push(`${overdue.length} overdue`);
    if (dueToday > 0) parts.push(`${dueToday} due today`);

    toast({
      title: "Follow-up reminders",
      description: `You have ${parts.join(" and ")} follow-up${urgentReminders.length !== 1 ? "s" : ""}. Check the reminders section below.`,
      duration: 6000,
    });
  }, [isLoaded, urgentReminders, toast]);

  const totalUpcomingReminders = useMemo(() => {
    if (!isLoaded) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return applications.filter((app) => {
      if (!app.followUpDate) return false;
      if (app.status === "Rejected" || app.status === "Withdrawn" || app.status === "Offer") return false;
      const d = parseISO(app.followUpDate);
      d.setHours(0, 0, 0, 0);
      return differenceInDays(d, today) <= 7;
    }).length;
  }, [applications, isLoaded]);

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        search === "" ||
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  function handleAdd() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function handleEdit(app: JobApplication) {
    setEditTarget(app);
    setDialogOpen(true);
  }

  function handleSave(data: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) {
    if (editTarget) {
      const wasRejected = editTarget.status !== "Rejected" && data.status === "Rejected";
      updateApplication(editTarget.id, data);
      if (wasRejected) showRejectionAlert(data.company);
    } else {
      addApplication(data);
    }
  }

  function handleDeleteClick(app: JobApplication) {
    setDeleteTarget(app);
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      deleteApplication(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  function handleStatusChange(id: string, status: ApplicationStatus) {
    updateApplication(id, { status });
    if (status === "Rejected") {
      const app = applications.find((a) => a.id === id);
      if (app) showRejectionAlert(app.company);
    }
  }

  function handleSnooze(id: string, days: number) {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    const base = app.followUpDate ? parseISO(app.followUpDate) : new Date();
    const newDate = addDays(base, days);
    updateApplication(id, { followUpDate: newDate.toISOString().split("T")[0] });
    toast({
      title: "Reminder snoozed",
      description: `Follow-up for ${app.company} moved to ${newDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
      duration: 3000,
    });
  }

  function handleMarkDone(id: string) {
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    updateApplication(id, { followUpDate: undefined });
    toast({
      title: "Follow-up cleared",
      description: `Reminder for ${app.company} has been marked done.`,
      duration: 3000,
    });
  }

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="rounded-lg bg-primary p-1.5">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">
              Job Tracker
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search company or role..."
                className="pl-8 h-8 text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid="input-search"
              />
              {search && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearch("")}
                  data-testid="button-clear-search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "All")}
            >
              <SelectTrigger className="h-8 text-sm w-[130px] shrink-0" data-testid="select-filter-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All statuses</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {streakCount > 0 && (
              <div
                title={`${streakCount}-day streak! Keep visiting daily to keep it going.`}
                className={`flex items-center gap-1 px-2 h-8 rounded-md text-sm font-semibold select-none cursor-default transition-colors ${
                  streakCount >= 30
                    ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                    : streakCount >= 14
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                    : streakCount >= 7
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    : streakCount >= 3
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                🔥 {streakCount}
              </div>
            )}
            {isLoaded && (
              <BellDropdown
                applications={applications}
                onEdit={handleEdit}
                onSnooze={handleSnooze}
                onMarkDone={handleMarkDone}
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              data-testid="button-toggle-theme"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5"
              onClick={handleAdd}
              data-testid="button-add-application"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add Application</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {isLoaded && <StatsBar applications={applications} />}

        {isLoaded && totalUpcomingReminders > 0 && (
          <RemindersPanel
            applications={applications}
            onEdit={handleEdit}
            onSnooze={handleSnooze}
            onMarkDone={handleMarkDone}
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              {filtered.length === applications.length
                ? `${applications.length} application${applications.length !== 1 ? "s" : ""}`
                : `${filtered.length} of ${applications.length} applications`}
            </h2>
            {statusFilter !== "All" && (
              <Badge
                className="text-xs cursor-pointer hover:opacity-80"
                onClick={() => setStatusFilter("All")}
                data-testid="badge-status-filter"
              >
                {statusFilter} <X className="h-2.5 w-2.5 ml-1" />
              </Badge>
            )}
          </div>
        </div>

        {isLoaded && (
          <ApplicationsTable
            applications={filtered}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onStatusChange={handleStatusChange}
          />
        )}

        {!isLoaded && (
          <div className="h-64 rounded-xl border border-border bg-muted/20 animate-pulse" />
        )}
      </main>

      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        initialData={editTarget}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        company={deleteTarget?.company ?? ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Tracker />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
