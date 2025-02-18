import chalk from "chalk";

const logger = {
  info: (message) => {
    console.log(chalk.cyanBright("ℹ"), `${message}`);
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
    console.debug(chalk.magentaBright("◉"), `${message}`);
  },
  custom: (message) => {
    console.log(message);
  },
};

export default logger;
