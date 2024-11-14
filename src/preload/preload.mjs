import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { promises as fsPromises } from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('FileSystem', {
//   getMagicNumber: async (filePath) => {
//     return await ipcRenderer.invoke('get-magic-number', filePath)
//   }
//   // Other file system functions can be added here
// })

// Custom APIs for renderer
const api = {}

// Example API method to get the current time
api.__dirname = path.join(import.meta.dirname, '..', '..')

api.open = async (filePath, mode) => {
  return await fsPromises.open(filePath, mode)
}

api.readMagicNumber = async (filePath) => {
  return await ipcRenderer.invoke('get-magic-number', filePath)
}

api.openFile = (filePath) => {
  ipcRenderer.send('open-file', filePath)
}

api.fileURLToPath = (url) => {
  return fileURLToPath(url)
}

api.formattedDate = (mtime) => {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(mtime)

  return formattedDate
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

contextBridge.exposeInMainWorld('FileSystem', {
  writeFile: async (filePath, data) => await fsPromises.writeFile(filePath, data),
  readFile: async (filePath) => await fsPromises.readFile(filePath, 'utf8'),
  read: async (filePath) => await fsPromises.readFile(filePath, 'utf8'),
  open: async (filePath, mode) => await fsPromises.open(filePath, mode),
  readFileSync: (filePath) => fs.readFileSync(filePath, 'utf8'),
  readdir: async (dirPath) => await fsPromises.readdir(dirPath),
  stat: async (filePath) => await fsPromises.stat(filePath),
  isFile: async (filePath) => (await fsPromises.stat(filePath)).isFile(),
  isDirectory: async (filePath) => (await fsPromises.stat(filePath)).isDirectory()
})

contextBridge.exposeInMainWorld('path', {
  join: (dirPath, file) => path.join(dirPath, file),
  basename: (filePath) => path.basename(filePath),
  resolve: (filePath) => path.resolve(filePath)
})
