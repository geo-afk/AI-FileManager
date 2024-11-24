import { join } from 'path'
import { setupIpcHandlers } from './ipcHandlers'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, Menu, screen } from 'electron'

let mainWindowInstance = null
const WINDOW_WIDTH_MAIN = 0.5
const WINDOW_HEIGHT_MAIN = 0.4
const WINDOW_WIDTH_CREATE = 0.8
const WINDOW_HEIGHT_CREATE = 0.8

function createBrowserWindow(widthFactor, heightFactor, preloadFile) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  return new BrowserWindow({
    width: Math.round(width * widthFactor),
    height: Math.round(height * heightFactor),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, preloadFile),
      sandbox: false
    },
    icon: join(__dirname, '..', '../resources/logo.ico')
  })
}

function mainWindow() {
  mainWindowInstance = createBrowserWindow(
    WINDOW_WIDTH_MAIN,
    WINDOW_HEIGHT_MAIN,
    '../preload/preload.mjs'
  )

  // Setup IPC handlers
  setupIpcHandlers(mainWindowInstance, createWindow) // Initialize handlers

  mainWindowInstance.on('ready-to-show', () => {
    mainWindowInstance.show()
  })

  mainWindowInstance.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const loadURL =
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? process.env['ELECTRON_RENDERER_URL']
      : join(__dirname, '..', '../src/renderer/index.html')

  mainWindowInstance.loadURL(loadURL).catch((err) => console.error('Failed to load URL:', err))

  Menu.setApplicationMenu(null)
}

function createWindow() {
  const createWindowInstance = createBrowserWindow(
    WINDOW_WIDTH_CREATE,
    WINDOW_HEIGHT_CREATE,
    '../preload/preload.mjs'
  )

  createWindowInstance.on('ready-to-show', () => {
    if (mainWindowInstance && !mainWindowInstance.isDestroyed()) {
      mainWindowInstance.close()
    }
    createWindowInstance.show()
  })

  createWindowInstance.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // const loadURL =
  //   is.dev && process.env['ELECTRON_RENDERER_URL']
  //     ? process.env['ELECTRON_RENDERER_URL']
  //     : join(__dirname, '..', '../src/renderer/main.html')

  const loadFile = join(__dirname, '..', '../src/renderer/main.html')

  createWindowInstance.loadFile(loadFile).catch((err) => console.error('Failed to load URL:', err))

  Menu.setApplicationMenu(null)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  mainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
