import { retrieveFileType } from './magicNumber.js'
import { iconMappings } from './material_icon_mapping.js'
// import { summarize } from './summarizer.js'
import { Resource } from './resource.js'

async function getMagicNumber(filePath) {
  try {
    const magicNumber = await window.api.readMagicNumber(filePath)

    return magicNumber
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getFileType(filePath) {
  try {
    const magicNumber = await getMagicNumber(filePath)
    const fileType = retrieveFileType(magicNumber)

    if (!fileType) {
      return 'unknown'
    }

    return fileType
  } catch (error) {
    console.error(error)
  }

  return 'unknown'
}

async function getType(filePath) {
  const type = await window.api.checkFileFolder(filePath)

  if (type == 'file') {
    return (await getFileType(filePath)).toLowerCase()
  } else if (type == 'directory') {
    return 'directory'
  }

  return 'unknown'
}

const icons = Object.entries(iconMappings)

function getIcon(type) {
  if (type == 'unknown') {
    return { icon: 'help_outline', color: 'text-grey-400' }
  }

  for (const [key, value] of icons) {
    if (key.toLowerCase() === type) {
      return value
    }
  }

  return ''
}

export async function getResources(dirPath) {
  const directoryData = await window.FileSystem.readdir(dirPath)
  let resources = []

  for (const file of directoryData) {
    let filePath = window.path.join(dirPath, file)

    try {
      const stats = await window.FileSystem.stat(filePath)

      const fileName = window.path.basename(filePath)

      const lastModified = window.api.formattedDate(stats.mtime)

      const type = await getType(filePath)
      const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
      let icon = getIcon(type)

      if (type != 'directory') {
        const summary = await window.api.getSummary(filePath)
        console.log(summary)
      }

      const resource = new Resource(fileName, lastModified, filePath, type, sizeInMB, icon)

      resources.push(resource)
    } catch (error) {
      console.error(error)
    }
  }

  return resources
}
