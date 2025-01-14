import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import UseSWR, { SWRConfiguration, SWRResponse } from "swr";
import interceptorSetup from "./interceptor";

interceptorSetup(axios);

const basicAxios: AxiosInstance = axios.create();

interface SWROptions<T = any> extends SWRConfiguration<T> {
  render?: boolean;
}

export default class BaseApi {
  static async get<T = any>(
    URL: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await axios.get<T>(URL, config);
  }

  static async post<T = any, D = any>(
    URL: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await axios.post<T>(URL, data, config).then(
      (response) => response,
      (error) => {
        throw error;
      }
    );
  }

  static async put<T = any, D = any>(
    URL: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await axios.put<T>(URL, data, config).then(
      (response) => response,
      (error) => {
        throw error;
      }
    );
  }

  static async patch<T = any, D = any>(
    URL: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await axios.patch<T>(URL, data, config).then(
      (response) => response,
      (error) => {
        throw error;
      }
    );
  }

  static async delete<T = any>(
    URL: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return await axios.delete<T>(URL, config).then(
      (response) => response,
      (error) => {
        throw error;
      }
    );
  }

  // SWR Hook
  static swr<T = any>(URL: string, options: SWROptions<T> = {}) {
    const fetcher = async (link: string): Promise<T> => {
      const response = await this.get<T>(link);
      return response.data; // Return only the data part of the Axios response
    };

    const render = options.hasOwnProperty("render") ? options.render : true;

    const { data, mutate, isValidating, error }: SWRResponse<T, any> = UseSWR(
      render ? URL : null,
      fetcher,
      options
    );

    return {
      data,
      mutate,
      isValidating,
      error,
    };
  }

  // No Interceptor Methods
  static async customGet<T = any>(
    URL: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return basicAxios.get<T>(URL, config);
  }

  static async customPut<T = any, D = any>(
    URL: string,
    data: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return basicAxios.put<T>(URL, data, config);
  }
}
