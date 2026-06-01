import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { Application, ApplicationInput, ApplicationUpdate, ErrorResponse, HealthStatus } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListApplicationsUrl: () => string;
/**
 * @summary List all job applications
 */
export declare const listApplications: (options?: RequestInit) => Promise<Application[]>;
export declare const getListApplicationsQueryKey: () => readonly ["/api/applications"];
export declare const getListApplicationsQueryOptions: <TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListApplicationsQueryResult = NonNullable<Awaited<ReturnType<typeof listApplications>>>;
export type ListApplicationsQueryError = ErrorType<unknown>;
/**
 * @summary List all job applications
 */
export declare function useListApplications<TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateApplicationUrl: () => string;
/**
 * @summary Create a new job application
 */
export declare const createApplication: (applicationInput: ApplicationInput, options?: RequestInit) => Promise<Application>;
export declare const getCreateApplicationMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<ApplicationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<ApplicationInput>;
}, TContext>;
export type CreateApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof createApplication>>>;
export type CreateApplicationMutationBody = BodyType<ApplicationInput>;
export type CreateApplicationMutationError = ErrorType<ErrorResponse>;
/**
* @summary Create a new job application
*/
export declare const useCreateApplication: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<ApplicationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<ApplicationInput>;
}, TContext>;
export declare const getGetApplicationUrl: (id: string) => string;
/**
 * @summary Get a single job application
 */
export declare const getApplication: (id: string, options?: RequestInit) => Promise<Application>;
export declare const getGetApplicationQueryKey: (id: string) => readonly [`/api/applications/${string}`];
export declare const getGetApplicationQueryOptions: <TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetApplicationQueryResult = NonNullable<Awaited<ReturnType<typeof getApplication>>>;
export type GetApplicationQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single job application
 */
export declare function useGetApplication<TData = Awaited<ReturnType<typeof getApplication>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getApplication>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateApplicationUrl: (id: string) => string;
/**
 * @summary Update a job application
 */
export declare const updateApplication: (id: string, applicationUpdate: ApplicationUpdate, options?: RequestInit) => Promise<Application>;
export declare const getUpdateApplicationMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateApplication>>, TError, {
        id: string;
        data: BodyType<ApplicationUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateApplication>>, TError, {
    id: string;
    data: BodyType<ApplicationUpdate>;
}, TContext>;
export type UpdateApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof updateApplication>>>;
export type UpdateApplicationMutationBody = BodyType<ApplicationUpdate>;
export type UpdateApplicationMutationError = ErrorType<ErrorResponse>;
/**
* @summary Update a job application
*/
export declare const useUpdateApplication: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateApplication>>, TError, {
        id: string;
        data: BodyType<ApplicationUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateApplication>>, TError, {
    id: string;
    data: BodyType<ApplicationUpdate>;
}, TContext>;
export declare const getDeleteApplicationUrl: (id: string) => string;
/**
 * @summary Delete a job application
 */
export declare const deleteApplication: (id: string, options?: RequestInit) => Promise<void>;
export declare const getDeleteApplicationMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteApplication>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteApplication>>, TError, {
    id: string;
}, TContext>;
export type DeleteApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteApplication>>>;
export type DeleteApplicationMutationError = ErrorType<ErrorResponse>;
/**
* @summary Delete a job application
*/
export declare const useDeleteApplication: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteApplication>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteApplication>>, TError, {
    id: string;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map