import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { Jsona } from "jsona";
import rc from "rc";
import { EMOJI, log } from "../logger";

dotenv.config();
const dataFormatter = new Jsona();
const API_BASE = process.env.NEXT_PUBLIC_TENANT_API;

log(EMOJI.wrench, `API_BASE: ${API_BASE}`, {}, "blue"); // Info in blue

// Helper function to fetch API data dynamically
const fetchData = async (endpoint, useDeserialization = true) => {
  try {
    const response = await axios.get(API_BASE + endpoint);
    return useDeserialization
      ? dataFormatter.deserialize(response.data)
      : response.data;
  } catch (error) {
    log(
      EMOJI.error,
      `Error fetching data - Endpoint: ${endpoint}`,
      { error: error.message },
      "red",
    ); // Error in red
    return null;
  }
};

// Write JSON only if data is different
const writeJsonIfChanged = (filename, newData, outputPath) => {
  const directory = outputPath || "./lib/preBuildScripts/static/";
  const filePath = `${directory}${filename}`;

  let existingData = null;
  try {
    existingData = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    // File does not exist, proceed with writing
  }

  if (existingData !== JSON.stringify(newData)) {
    fs.mkdirSync(directory, { recursive: true }); // Ensure directory exists
    fs.writeFileSync(filePath, JSON.stringify(newData));

    log(EMOJI.check, `Generated JSON: ${filePath}`, {}, "green"); // Success in green
  } else {
    log(EMOJI.skip, `Skipped (no changes): ${filePath}`, {}, "yellow"); // Warning in yellow
  }
};

const downloadImage = async (imageUrl, filename, downloadPath) => {
  const directory = downloadPath || "./public/images/";
  const filePath = `${directory}${filename}`;

  fs.mkdirSync(directory, { recursive: true });

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to download: ${response.status}`);

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    log(EMOJI.image, `Downloaded image: ${filePath}`, {}, "green"); // Success in green
  } catch (err) {
    log(
      EMOJI.error,
      `Error downloading image - URL: ${imageUrl}`,
      { error: err.message },
      "red",
    ); // Error in red
  }
};

export const preBuildDevelopment = async () => {
  const config = rc("hasp");

  if (!config || typeof config !== "object") {
    log(EMOJI.error, `Invalid config: ${config}`, {}, "red"); // Error in red
    log(EMOJI.skip, `Aborting prebuild script...`, {}, "yellow"); // Warning in yellow
    return;
  }

  log(EMOJI.rocket, `Starting pre-build script...`, {}, "blue"); // Info in blue

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

  await Promise.all([...prebuildTasks, ...imageDownloadTasks]);

  log(
    EMOJI.check,
    `Pre-Build Data & Images Generated Successfully!`,
    {},
    "green",
  ); // Success in green
};
