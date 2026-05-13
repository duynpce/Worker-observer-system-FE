import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
    toastMessageWhenSuccess?: boolean | string | null;
  }

  export interface InternalAxiosRequestConfig {
    skipGlobalErrorHandler?: boolean;
    toastMessageWhenSuccess?: boolean | string | null;
    _retry?: boolean;
  }
}
