import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const RATE_LIMIT_KEY = process.env.RATE_LIMIT_KEY || "";

export default function setup(axiosInstance: typeof axios) {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      config.headers["X-Rate-Key"] = RATE_LIMIT_KEY;
      config.headers["Strict-Transport-Security"] = "max-age=31536000";
      return config;
    },
    (error: AxiosError) => {
      // Handle request error here if needed
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return Promise.resolve(response);
    },
    (error: AxiosError) => {
      // Handle response error here (e.g., display global popup notification)
      return Promise.reject(error.response);
    },
  );
}
