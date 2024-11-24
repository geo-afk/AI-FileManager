/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import path from 'path'
import mime from 'mime-types'
import execSync from 'child_process'
import { fileURLToPath } from 'node:url'
import fs, { promises as fsPromises } from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/server'

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)
const fileManager = new GoogleAIFileManager(apiKey)

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path
  })
  const file = uploadResult.file
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`)
  return file
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files) {
  console.log('Waiting for file processing...')
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name)
    while (file.state === 'PROCESSING') {
      process.stdout.write('.')
      await new Promise((resolve) => setTimeout(resolve, 10_000))
      file = await fileManager.getFile(name)
    }
    if (file.state !== 'ACTIVE') {
      throw Error(`File ${file.name} failed to process`)
    }
  }
  console.log('...all files ready\n')
}

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'
})

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain'
}

export async function summarize(filePath) {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [await uploadToGemini(filePath, mime.contentType(path.extname(filePath)))]

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files)

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          {
            fileData: {
              mimeType: files[0].mimeType,
              fileUri: files[0].uri
            }
          }
        ]
      }
    ]
  })

  const result = await chatSession.sendMessage(
    'give a summary of what the file contains as a paragraph'
  )
  console.log(result.response.text())
  return result.response.text()
}
