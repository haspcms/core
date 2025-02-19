import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import { Jsona } from "jsona";
import path from "path";
import rc from "rc";
import logger, { formatBGMessage } from "../logger";
import SYMBOLS from "../logger/symbols";

dotenv.config();
const dataFormatter = new Jsona();
const BASE_API = process.env.NEXT_PUBLIC_TENANT_API;

// Helper function to fetch API data dynamically
const fetchData = async (endpoint, useDeserialization = true) => {
  try {
    const response = await axios.get(BASE_API + endpoint);
    return useDeserialization
      ? dataFormatter.deserialize(response.data)
      : response.data;
  } catch (error) {
    logger.error(`Error fetching ${endpoint}: ${error.message}`);
    return null;
  }
};

// Remove all files in a directory
const cleanDirectory = (directory) => {
  if (!fs.existsSync(directory)) return;
  const files = fs.readdirSync(directory);
  if (files.length === 0) return;

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    fs.unlinkSync(filePath);
  });

  logger.success(`Cleaned up old files from ${chalk.greenBright(directory)}`);
};

// Automatically detect and clean all prebuild directories
export const cleanAllPrebuildFiles = () => {
  const config = rc("hasp");
  if (!config || typeof config !== "object") {
    logger.warn("No valid configuration found. Skipping cleanup.");
    return;
  }

  const outputPaths = new Set([
    ...(config.prebuildJSONS || []).map((item) => item.outputPath),
    ...(config.prebuildImages || []).map((item) => item.downloadPath),
  ]);

  logger.info("Cleaning all detected prebuild directories...");
  outputPaths.forEach(cleanDirectory);
  logger.success("Prebuild cleanup completed successfully.");
};

// Write JSON only if data is different
const writeJsonIfChanged = (filename, newData, outputPath) => {
  const directory = outputPath || "./lib/preBuildScripts/static/";
  const filePath = `${directory}${filename}`;

  let existingData = null;
  try {
    existingData = fs.readFileSync(filePath, "utf8");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // File does not exist, proceed with writing
  }

  if (existingData !== JSON.stringify(newData)) {
    logger.success(`Generated JSON: ${chalk.greenBright(filePath)}`);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(newData));
  } else {
    logger.custom(
      `${chalk.yellowBright("❯")} Skipped JSON generation (no changes): ${chalk.yellowBright(filePath)}`,
    );
  }
};

// Download image helper
const downloadImage = async (imageUrl, filename, downloadPath) => {
  const directory = downloadPath || "./public/images/";
  const filePath = `${directory}${filename}`;

  fs.mkdirSync(directory, { recursive: true });

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    logger.success(`Downloaded image: ${chalk.greenBright(filePath)}`);
  } catch (err) {
    logger.error(`Error downloading ${imageUrl}: ${err.message}`);
  }
};

// Main prebuild function
export const preBuildDevelopment = async () => {
  const config = rc("hasp");

  if (!config || typeof config !== "object") {
    logger.error(`Invalid config: ${config}`);
    logger.warn("Aborting prebuild script...");
    return;
  }

  logger.custom(
    chalk.bgBlueBright.black(
      formatBGMessage(SYMBOLS.reload, "Running pre-build tasks..."),
    ),
  );

  // Fetch all prebuild JSONs dynamically
  const prebuildTasks = (config?.prebuildJSONS || []).map(
    async ({ name, endpoint, outputPath, useDeserialization = true }) => {
      const data = await fetchData(endpoint, useDeserialization);
      if (data) {
        writeJsonIfChanged(`${name}.json`, data, outputPath);
      }
    },
  );

  // Download all images dynamically
  const imageDownloadTasks = (config?.prebuildImages || []).map(
    async ({ url, filename, downloadPath }) => {
      await downloadImage(url, filename, downloadPath);
    },
  );

  // Run all tasks concurrently
  await Promise.all([...prebuildTasks, ...imageDownloadTasks]);

  logger.custom(
    chalk.bgGreenBright.black(
      formatBGMessage(
        SYMBOLS.tick,
        "All pre-build tasks executed successfully!",
      ),
    ),
  );
};
