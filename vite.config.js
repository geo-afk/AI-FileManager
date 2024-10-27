import { defineConfig } from 'vite';

export default defineConfig({
    // add your Vite configurations here

    envDir: 'APP_',
    logLevel: 'silent',
    server: {
        port: 3000, // specify your desired port
        open: true, // opens the app in the default browser
    },
    // Add more configuration as needed

    preview: {
        port: 3000, // specify your desired port
        strictPort: true,

    }
});


