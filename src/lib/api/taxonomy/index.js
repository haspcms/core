import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.NEXT_PUBLIC_TENANT_API;

/**
 * TAXONOMYAPI provides static methods to interact with taxonomy-related API endpoints,
 * allowing for the retrieval and management of taxonomies and their associated terms.
 */
export class TAXONOMYAPI {
  /**
   * Fetch a list of taxonomies, with optional filtering parameters.
   *
   * @param {string} [params=""] - Optional query parameters for additional filtering.
   * @returns {Promise<Object>} A promise resolving to the taxonomies data.
   */
  static async getTaxonomies(params = "") {
    const res = await BaseApi.get(APIDOMAIN + "/api/taxonomies" + params);
    return res.data;
  }

  /**
   * Retrieve a specific taxonomy by its ID, including related terms and their hierarchical structure.
   *
   * @param {string} id - The ID of the taxonomy to retrieve.
   * @param {string} [params=""] - Optional query parameters.
   * @returns {Promise<Object>} A promise resolving to the taxonomy data with its relations.
   */
  static async findTaxonomy(id, params = "") {
    const res = await BaseApi.get(
      APIDOMAIN +
        "/api/taxonomies/" +
        id +
        `?include=parentTerms.children,parentTerms.taxonomy,taxonomyTerms.children,taxonomyTerms.taxonomy${params}`,
    );
    return res.data;
  }

  /**
   * Use SWR to retrieve a specific taxonomy by its ID, supporting real-time updates.
   *
   * @param {string} id - The ID of the taxonomy to retrieve.
   * @param {string} [params=""] - Optional query parameters for additional filtering.
   * @param {Object} [options={}] - Configuration options for SWR.
   * @returns {Function} An SWR hook for managing and updating taxonomy data.
   */
  static findTaxonomySwr(id, params = "", options = {}) {
    return BaseApi.swr(
      APIDOMAIN +
        "/api/taxonomies/" +
        id +
        `?include=parentTerms.children,parentTerms.taxonomy,taxonomyTerms.children,taxonomyTerms.taxonomy${params}`,
      options,
    );
  }
}
