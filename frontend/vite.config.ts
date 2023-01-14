/** @type {import('vite').UserConfig} */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// create default vite config
const now = new Date();
export default defineConfig({
  plugins: [vue()],
  // use vite-cli to resolve modules
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // "@": fileURLToPath(new URL("./src", import.meta.url)),
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
