import { retrieveFileType } from './magicNumber.js'
import { iconMappings } from './material_icon_mapping.js'
import { Resource } from './resource.js'

const dirPath = 'C:\\Users\\KoolAid\\Downloads\\Linear Algebra'

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
    return fileType
  } catch (error) {
    console.error(error)
  }

  return 'unknown'
}

async function getType(filePath) {
  if (window.FileSystem.isFile(filePath)) {
    return (await getFileType(filePath)).toLowerCase()
  } else if (window.FileSystem.isDirectory(filePath)) {
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

  return 1
}

export async function getResources() {
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

      const resource = new Resource(fileName, lastModified, filePath, type, sizeInMB, icon)

      resources.push(resource)
    } catch (error) {
      console.error(error)
    }
  }

  return resources
}
