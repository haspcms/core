import rc from "rc";

const APP_NAME = "hasp";
const confJSON = rc(APP_NAME);

export const loadConfig = () => {
  return confJSON;
};

export function sortBlocks(list) {
  return list.sort((a, b) => a.order - b.order);
}
