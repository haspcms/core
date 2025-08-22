const NodeCache = require("node-cache");
const { default: logger } = require("../logger");

const cache = new NodeCache();

/**
 * Sets a token in the cache with the specified key and value.
 * @param {string} key - The key under which the token is to be stored in the cache.
 * @param {string} value - The token value to be stored in the cache.
 */
const setToken = (key, value) => {
  cache.set(key, value);
};

/**
 * Retrieves a token from the cache for the specified key.
 * @param {string} key - The key of the token to be retrieved.
 * @returns {string|undefined} - The token value if found, or undefined if not.
 */
const getToken = (key) => {
  return cache.get(key);
};

/**
 * Authenticates and caches an authorization token if not already cached.
 * Fetches a new token from the API and saves it in cache if needed.
 * Relies on environment variables for API credentials and URL.
 * @returns {Promise<void>} - A promise that resolves when the token is cached.
 */
const cacheAuthToken = async () => {
  const isLoggingEnabled = process.env.HASP_LOGGING_ENABLED;

  process.env.HASP_TENANT_STRICT_API_ENABLED === "true";

  const isStrictAPIEnabled =
    process.env.HASP_TENANT_STRICT_API_ENABLED === "true";

  const apiKey = process.env.HASP_TENANT_API_KEY;
  const secretKey = process.env.HASP_TENANT_SECRET_KEY;
  const apiUrl = process.env.HASP_TENANT_API;

  const requestBody = {
    api_key: apiKey,
    secret_key: secretKey,
  };

  let auth_token = getToken("auth_token");
  if (isStrictAPIEnabled && !auth_token) {
    try {
      if (isLoggingEnabled) {
        logger.debug("Fetching auth_token...");
      }

      const apiRes = await fetch(`${apiUrl}/api/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await apiRes.json();

      auth_token = data?.token;

      if (isLoggingEnabled) {
        logger.debug("Fetched data...", data);
        logger.debug("Fetched auth_token...", auth_token);
      }
      setToken("auth_token", auth_token);
    } catch (error) {
      console.error("An error occurred while caching the auth token:", error);
    }
  }
};

module.exports = { setToken, getToken, cacheAuthToken };
