import chalk from "chalk";

const log = (emoji, message, extraData = {}, color = "green") => {
  // Choose color based on log type
  const colorMethod = chalk[color] || chalk.green;

  // Log formatted message
  const formattedMessage = `${emoji} ${message}`;

  const logObject = {
    message: colorMethod(formattedMessage),
    ...extraData, // Add any extra data to the log if provided
  };

  console.log(JSON.stringify(logObject));
};

// Emoji literals without quotations (just use constants in the function call)
const EMOJI = {
  wrench: `🔧`,
  check: `✅`,
  error: `❌`,
  image: `🖼️`,
  rocket: `🚀`,
  skip: `⏭️`,
};

export { EMOJI, log };
