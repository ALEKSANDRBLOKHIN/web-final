import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://library-alex-g0anesc6ckaxh3hy.francecentral-01.azurewebsites.net",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
