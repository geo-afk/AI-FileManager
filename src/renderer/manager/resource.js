export class Resource {
  constructor(fileName, dateModified, path, type, size, icon, content) {
    this.fileName = fileName
    this.dateModified = dateModified
    this.type = type
    this.size = size
    this.path = path
    this.icon = icon
    this.content = content
  }
}
