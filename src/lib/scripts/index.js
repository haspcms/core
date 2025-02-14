import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
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
    console.error(`❌ Error fetching ${endpoint}:`, error.message);
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
    console.log(`✅ Generated JSON: \x1b[32m${filePath}\x1b[0m`);
    fs.mkdirSync(directory, { recursive: true }); // Ensure directory exists
    fs.writeFileSync(filePath, JSON.stringify(newData));
  } else {
    console.log(`⏭️  Skipped (no changes): \x1b[33m${filePath}\x1b[0m`);
  }
};

// Download and save an image
const downloadImage = async (imageUrl, filename, downloadPath) => {
  const directory = downloadPath || "./public/images/";
  const filePath = `${directory}${filename}`;

  fs.mkdirSync(directory, { recursive: true }); // Ensure directory exists

  const file = fs.createWriteStream(filePath);
  https
    .get(imageUrl, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`🖼️  Downloaded image: ${filePath}`);
      });
    })
    .on("error", (err) => {
      console.error(`❌ Error downloading ${imageUrl}:`, err.message);
    });
};

export const preBuildDevelopment = async (configJS) => {
  console.log("preBuildDevelopment", configJS);

  const config = configJS || rc("hasp");

  if (!config || typeof config !== "object") {
    console.error("❌ Invalid config:", config);
    process.exit(1);
  }

  console.log("🚀 Starting pre-build script...");

  console.log("🛠️ Configuration:", JSON.stringify(config, null, 2));

  // Fetch all prebuild JSONs dynamically
  const prebuildTasks = (config?.prebuildJSONS || []).map(
    async ({ name, endpoint, outputPath, useDeserialization = true }) => {
      const data = await fetchData(endpoint, useDeserialization);
      if (data) {
        writeJsonIfChanged(`${name}.json`, data, outputPath);
      }
    },
  );

  // // Download all images dynamically
  // const imageDownloadTasks = (confJSON?.prebuildImages || []).map(
  //   async ({ url, filename, downloadPath }) => {
  //     await downloadImage(url, filename, downloadPath);
  //   },
  // );

  await Promise.all([...prebuildTasks]);

  console.log("✅ Pre-Build Data & Images Generated Successfully!");
};
