import { useQueryClient } from "@tanstack/react-query";
import {
  useListApplications,
  useCreateApplication,
  useUpdateApplication,
  useDeleteApplication,
  getListApplicationsQueryKey,
} from "@workspace/api-client-react";
import type { Application } from "@workspace/api-client-react";
import { JobApplication, ApplicationStatus } from "../lib/types";

function toJobApplication(app: Application): JobApplication {
  return {
    id: app.id,
    company: app.company,
    role: app.role,
    location: app.location,
    status: app.status as ApplicationStatus,
    appliedDate: app.appliedDate,
    followUpDate: app.followUpDate ?? undefined,
    salary: app.salary ?? undefined,
    url: app.url ?? undefined,
    notes: app.notes ?? undefined,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  };
}

export function useApplications() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useListApplications();

  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();
  const deleteMutation = useDeleteApplication();

  const applications: JobApplication[] = (data ?? []).map(toJobApplication);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getListApplicationsQueryKey() });
  }

  function addApplication(input: Omit<JobApplication, "id" | "createdAt" | "updatedAt">) {
    createMutation.mutate(
      {
        data: {
          company: input.company,
          role: input.role,
          location: input.location,
          status: input.status,
          appliedDate: input.appliedDate,
          ...(input.followUpDate ? { followUpDate: input.followUpDate } : {}),
          ...(input.salary ? { salary: input.salary } : {}),
          ...(input.url ? { url: input.url } : {}),
          ...(input.notes ? { notes: input.notes } : {}),
        },
      },
      { onSuccess: invalidate }
    );
  }

  function updateApplication(id: string, updates: Partial<JobApplication>) {
    updateMutation.mutate(
      {
        id,
        data: {
          ...(updates.company !== undefined ? { company: updates.company } : {}),
          ...(updates.role !== undefined ? { role: updates.role } : {}),
          ...(updates.location !== undefined ? { location: updates.location } : {}),
          ...(updates.status !== undefined ? { status: updates.status } : {}),
          ...(updates.appliedDate !== undefined ? { appliedDate: updates.appliedDate } : {}),
          followUpDate: "followUpDate" in updates ? (updates.followUpDate ?? null) : undefined,
          salary: "salary" in updates ? (updates.salary ?? null) : undefined,
          url: "url" in updates ? (updates.url ?? null) : undefined,
          notes: "notes" in updates ? (updates.notes ?? null) : undefined,
        },
      },
      { onSuccess: invalidate }
    );
  }

  function deleteApplication(id: string) {
    deleteMutation.mutate({ id }, { onSuccess: invalidate });
  }

  return {
    applications,
    isLoaded: !isLoading,
    isError,
    addApplication,
    updateApplication,
    deleteApplication,
  };
}
