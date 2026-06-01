import { JobApplication } from "@/lib/types";
import { Briefcase, TrendingUp, MessageSquare, Trophy } from "lucide-react";

interface StatsBarProps {
  applications: JobApplication[];
}

export function StatsBar({ applications }: StatsBarProps) {
  const total = applications.length;
  const active = applications.filter(
    (a) => a.status !== "Rejected" && a.status !== "Withdrawn"
  ).length;
  const interviews = applications.filter(
    (a) => a.status === "Interview"
  ).length;
  const offers = applications.filter((a) => a.status === "Offer").length;

  const appliedCount = applications.filter((a) => a.status !== "Wishlist").length;
  const progressedCount = applications.filter((a) =>
    ["Phone Screen", "Interview", "Offer"].includes(a.status)
  ).length;
  const responseRate =
    appliedCount > 0 ? Math.round((progressedCount / appliedCount) * 100) : 0;

  const stats = [
    {
      label: "Total Applications",
      value: total,
      icon: Briefcase,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
    },
    {
      label: "Active",
      value: active,
      icon: TrendingUp,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      label: "Interviews",
      value: interviews,
      icon: MessageSquare,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Offers",
      value: offers,
      icon: Trophy,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/40",
    },
    {
      label: "Response Rate",
      value: `${responseRate}%`,
      icon: null,
      color: "text-foreground",
      bg: "bg-muted/60",
      isRate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-card px-4 py-3 flex items-center gap-3"
          data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {stat.icon && (
            <div className={`rounded-lg p-2 ${stat.bg} shrink-0`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          )}
          {!stat.icon && (
            <div className={`rounded-lg p-2 ${stat.bg} shrink-0`}>
              <span className={`text-xs font-bold ${stat.color}`}>%</span>
            </div>
          )}
          <div className="min-w-0">
            <div
              className="text-xl font-bold leading-none tabular-nums"
              data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
