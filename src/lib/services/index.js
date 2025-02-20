import { Jsona } from "jsona";
import { CONTENTAPI, FORMAPI, PAGEAPI, TAXONOMYAPI } from "../api";
const dataFormatter2 = new Jsona();

/**
 * Asynchronously fetches and processes data based on the handler configuration.
 *
 * @param {Object} handler - The handler containing data to be processed.
 * @returns {Promise<Object>} The processed handler with updated data.
 */
export const dataFetcher = async (handler) => {
  await Promise.all(
    Object.keys(handler?.data || {}).map(async (key1) => {
      return await Promise.all(
        Object.keys(handler?.data?.[key1] || {}).map(async (key2) => {
          if (
            key2.includes("preload") ||
            key2 === "collection" ||
            key2 === "collection1" ||
            key2 === "collection2" ||
            key2 === "collection3" ||
            key2 === "collection4" ||
            key2 === "taxonomy" ||
            key2 === "form"
          ) {
            const data = handler?.data?.[key1]?.[key2];
            if (data?.type === "contents") {
              const filters = Object.keys(handler?.data?.[key1])
                .filter((n) => n.includes("filter_taxonomy"))
                .map((n) => {
                  const taxonomy = handler.data[key1][n];
                  // Check params if multiple
                  const params =
                    typeof taxonomy?.length === "number"
                      ? taxonomy?.map((n2) => n2.id).join(",")
                      : taxonomy?.id;
                  return `filter[taxonomies][${n
                    .replace("filter_taxonomy_", "")
                    .replaceAll("_", "-")}]=${params}`;
                })
                .join("&");
              const { limit = 10, sort_by = "published_at" } =
                handler.data[key1];
              const params = `?page[size]=${limit}&sort=${sort_by}&${filters}`;
              const res = await CONTENTAPI.getContents(data.id, params);
              const dataHandler = dataFormatter2.deserialize(res);
              data.contents = clean(dataHandler);
              const { meta } = res;
              delete meta?.links;
              delete meta?.path;
              data.contentsMeta = meta;
            }
            if (data?.type === "forms") {
              const res = await FORMAPI.findForm(data.id, "?include=blueprint");
              const dataHandler = dataFormatter2.deserialize(res);
              data.fields = clean(dataHandler);
            }
            if (data?.type === "taxonomies") {
              const res = await TAXONOMYAPI.findTaxonomy(data.id);
              const dataHandler = dataFormatter2.deserialize(res);
              data.taxonomy = clean(dataHandler);
            }
            clean(data);
          }
        }),
      );
    }),
  );

  return replaceAndFormatMediaConvertions(
    handler,
    "blueprintData",
    "mediaHandler",
  );
};

/**
 * Cleans up the data object by removing unnecessary properties.
 *
 * @param {Object} data - The data object to be cleaned.
 * @returns {Object} The cleaned data object.
 */
export const clean = (data) => {
  delete data?.links;
  delete data?.meta;
  delete data?.relationshipNames;
  delete data?.relationships;
  return data;
};

/**
 * Iterates over blocks, applying the dataFetcher for each block.
 *
 * @param {Array} blocks - The blocks to process.
 * @returns {Promise<Array>} An array of processed blocks.
 */
export async function iterateBlock(blocks) {
  return await Promise.all(
    blocks.map(async (block) => {
      return await dataFetcher(block);
    }),
  );
}

/**
 * Processes a page using the dataFetcher.
 *
 * @param {Object} page - The page data to process.
 * @returns {Promise<Object>} The processed page data.
 */
export async function iteratePage(page) {
  return await dataFetcher(page);
}

/**
 * Retrieves and compiles all pages data.
 *
 * @returns {Promise<Array>} An array containing all pages data.
 */
export async function pagesPath() {
  const pagesHandler = await PAGEAPI.getPages();
  const pages = dataFormatter2.deserialize(pagesHandler);
  let allData = pages;
  let { last_page = 1 } = pagesHandler?.meta || {};
  let current_page = 1;
  while (current_page < last_page) {
    current_page = current_page + 1;
    const pagesHandler = await PAGEAPI.getPages(
      `?page[number]=${current_page}`,
    );
    const pages = dataFormatter2.deserialize(pagesHandler);
    allData = [...allData, ...pages];
  }
  return allData;
}

/**
 * Gathers all entries from specified content.
 *
 * @param {string} content - The content identifier.
 * @returns {Promise<Array>} An array of all content entries.
 */
export async function contentEntriesPath(content) {
  const contentsHandler = await CONTENTAPI.getContents(content);
  const contents = dataFormatter2.deserialize(contentsHandler);
  let allData = contents;
  let { last_page = 1 } = contentsHandler?.meta || {};
  let current_page = 1;
  while (current_page < last_page) {
    current_page = current_page + 1;
    const contentsHandler = await CONTENTAPI.getContents(
      content,
      `?page[number]=${current_page}`,
    );
    const contents = dataFormatter2.deserialize(contentsHandler);
    allData = [...allData, ...contents];
  }
  return allData;
}

/**
 * Extracts media conversions from blueprint data.
 *
 * @param {Array} blueprintData - The array containing media data in blueprint.
 * @returns {Object} An object with media conversions.
 */
export function getMediaConvertions(blueprintData = []) {
  const media = {};
  blueprintData?.forEach((e) => {
    if (e?.attributes?.media?.length) {
      media[e?.attributes?.state_path] = e?.attributes?.media?.map((e1) => {
        return {
          original: e1?.attributes?.original_url,
          conversions: e1?.attributes?.generated_conversions,
        };
      });
    }
  });
  return media;
}

/**
 * Recursively replaces and formats media conversions in an object.
 *
 * @param {Object} obj - The target object to process.
 * @param {string} searchKey - The key to search for in the object.
 * @param {string} replaceKey - The key to replace in the object.
 * @returns {Object} The object with replaced key/values.
 */
export function replaceAndFormatMediaConvertions(obj, searchKey, replaceKey) {
  // Check if the input is an object
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  // If the current object is an array, iterate through its elements
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      replaceAndFormatMediaConvertions(item, searchKey, replaceKey),
    );
  }

  // Create a new object to hold the replaced key/value pairs
  const result = {};

  for (const key in obj) {
    if (key === searchKey) {
      const reformatData = getMediaConvertions(obj[key]);
      result[replaceKey] = replaceAndFormatMediaConvertions(
        reformatData,
        searchKey,
        replaceKey,
      );
    } else {
      result[key] = replaceAndFormatMediaConvertions(
        obj[key],
        searchKey,
        replaceKey,
      );
    }
  }

  return result;
}
