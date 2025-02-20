import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.NEXT_PUBLIC_TENANT_API;

/**
 * Menu API for retrieving menu data.
 */
export class MENUAPI {
  /**
   * Fetch the menu data for a specified menu ID, with optional additional query parameters.
   *
   * @param {string} menu - The ID of the menu to be fetched.
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the menu data.
   */
  static async getMenus(menu, params = "") {
    const res = await BaseApi.get(APIDOMAIN + `/api/menus/${menu}` + params);
    return res.data;
  }
}
