import { BaseApi } from "../base-api";

const APIDOMAIN = process.env.NEXT_PUBLIC_TENANT_API;

/**
 * Form API for interacting with form data and submissions.
 */
export class FORMAPI {
  /**
   * Find a specific form by its ID.
   *
   * @param {string} id - The ID of the form to retrieve.
   * @param {string} [params=""] - Additional query parameters for the request.
   * @returns {Promise<Object>} A promise resolving to the form data.
   */
  static async findForm(id, params = "") {
    const res = await BaseApi.get(APIDOMAIN + "/api/forms/" + id + params);
    return res.data;
  }

  /**
   * Use SWR (Stale-While-Revalidate) to find forms with optional parameters.
   *
   * @param {string} [params=""] - Additional query parameters for the request.
   * @param {Object} [options={}] - Options for SWR configuration.
   * @returns {Function} A SWR hook to handle data fetching and state management.
   */
  static findFormsSwr(params = "", options = {}) {
    return BaseApi.swr(APIDOMAIN + "/api/forms" + params, options);
  }

  /**
   * Use SWR to get forms with optional parameters.
   *
   * @param {string} [params=""] - Additional query parameters for the request.
   * @param {Object} [options={}] - Options for SWR configuration.
   * @returns {Function} A SWR hook to handle data fetching and state management.
   */
  static getFormsSwr(params = "", options = {}) {
    return BaseApi.swr(APIDOMAIN + "/api/pages" + params, options);
  }

  /**
   * Submit form data to a specified form endpoint.
   *
   * @param {string} params - The parameters for the form submission endpoint.
   * @param {Object} [payload={}] - The payload containing form data to be submitted.
   * @returns {Promise<Object>} A promise resolving to the response of the submission.
   */
  static submitForm(params = "", payload = {}) {
    return BaseApi.post(
      APIDOMAIN + `/api/forms/${params}/submissions`,
      payload,
    );
  }

  /**
   * Generate a file URL for uploading documents or files.
   *
   * @param {Object} [payload={}] - The payload containing file information.
   * @returns {Promise<Object>} A promise resolving to the generated file URL.
   */
  static gererateFileURL(payload = {}) {
    return BaseApi.post(APIDOMAIN + "/api/generate/upload-url", payload);
  }

  /**
   * Upload a file to a previously generated URL.
   *
   * @param {string} generatedURL - The pre-signed URL for file upload.
   * @param {string} [payload=""] - The file data to upload.
   * @param {string} type - The MIME type of the file being uploaded.
   * @returns {Promise<Object>} A promise resolving to the response of the upload request.
   */
  static uploadFileURL(generatedURL, payload = "", type) {
    return BaseApi.customPut(generatedURL, payload, {
      headers: {
        "Content-Type": type,
      },
    });
  }
}
