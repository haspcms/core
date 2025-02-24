import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.HASP_TENANT_API;

/**
 * Locale API for fetching and managing locale data.
 */
export class LOCALEAPI {
  /**
   * Fetch a list of locales with optional query parameters.
   *
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the locales data.
   */
  static async getLocales(params = "") {
    const res = await BaseApi.get(APIDOMAIN + `/api/locales` + params);
    return res.data;
  }

  /**
   * Use SWR (Stale-While-Revalidate) to fetch locales with optional parameters for dynamic updates.
   *
   * @param {string} [params=""] - Additional query parameters for the request.
   * @param {Object} [options={}] - Options for SWR configuration.
   * @returns {Function} A SWR hook to handle locale data fetching and state management.
   */
  static getLocalesSwr(params = "", options = {}) {
    return BaseApi.swr(APIDOMAIN + `/api/locales` + params, options);
  }
}
