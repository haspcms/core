import { Jsona } from "jsona";
import { PAGEAPI } from "../api";
import {
  contentEntriesPath,
  iterateBlock,
  iteratePage,
  pagesPath,
} from "../services";
import { sortBlocks } from "../utils";
console.log("props", Jsona);
const dataFormatter = new Jsona();

// import rc from "rc";
// const confJSON = rc("hasp");
// // const config = JSON.stringify(confJSON, null, 2);
// // console.log({ config }); x
// console.log({ confJSON });

// import { stringify } from "flatted";
// import rc from "rc";

// const confJSON = rc("hasp");
// const config = stringify(confJSON, null, 2); // Handles circular references
// console.log({ config });

import cloneDeep from "lodash/cloneDeep";
import rc from "rc";

// Get the configuration object
const confJSON = rc("hasp");

export const paths = async () => {
  const pages = await pagesPath();
  const filteredPages = pages?.filter((e) => e.route_url !== "/") || [];

  // const contentTypes = ["article"];
  // Create a deep clone of the object using Lodash's cloneDeep
  const clonedConfJSON = cloneDeep(confJSON);

  // Now you can use the cloned object without circular reference issues
  // console.log(clonedConfJSON);
  const contentTypes = clonedConfJSON?.contents;
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
