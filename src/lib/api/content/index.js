import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.NEXT_PUBLIC_TENANT_API;
const MICROSITE = process.env.NEXT_PUBLIC_MICROSITE_ID || "";

/**
 * Content API for interacting with content data.
 */
export class CONTENTAPI {
  /**
   * Fetch the contents based on the provided content ID and parameters.
   *
   * @param {string} id - The ID of the content to fetch.
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the content data.
   */
  static async getContents(id, params = "") {
    const queryParams = params
      ? params + `&filter[sites.id]=${MICROSITE}`
      : `?filter[sites.id]=${MICROSITE}`;
    const res = await BaseApi.get(
      APIDOMAIN + `/api/contents/${id}/entries` + queryParams,
    );
    return res.data;
  }

  /**
   * Retrieve a specific entry by content ID and entry ID.
   *
   * @param {string} contentId - The ID of the content.
   * @param {string} entryId - The ID of the entry.
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the entry data.
   */
  static async findEntry(contentId, entryId, params = "") {
    const res = await BaseApi.get(
      APIDOMAIN + `/api/contents/${contentId}/entries/${entryId}` + params,
    );
    return res.data;
  }

  /**
   * Find specific content by its ID.
   *
   * @param {string} id - The ID of the content.
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the content data.
   */
  static async findContent(id, params = "") {
    const res = await BaseApi.get(APIDOMAIN + `/api/contents/${id}` + params);
    return res.data;
  }

  /**
   * Get contents using SWR (Stale-While-Revalidate) with optional parameters.
   *
   * @param {string} [params=""] - Additional query parameters for the request.
   * @param {Object} [options={}] - Options for SWR configuration.
   * @returns {Function} A SWR hook to handle data fetching and state management.
   */
  static getContentsSwr(params = "", options = {}) {
    const queryParams = params
      ? params + `&filter[sites.id]=${MICROSITE}`
      : `?filter[sites.id]=${MICROSITE}`;
    return BaseApi.swr(APIDOMAIN + `/api/contents` + queryParams, options);
  }
}
