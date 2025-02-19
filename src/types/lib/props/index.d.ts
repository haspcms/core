export function paths(config: any): Promise<{
  paths: {
    params: {
      id: any;
    };
  }[];
  fallback: boolean;
}>;
export function props(context: any): Promise<
  | {
      props: {
        page: any;
        blocks: any[];
      };
      notFound?: undefined;
    }
  | {
      notFound: boolean;
      props?: undefined;
    }
>;
//# sourceMappingURL=index.d.ts.map
