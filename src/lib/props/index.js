import { Jsona } from "jsona";
import { PAGEAPI } from "../api";
import {
  contentEntriesPath,
  iterateBlock,
  iteratePage,
  pagesPath,
} from "../services";
import { sortBlocks } from "../utils";

const dataFormatter = new Jsona();

/**
 *
 */
export const paths = async (config) => {
  try {
    const pages = await pagesPath();
    const filteredPages = pages?.filter((e) => e.route_url !== "/") || [];

    // TODO allow fallback if no config
    // if (!config || typeof config !== "object") {
    //   console.error("Invalid config:", config);
    //   return { paths: [], fallback: false };
    // }

    const contentTypes = Object.keys(config?.contents || {});

    console.log({ contentTypes });
    const contentData = await Promise.all(
      contentTypes.map(async (contentType) => {
        return await contentEntriesPath(contentType);
      }),
    );
    const pathsHandler = [...filteredPages, ...contentData.flat()];
    const paths = pathsHandler
      .filter((page) => typeof page.route_url === "string")
      .map((page) => ({
        params: { id: page.route_url.split("/").slice(1) },
      }));

    return { paths, fallback: false };
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return { paths: [], fallback: false };
  }
};

/**
 *
 */
export const props = async (context) => {
  const id = context?.params?.id || [];
  const segment = id.join("/");
  const pageHandler = await PAGEAPI.findByRoute(
    segment,
    "?include=blockContents.block,metaData,content,taxonomyTerms.taxonomy",
  );

  try {
    const page = dataFormatter.deserialize(pageHandler);
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
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
