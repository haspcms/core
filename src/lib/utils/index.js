import rc from "rc";

const APP_NAME = "hasp";
const confJSON = rc(APP_NAME);

export const loadConfig = () => {
  const configString = JSON.stringify(confJSON, null, 2);
  console.log({ configString });

  // Access the config as a JavaScript object
  const configObject = JSON.parse(configString);
  console.log({ configObject });

  return configObject;
};

export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}
