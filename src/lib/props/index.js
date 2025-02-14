import { Jsona } from "jsona";
import rc from "rc";
import { PAGEAPI } from "../api";
import {
  contentEntriesPath,
  iterateBlock,
  iteratePage,
  pagesPath,
} from "../services";
import { sortBlocks } from "../utils";

const dataFormatter = new Jsona();

export const paths = async () => {
  try {
    const pages = await pagesPath();
    const filteredPages = pages?.filter((e) => e.route_url !== "/") || [];
    const config = rc("hasp");

    // const haspConfig = getConfig();
    // console.log("props", { haspConfig });

    if (!config || typeof config !== "object") {
      console.error("Invalid config:", config);
      return { paths: [], fallback: false };
    }

    const configStr = JSON.stringify(config, getCircularReplacer(), 2);
    console.log("Configuration:", configStr);
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

// Helper function to prevent circular reference errors
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);
    }
    return value;
  };
}

export const props = async (context) => {
  const { cosmiconfigSync } = await import("cosmiconfig"); // Dynamic import to prevent build errors
  const explorer = cosmiconfigSync("hasp");

  // Automatically search for `hasp.config.js`
  const result = explorer.search();

  // Default to empty config if not found
  const haspConfig = result?.config || { contents: {} };
  console.log("propsxx", { haspConfig });

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

// export const getConfig = async () => {
//   const { cosmiconfig } = await import("cosmiconfig"); // Dynamic import for ESM
//   const explorer = cosmiconfig("hasp");

//   const result = await explorer.search(); // Async search
//   const haspConfig = result?.config || { contents: {} };

//   console.log("haspConfigx", haspConfig);
//   return haspConfig;
// };
