/**
 *
 */
export class PAGEAPI {
  static getPages(params?: string): Promise<any>;
  static findPage(id: any, params?: string): Promise<any>;
  static findPageByRoute(id: any, params?: string): Promise<any>;
  static getPagesSwr(
    params?: string,
    options?: {},
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
  static getFindPagesSwr(
    id: any,
    params?: string,
    options?: {},
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
  static findByRoute(id: any, params?: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map
