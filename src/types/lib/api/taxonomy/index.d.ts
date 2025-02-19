/**
 *
 */
export class TAXONOMYAPI {
  static getTaxonomies(params?: string): Promise<any>;
  static findTaxonomy(id: any, params?: string): Promise<any>;
  static findTaxonomySwr(
    id: any,
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
