import findupSync from "findup-sync";

console.log("HASP Core started.");
const filePath = findupSync("filename");
console.log({ filePath });

// import { promises as fs } from "fs";

// export async function loadConfig() {
//   const configFileName = "hasp.config.js";
//   const configPath = path.resolve(process.cwd(), configFileName);

//   try {
//     await fs.access(configPath);

//     const configModule = await import(configPath);
//     const config = configModule.default || configModule;

//     if (typeof config !== "object" || config === null) {
//       throw new Error("Configuration file does not export an object.");
//     }

//     return config;
//   } catch (error) {
//     console.error(
//       "Error loading configuration:",
//       error instanceof Error ? error.message : error,
//     );
//     return {};
//   }
// }

export * from "./lib";
