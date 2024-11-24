import os from 'os'
import { join } from 'path'
import fs from 'fs/promises'
import { NetworkShare } from './networkShareTest'
import { summarize } from './summarizer'
import { ThumbnailGenerator } from './thumbnail_generator'
import { ipcMain, nativeImage, shell, app } from 'electron'

let sharedData = {}
export function setupIpcHandlers(mainWindowInstance, createWindow) {
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
        return 'Could not read 4 bytes from the file'
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
  ipcMain.handle('get-summary', async (event, filePath) => {
    try {
      const summary = summarize(filePath)
      return summary
    } catch (error) {
      console.error(error)
      throw error // Re-throw to send the error back to the renderer
    }
  })

  ipcMain.handle('get-thumbnail', async (event, filePath) => {
    const options = {
      size: 192, // Thumbnail size (in pixels)
      format: 'jpeg', // Output format (jpeg, png, etc.)
      quality: 85, // Quality of the thumbnail (0-100)
      tempDir: './thumbnails' // Directory to save generated thumbnails
    }
    const generator = new ThumbnailGenerator(options)

    try {
      const thumbnailPath = await generator.generateThumbnail(filePath)

      const image = nativeImage.createFromPath(join(app.getAppPath(), thumbnailPath))
      return image.toDataURL() // Send the image as a data URL
    } catch (error) {
      console.error(error)
      throw error // Re-throw to send the error back to the renderer
    }
  })

  ipcMain.handle('check-network-share', async (event, url) => {
    // Convert the share path based on the platform
    if (os.platform() === 'win32') {
      // On Windows, use double backslashes for network shares (UNC path)
      url = url.replace(/\//g, '\\') // Replace forward slashes with backslashes
      if (!url.startsWith('\\\\')) {
        url = '\\\\' + url // Ensure the path starts with '\\server\share'
      }
    } else {
      // On other OS (e.g., macOS, Linux), use forward slashes
      url = url.replace(/\\/g, '/') // Replace backslashes with forward slashes
      if (!url.startsWith('//')) {
        url = '//' + url // Ensure the path starts with '//server/share'
      }
    }

    const sharePath = url
    const networkShare = new NetworkShare(sharePath)

    const isAvailable = networkShare.isConnected()

    return isAvailable
  })

  ipcMain.on('get-connection', (event, resourcePath, type) => {
    sharedData = { resourcePath, type }

    mainWindowInstance.webContents.send('data-from-main', sharedData)

    if (mainWindowInstance || mainWindowInstance.isAvailable()) {
      createWindow()
    }
    event.reply('connection-response', { resourcePath, type })
  })

  ipcMain.handle('get-shared-data', () => {
    return sharedData
  })
}
