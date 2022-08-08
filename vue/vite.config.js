/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
// create default vite config
export default defineConfig({
  plugins: [vue()],
  // use vite-cli to resolve modules
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "@": "src",
      // "@components": "src/components",
    },
  },
  // proxy all requests to /api to vite-server
  server: {
    port: 3000,
    proxy: {
      "^/api/": {
        target: "http://localhost:80/zettelfix.de/",
      },
    },
  },
  //   // entry point of our app
  //   entry: {
  //     app: "./src/main.ts",
  //   },
});
