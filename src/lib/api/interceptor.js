// import { parseCookies } from "nookies";
import dotenv from "dotenv";

/**
 * The rate limit key used for API requests, taken from environment variables.
 * @type {string}
 */
const envConfig = dotenv.config();

/**
 * Configures axios with request and response interceptors.
 *
 * Adds custom headers for rate limiting and security on each request.
 * Provides error handling through response interceptors.
 *
 * @param {import("axios").AxiosInstance} axios - The axios instance to which interceptors are added.
 */
export default function setup(axios) {
  axios.interceptors.request.use((config) => {
    config.headers["X-Rate-Key"] = envConfig?.parsed?.HASP_RATE_LIMIT_KEY;
    config.headers["Strict-Transport-Security"] = "max-age=31536000";
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      // Resolve with the response
      return Promise.resolve(response);
    },
    (error) => {
      // Reject with the error response for centralized error handling
      return Promise.reject(error.response);
    },
  );
}
