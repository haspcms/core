import { Jsona } from "jsona";
import { PAGEAPI } from "../api";
import logger from "../logger";
import {
  contentEntriesPath,
  iterateBlock,
  iteratePage,
  pagesPath,
} from "../services";
import { sortBlocks } from "../utils";
import { cacheAuthToken } from "../utils/node-cache.cjs";
const dataFormatter = new Jsona();

/**
 * Generates paths intended for use with Next.js static site generation.
 *
 * @see {@link https://nextjs.org/docs/api-reference/data-fetching/get-static-paths}
 *
 * @param {Object} config - Configuration object containing content types.
 * @param {Object.<string, any>} config.contents - An object representing content types.
 * @returns {Promise<import('next').GetStaticPathsResult>}
 *    An object containing `paths` for static generation and `fallback` behavior.
 */
export async function paths(config) {
  try {
    await cacheAuthToken();
    const pages = await pagesPath();
    console.log({ pages });
    const filteredPages =
      pages?.filter((e) => e.route_url && e.route_url !== "/") || [];
    if (!config || typeof config !== "object") {
      logger.error("Invalid config:", config);
    }

    const contentTypes = Object.keys(config?.contents || {});
    const contentData = await Promise.all(
      contentTypes.map(async (contentType) => {
        if (!contentType) {
          return null;
        }
        return await contentEntriesPath(contentType);
      }),
    );
    const pathsHandler = [...filteredPages, ...contentData.flat()];
    console.log({ pathsHandler });
    const paths = pathsHandler
      .filter((page) => typeof page.route_url === "string" && page.route_url)
      .map((page) => ({
        params: { id: page.route_url.split("/").slice(1) },
      }));

    return { paths, fallback: false };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { paths: [], fallback: false };
  }
}

/**
 * Prepares properties for rendering a page in a Next.js application.
 *
 * @see {@link https://nextjs.org/docs/api-reference/data-fetching/get-static-props}
 *
 * @param {import('next').GetStaticPropsContext} context - The context containing routing parameters.
 * @returns {Promise<import('next').GetStaticPropsResult<any>>}
 *    An object with either `props` for the page or `notFound`.
 */
export async function props(context) {
  const isLoggingEnabled = process.env.HASP_LOGGING_ENABLED;

  const id = context?.params?.id || [];
  const segment = id.join("/");

  try {
    console.log({ id, segment });
    await cacheAuthToken();
    const pageHandler = await PAGEAPI.findByRoute(
      segment,
      "?include=blockContents.block,metaData,content,taxonomyTerms.taxonomy",
    );
    console.log({ pageHandler });
    const page = dataFormatter.deserialize(pageHandler);
    console.log({ page });
    const blocksHandler =
      page?.blockContents?.map((e) => {
        return {
          key: e?.block?.component || null,
          order: e?.order || null,
          data: e?.data || null,
          blueprintData: e?.blueprintData || null,
        };
      }) || [];
    const blocks = sortBlocks(blocksHandler);
    delete page.links;
    delete page.meta;
    delete page.relationshipNames;
    delete page.blockContents;
    return {
      props: {
        page: await iteratePage(page),
        blocks: await iterateBlock(blocks),
      },
    };
  } catch (error) {
    console.log({ isLoggingEnabled, error });
    if (isLoggingEnabled) {
      logger.error(error);
      logger.error(error?.response);
    }
    return {
      notFound: true,
    };
  }
}
