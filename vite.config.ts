import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    // https: true,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:4000/api",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import * as path from "path"; // Changed import syntax

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     https: {
//       key: path.resolve(__dirname, "./certs/server.key"),
//       cert: path.resolve(__dirname, "./certs/server.crt"),
//     },
//   },
// });
