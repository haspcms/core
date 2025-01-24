import { stringify } from "flatted"; // Import from flatted to handle circular references
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

// Get the configuration object
const confJSON = rc("hasp");

// Use flatted to safely stringify the object, handling circular references
const config = stringify(confJSON); // Handles circular references

const dataFormatter = new Jsona();

export const paths = async () => {
  const pages = await pagesPath();
  const filteredPages = pages?.filter((e) => e.route_url !== "/") || [];

  // Extract content types from the configuration
  const contentTypes = config?.contents || [];
  console.log({ confJSON });
  console.log({ config });
  console.log({ contentTypes });

  const contentData = await Promise.all(
    contentTypes.map(async (contentType) => {
      return await contentEntriesPath(contentType);
    }),
  );

  const pathsHandler = [...filteredPages, ...contentData.flat()];
  const paths = pathsHandler.map((page) => {
    const segments = page.route_url.split("/").slice(1);
    return {
      params: { id: segments },
    };
  });
  return { paths, fallback: false };
};

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
