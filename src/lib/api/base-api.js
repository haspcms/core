import axios from "axios";
import UseSWR from "swr";
import interceptorSetup from "./interceptor";

// Set up interceptors on the global axios instance
interceptorSetup(axios);

// Create a basic Axios instance without interceptors
const basicAxios = axios.create();

/**
 * A base API class for handling HTTP requests using Axios and SWR.
 */
export class BaseApi {
  /**
   * Perform a GET request.
   * @param {string} URL - The endpoint URL.
   * @returns {Promise<any>} - The response data.
   */
  static async get(URL) {
    return await axios.get(URL);
  }

  /**
   * Perform a POST request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload to send with the POST request.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static async post(URL, data) {
    return await axios.post(URL, data).then(
      (response) => response,
      (error) => {
        throw error;
      },
    );
  }

  /**
   * Perform a PUT request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload for updating resources.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static async put(URL, data) {
    return await axios.put(URL, data).then(
      (response) => response,
      (error) => {
        throw error;
      },
    );
  }

  /**
   * Perform a PATCH request.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload containing partial updates.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static async patch(URL, data) {
    return await axios.patch(URL, data).then(
      (response) => response,
      (error) => {
        throw error;
      },
    );
  }

  /**
   * Perform a DELETE request.
   * @param {string} URL - The endpoint URL of the resource to delete.
   * @returns {Promise<any>} - The response data.
   * @throws {Error} - Throws an error if the request fails.
   */
  static async delete(URL) {
    return await axios.delete(URL).then(
      (response) => response,
      (error) => {
        throw error;
      },
    );
  }

  /**
   * Use SWR for data fetching with caching benefits.
   * @see https://swr.vercel.app/docs/api
   * @param {string} URL - The endpoint URL.
   * @param {object} [options={}] - Options to configure SWR behavior.
   * @returns {{ data: any, mutate: Function, isValidating: boolean, error: any }} - SWR result object.
   */
  static swr(URL, options = {}) {
    /**
     * Fetcher function for SWR, formats how data is fetched.
     * Uses the `get` method of `BaseApi`.
     * @param {string} link - The endpoint URL to fetch data from.
     * @returns {Promise<any>} - The API response data.
     */
    const fetcher = (link) => this.get(link);

    const render = options.hasOwnProperty("render") ? options.render : true;
    const { data, mutate, isValidating, error } = UseSWR(
      render ? URL : null,
      fetcher,
      options,
    );
    return {
      data: data ? data.data : data, // Handle nested data format
      mutate,
      isValidating,
      error,
    };
  }

  /**
   * Perform a GET request without using predefined interceptors.
   * @param {string} URL - The endpoint URL.
   * @param {object} headers - Custom request headers.
   * @returns {Promise<any>} - The response data.
   */
  static async customGet(URL, headers) {
    return basicAxios.get(URL, headers);
  }

  /**
   * Perform a PUT request without using predefined interceptors.
   * @param {string} URL - The endpoint URL.
   * @param {object} data - The request payload to update resources.
   * @param {object} headers - Custom request headers defining additional info.
   * @returns {Promise<any>} - The response data.
   */
  static async customPut(URL, data, headers) {
    return basicAxios.put(URL, data, headers);
  }
}
