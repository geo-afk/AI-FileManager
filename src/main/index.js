import { join } from 'path'
const fs = require('fs/promises')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, Menu, screen, ipcMain } from 'electron'

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: Math.round(width * 0.8), // 80% of screen width
    height: Math.round(height * 0.8), // 80% of screen height
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.mjs'),
      sandbox: false
    },

    icon: join(__dirname, '..', '../resources/logo.ico')
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  Menu.setApplicationMenu(null)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('open-file', (event, filePath) => {
  shell.openPath(filePath).then((error) => {
    if (error) {
      console.error('Failed to open file:', error)
    }
  })
})

ipcMain.handle('get-magic-number', async (event, filePath) => {
  let fileHandle
  try {
    // Open the file using the promises API
    fileHandle = await fs.open(filePath, 'r')

    // Create a buffer for reading
    const buffer = Buffer.alloc(4)

    // Read the first 4 bytes
    const { bytesRead } = await fileHandle.read(buffer, 0, 4, 0)

    // Check if we read the expected number of bytes
    if (bytesRead !== 4) {
      throw new Error('Could not read 4 bytes from the file')
    }

    // Convert to hex string
    const magicNumber = buffer.toString('hex').toUpperCase()
    return magicNumber
  } catch (error) {
    console.error(error)
    throw error // Re-throw to send the error back to the renderer
  } finally {
    // Make sure we always close the file handle
    if (fileHandle) {
      await fileHandle.close()
    }
  }
})
