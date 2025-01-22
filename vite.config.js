import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "@haspcms/core",
      fileName: "core",
    },
    rollupOptions: {
      // Externalize peer dependencies to prevent bundling them
      external: [
        "axios",
        "react",
        "react-dom",
        "swr",
        "jsona",
        "fs",
        "path",
        "rc",
        "cosmiconfig",
      ],
      output: {
        // Provide global variables for UMD builds
        globals: {
          axios: "axios",
          react: "React",
          "react-dom": "ReactDOM",
          swr: "SWR",
          jsona: "Jsona",
        },
      },
    },
  },
});
