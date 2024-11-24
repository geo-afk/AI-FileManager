import { execSync } from 'child_process'
import os from 'os'

export class NetworkShare {
  constructor(sharePath, username = null, password = null, domain = null) {
    this.sharePath = sharePath
    this.username = username
    this.password = password
    this.domain = domain
    this.platform = os.platform()
  }

  isConnected() {
    try {
      switch (this.platform) {
        case 'win32':
          return this._checkWindows()
        case 'linux':
          return this._checkLinux()
        case 'darwin':
          return this._checkMacOS()
        default:
          throw new Error(`Unsupported platform: ${this.platform}`)
      }
    } catch (error) {
      return false
    }
  }

  _checkWindows() {
    const credentials =
      this.username && this.password
        ? `/user:${this.domain ? `${this.domain}\\` : ''}${this.username} ${this.password}`
        : ''
    execSync(`net use "${this.sharePath}" ${credentials}`, { stdio: 'pipe' })
    return true
  }

  _checkLinux() {
    const credentials =
      this.username && this.password
        ? `-o username=${this.username},password=${this.password}${this.domain ? `,domain=${this.domain}` : ''}`
        : ''
    execSync(`sudo mount -t cifs "${this.sharePath}" /mnt/tmp ${credentials} -o vers=3.0`, {
      stdio: 'pipe'
    })
    execSync('sudo umount /mnt/tmp', { stdio: 'pipe' }) // Clean up after test
    return true
  }

  _checkMacOS() {
    const credentials =
      this.username && this.password
        ? `-o user=${this.username},password=${this.password}${this.domain ? `,domain=${this.domain}` : ''}`
        : ''
    execSync(`mount -t smbfs "${this.sharePath}" /Volumes/tmp ${credentials}`, { stdio: 'pipe' })
    execSync('umount /Volumes/tmp', { stdio: 'pipe' }) // Clean up after test
    return true
  }
}
