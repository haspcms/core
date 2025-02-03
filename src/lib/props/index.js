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

// const confJSON = rc("hasp");

// const config = stringify(confJSON);
// const config = stringify(confJSON);

const dataFormatter = new Jsona();

export const paths = async () => {
  try {
    const pages = await pagesPath();
    const filteredPages = pages?.filter((e) => e.route_url !== "/") || [];

    const confJSON = rc("hasp");

    // Ensure confJSON is valid before stringifying
    if (!confJSON || typeof confJSON !== "object") {
      console.error("Invalid confJSON:", confJSON);
      return { paths: [], fallback: false };
    }

    // Handle Circular References and Non-Serializable Values
    const str = JSON.stringify(confJSON, getCircularReplacer(), 2);
    console.log("Configuration JSON:", str);

    // Ensure contentTypes is initialized properly
    const contentTypes = Array.isArray(confJSON?.contents)
      ? [...confJSON.contents]
      : [];

    console.log({ contentTypes });

    // Fetch content data safely
    const contentData = await Promise.all(
      contentTypes.map(async (contentType) => {
        return await contentEntriesPath(contentType);
      }),
    );

    // Merge pages and content data
    const pathsHandler = [...filteredPages, ...contentData.flat()];

    // Generate paths while ensuring route_url is valid
    const paths = pathsHandler
      .filter((page) => typeof page.route_url === "string")
      .map((page) => ({
        params: { id: page.route_url.split("/").slice(1) },
      }));

    return { paths, fallback: false };
  } catch (error) {
    console.error("Error in paths function:", error);
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

export const consoleProps = () => {
  console.log("console props");
};
