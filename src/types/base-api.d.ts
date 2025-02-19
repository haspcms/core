import { AxiosRequestConfig, AxiosResponse } from "axios";
import { SWRResponse } from "swr";

/**
 * A base API class for handling HTTP requests using Axios and SWR.
 */
export declare class BaseApi {
  static get<T = any>(URL: string): Promise<AxiosResponse<T>>;
  static post<T = any>(URL: string, data: any): Promise<AxiosResponse<T>>;
  static put<T = any>(URL: string, data: any): Promise<AxiosResponse<T>>;
  static patch<T = any>(URL: string, data: any): Promise<AxiosResponse<T>>;
  static delete<T = any>(URL: string): Promise<AxiosResponse<T>>;
  static swr<T = any>(
    URL: string,
    options?: Record<string, any>,
  ): SWRResponse<T, any>;
  static customGet<T = any>(
    URL: string,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
  static customPut<T = any>(
    URL: string,
    data: any,
    headers?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>>;
}
