import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';

export default defineConfig({
  plugins: [
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.js', // Change to .js if you are using the converted main file
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead of `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.js'), // Change to .js if you are using the converted preload file
      },
      // Polyfill the Electron and Node.js API for Renderer process.
      // If you want to use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
  preview: {
    port: 3000, // Specify your desired port
    strictPort: true,
  },
});
