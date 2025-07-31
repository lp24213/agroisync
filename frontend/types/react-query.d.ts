declare module 'react-query' {
  import { ReactNode } from 'react';

  export interface QueryClientConfig {
    defaultOptions?: {
      queries?: {
        refetchOnWindowFocus?: boolean;
        retry?: number;
        staleTime?: number;
        cacheTime?: number;
      };
      mutations?: {
        retry?: number;
      };
    };
  }

  export class QueryClient {
    constructor(config?: QueryClientConfig);
    getQueryData(queryKey: any): any;
    setQueryData(queryKey: any, data: any): void;
    invalidateQueries(queryKey?: any): Promise<void>;
    clear(): void;
  }

  export interface QueryClientProviderProps {
    client: QueryClient;
    children: ReactNode;
  }

  export function QueryClientProvider(props: QueryClientProviderProps): JSX.Element;

  export interface UseQueryOptions {
    enabled?: boolean;
    retry?: number;
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    refetchOnReconnect?: boolean;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }

  export interface UseQueryResult {
    data: any;
    error: any;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    refetch: () => Promise<any>;
  }

  export function useQuery(
    queryKey: any,
    queryFn: () => Promise<any>,
    options?: UseQueryOptions,
  ): UseQueryResult;

  export interface UseMutationOptions {
    onSuccess?: (data: any, variables: any) => void;
    onError?: (error: any, variables: any) => void;
    onMutate?: (variables: any) => void;
  }

  export interface UseMutationResult {
    mutate: (variables?: any) => void;
    mutateAsync: (variables?: any) => Promise<any>;
    data: any;
    error: any;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
    reset: () => void;
  }

  export function useMutation(
    mutationFn: (variables: any) => Promise<any>,
    options?: UseMutationOptions,
  ): UseMutationResult;

  export function useQueryClient(): QueryClient;
}
