import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.NEXT_PUBLIC_TENANT_API;

/**
 *
 */
export class MENUAPI {
  static async getMenus(menu, params = "") {
    const res = await BaseApi.get(APIDOMAIN + `/api/menus/${menu}` + params);
    return res.data;
  }
}
