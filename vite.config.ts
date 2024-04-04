import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ include: ["lib"], exclude: "**/*.test.ts", rollupTypes: true }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      fileName: "use-state-values",
      name: "useStateValues",
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
    },
  },
});
