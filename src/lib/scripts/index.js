import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import { Jsona } from "jsona";
import rc from "rc";

dotenv.config();
const dataFormatter = new Jsona();
const API_BASE = process.env.NEXT_PUBLIC_TENANT_API;

console.log({ API_BASE });

// Helper function to fetch API data dynamically
const fetchData = async (endpoint, useDeserialization = true) => {
  try {
    const response = await axios.get(API_BASE + endpoint);
    return useDeserialization
      ? dataFormatter.deserialize(response.data)
      : response.data;
  } catch (error) {
    console.error(`\t ❌ Error fetching ${endpoint}:`, error.message);
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
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // File does not exist, proceed with writing
  }

  if (existingData !== JSON.stringify(newData)) {
    console.log(`\t ✅ Generated JSON: \x1b[32m${filePath}\x1b[0m`);
    fs.mkdirSync(directory, { recursive: true }); // Ensure directory exists
    fs.writeFileSync(filePath, JSON.stringify(newData));
  } else {
    console.log(`\t ⏭️ Skipped (no changes): \x1b[33m${filePath}\x1b[0m`);
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

    console.log(`\t 🖼️ Downloaded image: ${filePath}`);
  } catch (err) {
    console.error(`\t ❌ Error downloading ${imageUrl}:`, err.message);
  }
};

export const preBuildDevelopment = async () => {
  const config = rc("hasp");

  if (!config || typeof config !== "object") {
    console.error("\t ❌ Invalid config:", config);
    console.log("\t ⏭️ Aborting prebuild script...");
    return;
  }

  console.log("🚀 Starting pre-build script...");

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

  console.log("\t ✅ Pre-Build Data & Images Generated Successfully!");
};
