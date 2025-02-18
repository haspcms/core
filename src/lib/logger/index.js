import chalk from "chalk";

// Logger utility for common log levels with minimalist ASCII symbols
const logger = {
  info: (message) => {
    console.log(`${message}`);
  },
  success: (message) => {
    console.log(chalk.greenBright("✔"), `${message}`);
  },
  warn: (message) => {
    console.log(chalk.yellowBright("⚠️"), `${message}`);
  },
  error: (message) => {
    console.error(chalk.redBright(`✘ ${message}`));
  },
  debug: (message) => {
    console.debug(`${message}`);
  },
  // Optional: You can add more custom log levels with minimalist symbols
  custom: (level, message) => {
    const levelSymbols = {
      info: "ℹ",
      success: "✔ ",
      warn: "⚠️",
      error: "✘",
      debug: "",
    };

    const symbol = levelSymbols[level] || "🔘"; // Default symbol if not matched
    console.log(chalk.white(`${symbol} ${message}`));
  },
};

export default logger;
