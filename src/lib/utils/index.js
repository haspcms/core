export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}

import { cosmiconfigSync } from "cosmiconfig";

export function loadHaspConfig() {
  const explorer = cosmiconfigSync("hasp"); // Looks for hasp.config.js
  const result = explorer.search();

  if (!result || result.isEmpty) {
    throw new Error("hasp.config.js not found or empty.");
  }

  return result.config;
}
