import chalk from "chalk";

// Logger utility for common log levels
const logger = {
  info: (message) => {
    console.log(chalk.cyan(`INFO: ${message}`));
  },
  success: (message) => {
    console.log(chalk.green(`SUCCESS: ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellow(`WARNING: ${message}`));
  },
  error: (message) => {
    console.error(chalk.red(`ERROR: ${message}`));
  },
  debug: (message) => {
    console.debug(chalk.blue(`DEBUG: ${message}`));
  },
  // Optional: You can add more custom log levels
  custom: (level, message) => {
    const levelColors = {
      info: chalk.cyan,
      success: chalk.green,
      warn: chalk.yellow,
      error: chalk.red,
      debug: chalk.blue,
    };

    const logColor = levelColors[level] || chalk.white; // Default to white
    console.log(logColor(`${level.toUpperCase()}: ${message}`));
  },
};

export default logger;
