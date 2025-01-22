import rc from "rc";

var confJSON = rc("hasp");
const config = JSON.stringify(confJSON, null, 2);
console.log({ config });

console.log("contents:", config?.contents);
console.log("[INFO] HASP Core started.");

export * from "./lib";
