import 'axios';
import type { ResponseDto } from '../../shared/dto/response.dto';

declare module 'axios' {
  // override the AxiosInstance type to return our custom ResponseDto
  // T is the expected data type 
  // promise Promise<ResponseDto<T>> --> promise the response  is responseDto with data of type T
  export interface AxiosInstance {
    request<T>(config: AxiosRequestConfig): Promise<ResponseDto<T>>;
    get<T >(url: string, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<ResponseDto<T>>;
  }
}