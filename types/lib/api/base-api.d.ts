/**
 * A base API class for handling HTTP requests using Axios and SWR.
 */
export class BaseApi {
  /**
   * Perform a GET request.
   * @param {string} URL - The endpoint URL.
   * @returns {Promise<any>} - The response data.
   */
  static get(URL: string): Promise<any>;
  /**
   * Perform a POST request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static post(URL: string, data: object): Promise<any>;
  /**
   * Perform a PUT request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static put(URL: string, data: object): Promise<any>;
  /**
   * Perform a PATCH request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static patch(URL: string, data: object): Promise<any>;
  /**
   * Perform a DELETE request.
   * @param {string} URL - The endpoint URL.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static delete(URL: string): Promise<any>;
  /**
   * Use SWR for data fetching with caching.
   * @see https://swr.vercel.app/docs/api
   * @param {string} URL - The endpoint URL.
   * @param {object} [options={}] - SWR options.
   * @returns {{ data: any, mutate: Function, isValidating: boolean, error: any }} - SWR result object.
   */
  static swr(
    URL: string,
    options?: object,
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
  /**
   * Perform a GET request without interceptors.
   * @param {string} URL - The endpoint URL.
   * @param {object} headers - Custom request headers.
   * @returns {Promise<any>} - The response data.
   */
  static customGet(URL: string, headers: object): Promise<any>;
  /**
   * Perform a PUT request without interceptors.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload.
   * @param {object} headers - Custom request headers.
   * @returns {Promise<any>} - The response data.
   */
  static customPut(URL: string, data: object, headers: object): Promise<any>;
}
