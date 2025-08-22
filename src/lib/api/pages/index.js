import { getToken } from "../../utils/node-cache.cjs";
import { BaseApi } from "../base-api";

// Constants for API domain and configuration
const APIDOMAIN = process.env.HASP_TENANT_API;
const MICROSITE = process.env.HASP_MICROSITE_ID || "";
const RATE_LIMIT_KEY =
  process.env.HASP_RATE_LIMIT_KEY || "9itzbGPOyjBiP0zcbX7v1BfQJ9gg2B";

/**
 * PAGEAPI provides static methods to interact with page-related API endpoints,
 * facilitating the retrieval and management of page data and routes.
 */
export class PAGEAPI {
  /**
   * Fetch a list of pages, with optional filtering based on provided parameters and microsite.
   *
   * @param {string} [params=""] - Optional additional query parameters for filtering.
   * @returns {Promise<Object>} A promise resolving to the paginated data.
   */
  static async getPages(params = "") {
    const queryParams = params
      ? params + `&filter[sites.id]=${MICROSITE}`
      : `?filter[sites.id]=${MICROSITE}`;
    const res = await BaseApi.get(APIDOMAIN + "/api/pages" + queryParams);
    return res.data;
  }

  /**
   * Retrieve data for a specific page using its unique ID.
   *
   * @param {string} id - The page ID.
   * @param {string} [params=""] - Optional query parameters.
   * @returns {Promise<Object>} A promise resolving to the data of the specified page.
   */
  static async findPage(id, params = "") {
    const res = await BaseApi.get(APIDOMAIN + "/api/pages/" + id + params);
    return res.data;
  }

  /**
   * Retrieve a page using its route, with optional filtering by microsite.
   *
   * @param {string} id - The route ID for the page.
   * @param {string} [params=""] - Optional query parameters, including site filters.
   * @returns {Promise<Object>} A promise resolving to the data of the page identified by the route.
   */
  static async findPageByRoute(id, params = "") {
    const queryParams = params
      ? params + `&sites=${MICROSITE}`
      : `?sites=${MICROSITE}`;
    const res = await BaseApi.get(APIDOMAIN + "/api/route/" + id + queryParams);
    return res.data;
  }

  /**
   * Utilize SWR to fetch pages, enabling dynamic data updates.
   *
   * @param {string} [params=""] - Optional parameters for filtering the page list.
   * @param {Object} [options={}] - Additional SWR configuration options.
   * @returns {Function} An SWR hook for managing the updating process of page data.
   */
  static getPagesSwr(params = "", options = {}) {
    const queryParams = params
      ? params + `&filter[sites.id]=${MICROSITE}`
      : `?filter[sites.id]=${MICROSITE}`;
    return BaseApi.swr(APIDOMAIN + "/api/pages" + queryParams, options);
  }

  /**
   * Use SWR to find a specific page by its ID, allowing for real-time updates.
   *
   * @param {string} id - The Page ID.
   * @param {string} [params=""] - Optional additional query parameters.
   * @param {Object} [options={}] - SWR configuration options.
   * @returns {Function} An SWR hook for dynamic retrieval of a specific page data.
   */
  static getFindPagesSwr(id, params = "", options = {}) {
    return BaseApi.swr(APIDOMAIN + "/api/pages/" + id + params, options);
  }

  /**
   * Fetch a page by route using a customized GET request with rate limiting applied.
   *
   * @param {string} id - The route ID for the page lookup.
   * @param {string} [params=""] - Optional query parameters, potentially including site filtering.
   * @returns {Promise<Object|null>} A promise resolving to the page data if found, or null if an error occurs.
   */
  static async findByRoute(id, params = "") {
    let auth_token = getToken("auth_token");

    const queryParams = params
      ? params + `&sites=${MICROSITE}`
      : `?sites=${MICROSITE}`;

    try {
      const response = await fetch(
        `${APIDOMAIN}/api/route/${id}${queryParams}`,
        {
          method: "GET",
          headers: {
            "x-rate-key": RATE_LIMIT_KEY,
            Authorization: `Bearer ${auth_token}`,
          },
        },
      );

      // Check for HTTP error responses
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      console.log({ data });
      return data;
    } catch (error) {
      console.log({ error });
      // Handle error by returning null to indicate the operation failed
      return null;
    }

    // try {
    //   const res = await BaseApi.customGet(
    //     APIDOMAIN + "/api/route/" + id + queryParams,
    //     {
    //       headers: {
    //         "x-rate-key": RATE_LIMIT_KEY,
    //         Authorization: `Bearer ${auth_token}`,
    //       },
    //     },
    //   );
    //   console.log({ res });
    //   return res.data;
    //   // eslint-disable-next-line no-unused-vars
    // } catch (error) {
    //   console.log("findByRoute", auth_token, error?.response);
    //   // Handle error by returning null to indicate the operation failed
    //   return null;
    // }
  }
}
