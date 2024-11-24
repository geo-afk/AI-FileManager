import os from 'os'
import mime from 'mime-types' // Use the 'mime-types' module to determine the MIME type of a file
import path from 'path'
import execSync from 'child_process'
import { fileURLToPath } from 'node:url'
import fs, { promises as fsPromises } from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'

// Custom APIs for renderer
const api = {}

// Example API method to get the current time
api.__dirname = path.join(import.meta.dirname, '..', '..')

api.checkLocal = (resourcePath) => {
  return fs.existsSync(resourcePath)
}

api.open = async (filePath, mode) => {
  return await fsPromises.open(filePath, mode)
}

api.readMagicNumber = async (filePath) => {
  return await ipcRenderer.invoke('get-magic-number', filePath)
}
api.retrieveThumbnail = async (filePath) => {
  return await ipcRenderer.invoke('get-thumbnail', filePath)
}

api.getSharedData = () => {
  return ipcRenderer.invoke('get-shared-data')
}
api.successConnection = (resourcePath, type) => {
  ipcRenderer.send('get-connection', resourcePath, type)
}

api.openFile = (filePath) => {
  ipcRenderer.send('open-file', filePath)
}

api.testNetworkShareUrl = async (url) => {
  return await ipcRenderer.invoke('check-network-share', url)
}

api.receiveDirPath = () => {
  let data = ''
  ipcRenderer.on('get-dir', (event, dirPath) => {
    data = dirPath
    console.log(dirPath)
  })
  console.log(data)
  return data
}

api.fileURLToPath = (url) => {
  return fileURLToPath(url)
}

api.formattedDate = (mtime) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(mtime)
}

api.GoogleAIFileManager = (apiKey) => {
  return new GoogleAIFileManager(apiKey)
}
api.GoogleGenerativeAI = (apiKey) => {
  return new GoogleGenerativeAI(apiKey)
}

api.mimeType = (extname) => {
  return mime.contentType(extname)
}

api.checkFileFolder = async (resourcePath) => {
  try {
    const stats = await fsPromises.stat(resourcePath)

    if (stats.isDirectory()) {
      return 'directory'
    } else if (stats.isFile()) {
      return 'file'
    }
  } catch (error) {
    console.error('Error checking file type:', error)
  }

  return 'unknown'
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
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
  readdirWithTypes: async (dirPath, withType) => await fsPromises.readdir(dirPath, withType),
  stat: async (filePath) => await fsPromises.stat(filePath),
  isFile: async (filePath) => (await fsPromises.stat(filePath)).isFile(),
  isDirectory: async (filePath) => (await fsPromises.stat(filePath)).isDirectory()
})

contextBridge.exposeInMainWorld('path', {
  join: (dirPath, file) => path.join(dirPath, file),
  basename: (filePath) => path.basename(filePath),
  resolve: (filePath) => path.resolve(filePath),
  extname: (filePath) => path.extname(filePath)
})

contextBridge.exposeInMainWorld('platform', {
  operatingSystem: () => os.platform()
})

contextBridge.exposeInMainWorld('execute', {
  execSync: (command, pipe) => execSync.execSync(command, pipe)
})
