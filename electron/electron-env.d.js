// Reference types are not needed in JavaScript

// Simulate the NodeJS global namespace and process.env
const process = {
  env: {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: '',
    /** /dist/ or /public/ */
    VITE_PUBLIC: ''
  }
};

// Used in Renderer process, expose in `preload.js`
const window = {
  ipcRenderer: require('electron').ipcRenderer
};

export { process, window };
