import { Resource } from './resource.js'
import { retrieveFileType } from './magicNumber.js'
import { iconMappings } from './material_icon_mapping.js'

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

  // if (window.FileSystem.isDirectory(filePath)) {
  //   console.log('directory')
  //   return 'directory'
  // } else if (window.FileSystem.isFile(filePath)) {
  // }

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

export class NetworkShare {
  constructor(sharePath, username = null, password = null, domain = null) {
    this.sharePath = sharePath
    this.username = username
    this.password = password
    this.domain = domain
    this.connected = false
    this.platform = window.platform.operatingSystem()
    this.mountPoint = null
  }

  async connect() {
    try {
      switch (this.platform) {
        case 'win32':
          await this._connectWindows()
          break
        case 'linux':
          await this._connectLinux()
          break
        case 'darwin':
          await this._connectMacOS()
          break
        default:
          throw new Error(`Unsupported platform: ${this.platform}`)
      }
      this.connected = true
    } catch (error) {
      throw new Error(`Failed to connect to network share: ${error.message}`)
    }
  }

  async disconnect() {
    try {
      switch (this.platform) {
        case 'win32':
          await this._disconnectWindows()
          break
        case 'linux':
          await this._disconnectLinux()
          break
        case 'darwin':
          await this._disconnectMacOS()
          break
        default:
          throw new Error(`Unsupported platform: ${this.platform}`)
      }
      this.connected = false
    } catch (error) {
      throw new Error(`Failed to disconnect from network share: ${error.message}`)
    }
  }

  async _connectWindows() {
    const credentials =
      this.username && this.password
        ? `/user:${this.domain ? `${this.domain}\\` : ''}${this.username} ${this.password}`
        : ''
    window.execute.execSync(`net use "${this.sharePath}" ${credentials}`, { stdio: 'pipe' })
  }

  async _connectLinux() {
    const mountPoint = window.path.join('/mnt', window.path.basename(this.sharePath))
    window.execute.execSync(`sudo mkdir -p "${mountPoint}"`, { stdio: 'pipe' })

    let credentials = ''
    if (this.username && this.password) {
      credentials = `-o username=${this.username},password=${this.password}`
      if (this.domain) {
        credentials += `,domain=${this.domain}`
      }
    }

    window.execute.execSync(
      `sudo mount -t cifs "${this.sharePath}" "${mountPoint}" ${credentials} -o vers=3.0`,
      {
        stdio: 'pipe'
      }
    )
    this.mountPoint = mountPoint
  }

  async _connectMacOS() {
    const mountPoint = window.path.join('/Volumes', window.path.basename(this.sharePath))
    window.execute.execSync(`mkdir -p "${mountPoint}"`, { stdio: 'pipe' })

    let credentials = ''
    if (this.username && this.password) {
      credentials = `-o user=${this.username},password=${this.password}`
      if (this.domain) {
        credentials += `,domain=${this.domain}`
      }
    }

    window.execute.execSync(`mount -t smbfs "${this.sharePath}" "${mountPoint}" ${credentials}`, {
      stdio: 'pipe'
    })
    this.mountPoint = mountPoint
  }

  async _disconnectWindows() {
    window.execute.execSync(`net use "${this.sharePath}" /delete`, { stdio: 'pipe' })
  }

  async _disconnectLinux() {
    window.execute.execSync(`sudo umount "${this.mountPoint}"`, { stdio: 'pipe' })
    window.execute.execSync(`sudo rm -rf "${this.mountPoint}"`, { stdio: 'pipe' })
  }

  async _disconnectMacOS() {
    window.execute.execSync(`umount "${this.mountPoint}"`, { stdio: 'pipe' })
    window.execute.execSync(`rm -rf "${this.mountPoint}"`, { stdio: 'pipe' })
  }

  async listFiles(directory = '') {
    let resources = []
    try {
      const targetPath =
        this.platform === 'win32'
          ? window.path.join(this.sharePath, directory)
          : window.path.join(this.mountPoint, directory)

      const directoryData = await window.FileSystem.readdir(targetPath)

      for (const file of directoryData) {
        let filePath = window.path.join(targetPath, file)

        const stats = await window.FileSystem.stat(filePath)

        const fileName = window.path.basename(filePath)

        const lastModified = window.api.formattedDate(stats.mtime)

        const type = await getType(filePath)
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2)
        let icon = getIcon(type)

        const resource = new Resource(fileName, lastModified, filePath, type, sizeInMB, icon)

        resources.push(resource)
      }

      return resources
    } catch (error) {
      throw new Error(`Failed to list files: ${error.message}`)
    }
  }
}
