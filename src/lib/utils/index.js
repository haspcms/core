export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}

// import { cosmiconfig } from "cosmiconfig";

// export async function loadHaspConfig() {
//   const explorer = cosmiconfig("hasp");
//   const result = await explorer.search();

//   if (!result || result.isEmpty) {
//     throw new Error("hasp.config.js not found or empty.");
//   }

//   return result.config;
// }
