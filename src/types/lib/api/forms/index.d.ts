export class FORMAPI {
  static findForm(id: any, params?: string): Promise<any>;
  static findFormsSwr(
    params?: string,
    options?: {},
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
  static getFormsSwr(
    params?: string,
    options?: {},
  ): {
    data: any;
    mutate: Function;
    isValidating: boolean;
    error: any;
  };
  static submitForm(params?: string, payload?: {}): Promise<any>;
  static gererateFileURL(payload?: {}): Promise<any>;
  static uploadFileURL(
    generatedURL: any,
    payload: string,
    type: any,
  ): Promise<any>;
}
