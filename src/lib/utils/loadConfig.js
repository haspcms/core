import rc from "rc";

const APP_NAME = "hasp";

// Singleton pattern to cache the configuration
let confJSON;

export const loadConfig = () => {
  if (!confJSON) {
    confJSON = rc(APP_NAME);
  }

  const configString = JSON.stringify(confJSON, null, 2);
  console.log({ configString });

  // Directly use the cached confJSON instead of parsing
  console.log({ confJSON });

  return confJSON;
};
