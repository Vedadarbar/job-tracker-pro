import { useState } from "react";
import { format, isPast, isToday, parseISO } from "date-fns";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JobApplication, ApplicationStatus, STATUS_COLORS, STATUS_OPTIONS } from "@/lib/types";

type SortKey = "appliedDate" | "company" | "status";
type SortDir = "asc" | "desc";

interface ApplicationsTableProps {
  applications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="h-3 w-3 text-muted-foreground/50" />;
  return sortDir === "asc"
    ? <ChevronUp className="h-3 w-3" />
    : <ChevronDown className="h-3 w-3" />;
}

function isOverdue(dateStr?: string) {
  if (!dateStr) return false;
  const d = parseISO(dateStr);
  return isPast(d) && !isToday(d);
}

function isDueToday(dateStr?: string) {
  if (!dateStr) return false;
  return isToday(parseISO(dateStr));
}

export function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicationsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("appliedDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...applications].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "appliedDate") cmp = a.appliedDate.localeCompare(b.appliedDate);
    else if (sortKey === "company") cmp = a.company.localeCompare(b.company);
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (sorted.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-24 text-center"
        data-testid="empty-state"
      >
        <div className="rounded-full bg-muted p-6 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No applications yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start tracking your job search by adding your first application.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-[180px]">
              <button
                className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                onClick={() => handleSort("company")}
                data-testid="sort-company"
              >
                Company
                <SortIcon col="company" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                onClick={() => handleSort("status")}
                data-testid="sort-status"
              >
                Status
                <SortIcon col="status" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <button
                className="flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                onClick={() => handleSort("appliedDate")}
                data-testid="sort-date"
              >
                Applied
                <SortIcon col="appliedDate" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </TableHead>
            <TableHead className="hidden lg:table-cell">Follow-up</TableHead>
            <TableHead className="hidden xl:table-cell">Salary</TableHead>
            <TableHead className="w-[48px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence initial={false}>
            {sorted.map((app) => {
              const overdue = isOverdue(app.followUpDate);
              const dueToday = isDueToday(app.followUpDate);
              const rowHighlight = overdue
                ? "bg-red-50/50 dark:bg-red-950/10"
                : dueToday
                ? "bg-amber-50/50 dark:bg-amber-950/10"
                : "";

              return (
                <motion.tr
                  key={app.id}
                  data-testid={`row-application-${app.id}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${rowHighlight}`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {app.url ? (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline underline-offset-2 flex items-center gap-1"
                          data-testid={`link-company-${app.id}`}
                        >
                          {app.company}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </a>
                      ) : (
                        app.company
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {app.role}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {app.location}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onValueChange={(val) =>
                        onStatusChange(app.id, val as ApplicationStatus)
                      }
                    >
                      <SelectTrigger
                        className="h-7 border-0 shadow-none p-0 w-auto gap-1 focus:ring-0"
                        data-testid={`select-status-${app.id}`}
                      >
                        <Badge
                          className={`${STATUS_COLORS[app.status]} border-0 font-medium text-xs cursor-pointer select-none`}
                        >
                          {app.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            <Badge
                              className={`${STATUS_COLORS[s]} border-0 font-medium text-xs`}
                            >
                              {s}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground tabular-nums">
                    {format(parseISO(app.appliedDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm tabular-nums">
                    {app.followUpDate ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            className={
                              overdue
                                ? "text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                                : dueToday
                                ? "text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1"
                                : "text-muted-foreground"
                            }
                          >
                            {(overdue || dueToday) && (
                              <AlertCircle className="h-3 w-3 inline-block" />
                            )}
                            {format(parseISO(app.followUpDate), "MMM d")}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {overdue
                            ? "Follow-up overdue"
                            : dueToday
                            ? "Follow-up due today"
                            : format(parseISO(app.followUpDate), "MMM d, yyyy")}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-sm text-muted-foreground">
                    {app.salary ?? <span className="text-muted-foreground/40">—</span>}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          data-testid={`button-actions-${app.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit(app)}
                          data-testid={`button-edit-${app.id}`}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {app.url && (
                          <DropdownMenuItem asChild>
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-2" />
                              View posting
                            </a>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(app)}
                          data-testid={`button-delete-${app.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
}
