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
      external: [
        "axios",
        "react",
        "react-dom",
        "swr",
        "jsona",
        "fs",
        "path",
        "rc",
      ],
      output: {
        globals: {
          axios: "axios",
          react: "React",
          "react-dom": "ReactDOM",
          swr: "SWR",
          jsona: "Jsona",
          rc: "rc",
          fs: "fs",
          path: "path",
        },
      },
    },
  },
});
