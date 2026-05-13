import { QueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,  // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        //retry 3 times for network error or 5xx status code, but not for 401 or 403
        const err = error as AxiosError;
        const status = err.response?.status;
        if (status === 401 || status === 403) return false;
        
        return failureCount < 3;
      },      
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on network reconnect
    },
  },
});