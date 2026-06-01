export type ApplicationStatus = "Wishlist" | "Applied" | "Phone Screen" | "Interview" | "Offer" | "Rejected" | "Withdrawn";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  followUpDate?: string;
  salary?: string;
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  Wishlist: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300",
  Applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  "Phone Screen": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  Interview: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
  Offer: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  Withdrawn: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-400",
};

export const STATUS_OPTIONS: ApplicationStatus[] = [
  "Wishlist",
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];
