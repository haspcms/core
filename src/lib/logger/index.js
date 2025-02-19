import chalk from "chalk";
import SYMBOLS from "./symbols";

/**
 *
 */
export const formatBGMessage = (...message) => {
  return `\n ${message.join(" ")} \n`;
};

const logger = {
  /**
   *
   */
  info: (...message) => {
    console.log(chalk.cyanBright(SYMBOLS.info), ...message);
  },
  /**
   *
   */
  success: (...message) => {
    console.log(chalk.greenBright(SYMBOLS.tick), ...message);
  },
  /**
   *
   */
  warn: (...message) => {
    console.log(chalk.yellowBright(SYMBOLS.warning), ...message);
  },
  /**
   *
   */
  error: (...message) => {
    console.error(chalk.redBright(`${SYMBOLS.cross}`), ...message);
  },
  /**
   *
   */
  debug: (...message) => {
    console.debug(chalk.magentaBright(SYMBOLS.radioOn), ...message);
  },
  /**
   *
   */
  custom: (...message) => {
    console.log(...message);
  },
};

export default logger;
