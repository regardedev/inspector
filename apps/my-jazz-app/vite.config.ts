import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { jazzInspectorPlugin } from "@regarde/jazz-dev-tools";

export default defineConfig({
  plugins: [react(), jazzInspectorPlugin()],
});
