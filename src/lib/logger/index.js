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
  custom: (message) => {
    console.log(message);
  },
};

export default logger;
