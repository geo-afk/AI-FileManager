import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { fileTypeFromFile } from 'file-type'
import { pdfToPng } from 'pdf-to-png-converter'

export class ThumbnailGenerator {
  constructor(options = {}) {
    this.thumbnailSize = options.size || 200
    this.outputFormat = options.format || 'jpeg'
    this.outputQuality = options.quality || 80
    this.tempDir = options.tempDir || './temp'

    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  async generateThumbnail(filePath) {
    try {
      const fileType = await fileTypeFromFile(filePath)
      if (!fileType) {
        throw new Error('Unable to determine file type')
      }

      const type = fileType.mime.split('/')[0]
      const ext = fileType.ext

      const thumbnailPath = path.join(
        this.tempDir,
        `${path.basename(filePath, path.extname(filePath))}_thumb.${this.outputFormat}`
      )

      switch (type) {
        case 'image':
          await this.handleImage(filePath, thumbnailPath)
          break

        case 'video':
          await this.handleVideo(filePath, thumbnailPath)
          break

        case 'application':
          if (ext === 'pdf') {
            await this.handlePDF(filePath, thumbnailPath)
          } else {
            await this.generateIconThumbnail(ext, thumbnailPath)
          }
          break

        default:
          await this.generateIconThumbnail(ext, thumbnailPath)
      }

      return thumbnailPath
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      throw error
    }
  }

  async handleImage(filePath, outputPath) {
    try {
      await sharp(filePath)
        .resize(this.thumbnailSize, this.thumbnailSize, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .toFormat(this.outputFormat, { quality: this.outputQuality })
        .toFile(outputPath)
    } catch (error) {
      console.error('Error generating image thumbnail:', error)
      throw error
    }
  }

  async handleVideo(filePath, outputPath) {
    try {
      const videoDuration = await this.getVideoDuration(filePath)

      // Generate a random timestamp between 0 and video duration
      const randomTimestamp = Math.floor(Math.random() * videoDuration)

      // Convert the random timestamp to a proper time format (HH:MM:SS)
      const hours = Math.floor(randomTimestamp / 3600)
      const minutes = Math.floor((randomTimestamp % 3600) / 60)
      const seconds = randomTimestamp % 60
      const randomTimestampFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

      return new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .screenshots({
            timestamps: [randomTimestampFormatted], // Capture at random timestamp
            filename: path.basename(outputPath),
            folder: path.dirname(outputPath),
            size: `${this.thumbnailSize}x${this.thumbnailSize}`
          })
          .on('end', () => {
            resolve(outputPath)
          })
          .on('error', (err) => {
            console.error('FFmpeg error generating video thumbnail:', err)
            reject(err)
          })
      })
    } catch (error) {
      console.error('Error generating video thumbnail:', error)
      throw error
    }
  }

  async getVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(new Error(`Error retrieving video duration: ${err.message}`))
        } else {
          resolve(metadata.format.duration)
        }
      })
    })
  }

  async handlePDF(filePath, outputPath) {
    try {
      const pngPages = await pdfToPng(filePath, {
        outputFolder: path.dirname(outputPath),
        pagesToProcess: [1] // Only process the first page
      })

      if (pngPages.length === 0) {
        throw new Error('PDF conversion failed or no pages to process')
      }

      const inputImagePath = pngPages[0].path // Assuming the first page is the one we want
      const resizedPath = path.join(
        path.dirname(outputPath),
        `${path.basename(outputPath, path.extname(outputPath))}.${this.outputFormat}`
      )

      await sharp(inputImagePath)
        .resize(this.thumbnailSize, this.thumbnailSize)
        .toFormat(this.outputFormat, { quality: this.outputQuality })
        .toFile(resizedPath)

      // Clean up temporary PNG file
      fs.unlinkSync(inputImagePath)

      return resizedPath
    } catch (error) {
      console.error('Error generating PDF thumbnail:', error)
      throw error
    }
  }

  async generateIconThumbnail(ext, outputPath) {
    // Placeholder function to handle icon generation for unsupported file types
    console.log(outputPath)

    const iconPath = path.join(this.tempDir, `${ext}_icon.${this.outputFormat}`)

    // Assuming some default logic to generate an icon (e.g., using a base image or a library)
    await sharp('path_to_default_icon.png')
      .resize(this.thumbnailSize, this.thumbnailSize)
      .toFormat(this.outputFormat, { quality: this.outputQuality })
      .toFile(iconPath)

    return iconPath
  }
}
