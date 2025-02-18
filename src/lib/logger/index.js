import chalk from "chalk";

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
  custom: (level, message) => {
    const levelSymbols = {
      info: "ℹ",
      success: "✔ ",
      warn: "⚠️",
      error: "✘",
      debug: "",
    };

    const symbol = levelSymbols[level] || "🔘";
    console.log(chalk.white(`${symbol} ${message}`));
  },
};

export default logger;
