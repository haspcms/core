import chalk from "chalk";
import SYMBOLS from "./symbols";

/**
 * Formats a background-styled message by joining the provided arguments.
 *
 * @param {...string} message - A list of strings to format and join.
 * @returns {string} A formatted string surrounded by newline characters.
 */
export function formatBGMessage(...message) {
  return `\n ${message.join(" ")} \n`;
}

const logger = {
  /**
   * Logs an informational message to the console in cyan.
   *
   * @param {...string} message - The message parts to log.
   */
  info: (...message) => {
    console.log(chalk.cyanBright(SYMBOLS.info), ...message);
  },
  /**
   * Logs a success message to the console in green.
   *
   * @param {...string} message - The message parts to log.
   */
  success: (...message) => {
    console.log(chalk.greenBright(SYMBOLS.tick), ...message);
  },
  /**
   * Logs a warning message to the console in yellow.
   *
   * @param {...string} message - The message parts to log.
   */
  warn: (...message) => {
    console.log(chalk.yellowBright(SYMBOLS.warning), ...message);
  },
  /**
   * Logs an error message to the console in red.
   *
   * @param {...string} message - The message parts to log.
   */
  error: (...message) => {
    console.error(chalk.redBright(`${SYMBOLS.cross}`), ...message);
  },
  /**
   * Logs a debug message to the console in magenta.
   *
   * @param {...string} message - The message parts to log.
   */
  debug: (...message) => {
    console.debug(chalk.magentaBright(SYMBOLS.radioOn), ...message);
  },
  /**
   * Logs a custom message to the console with no formatting.
   *
   * @param {...string} message - The message parts to log.
   */
  custom: (...message) => {
    console.log(...message);
  },
};

export default logger;
