/**
 *
 */
export class CONTENTAPI {
  static getContents(id: any, params?: string): Promise<any>;
  static findEntry(contentId: any, entryId: any, params?: string): Promise<any>;
  static findContent(id: any, params?: string): Promise<any>;
  static getContentsSwr(
    params?: string,
    options?: {},
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
}
//# sourceMappingURL=index.d.ts.map
