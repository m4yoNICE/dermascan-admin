import React from "react";
import { defineConfig } from "vite";
import jsconfigPaths from "vite-jsconfig-paths";

export default defineConfig({
  plugins: [jsconfigPaths()],
  root: "./",
  server: {
    port: 5173,
  },
});
