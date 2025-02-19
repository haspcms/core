export function iterateBlock(blocks: any): Promise<any[]>;
export function iteratePage(page: any): Promise<any>;
export function pagesPath(): Promise<
  | import("jsona/lib/JsonaTypes").TJsonaModel
  | import("jsona/lib/JsonaTypes").TJsonaModel[]
>;
export function contentEntriesPath(
  content: any,
): Promise<
  | import("jsona/lib/JsonaTypes").TJsonaModel
  | import("jsona/lib/JsonaTypes").TJsonaModel[]
>;
export function getMediaConvertions(blueprintData?: any[]): {};
export function replaceAndFormatMediaConvertions(
  obj: any,
  searchKey: any,
  replaceKey: any,
): any;
export function dataFetcher(handler: any): Promise<any>;
export function clean(data: any): any;
export function consoleServices(): void;
