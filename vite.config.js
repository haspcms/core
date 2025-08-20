import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
        "chalk",
        "node-cache",
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
          chalk: "chalk",
          "node-cache": "node-cache",
        },
      },
    },
  },
  plugins: [
    dts({
      outDir: "./dist",
      insertTypesEntry: true,
    }),
  ],
});
