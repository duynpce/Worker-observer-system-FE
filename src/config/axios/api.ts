import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ROOT_API_URL } from "../../shared/constant/constant";
import { toast } from "react-toastify";
import qs from 'qs';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipGlobalErrorHandler?: boolean;

  //string --> toast that string, true --> toast res's message 
  toastMessageWhenSuccess?: boolean | string | null; 
};


// Use a separate client for refresh to avoid recursive interceptor calls.

export const api = axios.create({
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'repeat', allowDots: true });
  },
  baseURL: `${ROOT_API_URL}`,
});


api.interceptors.response.use(
  (response) => {   

    const originalRequest = response.config as RetryableRequestConfig | undefined;
    const toastMessageWhenSuccess = originalRequest?.toastMessageWhenSuccess ?? null;
    if (toastMessageWhenSuccess) {
      // Use provided string; fall back to API response message for boolean true.
      const successMessage = typeof toastMessageWhenSuccess === "string"
        ? toastMessageWhenSuccess
        : response.data?.message;

      if (successMessage) {
        toast.success(successMessage);
      }
    }
    // becasue api will return AxiosResponse<ResponseDto<T>>
    // response.data is to take out the ResponseDto<T>
    return response.data;
  },
  // Global error handler for API responses.
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const skipGlobalErrorHandler = Boolean(originalRequest?.skipGlobalErrorHandler);
    
    // If the request config has skipGlobalErrorHandler set, by pass the global error handling logic.
    if (skipGlobalErrorHandler) {
      return Promise.reject(error);
    }


    if (error.response?.status === 401 ) {
        toast.error("expried sesssion or not logged in", {
          toastId: "session-expired",
          autoClose: 2000, 
        });
     
    } else if (error.response?.status === 403 && !error.response.data.message) {
      toast.error("You don't have permission to access this resource.", {
        toastId: "forbidden-error",
      });
    } else if(error.response?.status === 408) {
      toast.error("Request timeout. Please try again.", {
        toastId: "timeout-error",
      });  
    }
    if(axios.isCancel(error)) {
      Promise.reject(error);
    }
    else if (error.code === 'ERR_NETWORK') {
      toast.error("Please check your connection.",{
        toastId: "network-error",
      });
    }
    else {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again.", {
          toastId: "generic-error",
        }
      );
    }

    return Promise.reject(error);
  }
);