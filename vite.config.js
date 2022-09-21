import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "node:path";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";
import { version } from "./package.json";
import Components from "unplugin-vue-components/vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      port: 3000,
    },
    plugins: [
      vue(),
      Components({ dirs: ["src/component"], extensions: ["vue"], deep: true }),
      svgLoader(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: env.VITE_APP_NAME,
          short_name: env.VITE_APP_NAME,
          description:
            "Simple and secure password manager. Works client-side only with no backend. Uses encrypted file import/export. Helps to keep your passwords to yourself.",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: `${env.VITE_APP_NAME} v${version}`,
          },
        },
        minify: true,
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "/src"),
      },
    },
  };
});
