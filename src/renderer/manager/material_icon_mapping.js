// Material Icon mapping for supported file formats
export const iconMappings = {
  // Images
  JPEG: { icon: 'image', color: 'text-blue-500' },
  'JPEG/JFIF': { icon: 'image', color: 'text-blue-500' },
  'JPEG/JP2': { icon: 'image', color: 'text-blue-500' },
  'JPEG/EXIF': { icon: 'image', color: 'text-blue-500' },
  'JPEG/SPIFF': { icon: 'image', color: 'text-blue-500' },
  'JPEG/JTIF': { icon: 'image', color: 'text-blue-500' },
  PNG: { icon: 'image', color: 'text-blue-500' },
  GIF: { icon: 'image', color: 'text-blue-500' },
  BMP: { icon: 'image', color: 'text-blue-500' },
  WebP: { icon: 'image', color: 'text-blue-500' },
  TIFF: { icon: 'image', color: 'text-blue-500' },
  PSD: { icon: 'brush', color: 'text-purple-500' },
  SWF: { icon: 'animation', color: 'text-orange-500' },
  ICO: { icon: 'image', color: 'text-blue-500' },
  ICNS: { icon: 'image', color: 'text-blue-500' },
  JXR: { icon: 'image', color: 'text-blue-500' },
  IFF: { icon: 'image', color: 'text-blue-500' },
  EMF: { icon: 'image', color: 'text-blue-500' }, // Added for EMF files

  // Archives
  ZIP: { icon: 'archive', color: 'text-gray-700' },
  'ZIP (empty)': { icon: 'archive', color: 'text-gray-700' },
  'ZIP (spanned)': { icon: 'archive', color: 'text-gray-700' },
  RAR: { icon: 'archive', color: 'text-gray-700' },
  'RAR 5.0+': { icon: 'archive', color: 'text-gray-700' },
  '7Z': { icon: 'archive', color: 'text-gray-700' },
  TAR: { icon: 'archive', color: 'text-gray-700' },
  GZIP: { icon: 'archive', color: 'text-gray-700' },
  BZIP2: { icon: 'archive', color: 'text-gray-700' },
  COMPRESS: { icon: 'archive', color: 'text-gray-700' },
  XZ: { icon: 'archive', color: 'text-gray-700' },
  LZ4: { icon: 'archive', color: 'text-gray-700' },
  STUFFIT: { icon: 'archive', color: 'text-gray-700' },

  // Audio
  MP3: { icon: 'music_note', color: 'text-pink-500' },
  WAV: { icon: 'music_note', color: 'text-pink-500' },
  FLAC: { icon: 'music_note', color: 'text-pink-500' },
  'MP3 with ID3': { icon: 'music_note', color: 'text-pink-500' },
  M4A: { icon: 'music_note', color: 'text-pink-500' },
  OGG: { icon: 'music_note', color: 'text-pink-500' },
  MIDI: { icon: 'music_note', color: 'text-pink-500' },
  AU: { icon: 'music_note', color: 'text-pink-500' },
  RA: { icon: 'music_note', color: 'text-pink-500' },
  AMR: { icon: 'music_note', color: 'text-pink-500' },
  MID: { icon: 'music_note', color: 'text-pink-500' },
  AIFF: { icon: 'music_note', color: 'text-pink-500' },

  // Video
  MP4: { icon: 'video_library', color: 'text-purple-500' },
  AVI: { icon: 'movie', color: 'text-purple -500' },
  MOV: { icon: 'movie', color: 'text-purple-500' },
  MKV: { icon: 'video_library', color: 'text-purple-500' },
  FLV: { icon: 'video_library', color: 'text-purple-500' },
  'MPEG Transport Stream': { icon: 'movie', color: 'text-purple-500' },
  'MPEG Program Stream': { icon: 'movie', color: 'text-purple-500' },
  WMV: { icon: 'video_library', color: 'text-purple-500' },
  DIVX: { icon: 'video_library', color: 'text-purple-500' },
  WEBM: { icon: 'video_library', color: 'text-purple-500' },

  // Documents
  PDF: { icon: 'picture_as_pdf', color: 'text-red-600' },
  'MS Office Legacy': { icon: 'description', color: 'text-blue-600' },
  'MS Office Modern': { icon: 'description', color: 'text-blue-600' },
  'OpenDocument Format': { icon: 'description', color: 'text-blue-600' },
  RTF: { icon: 'description', color: 'text-gray-600' },
  'UTF-8 Text with BOM': { icon: 'article', color: 'text-gray-600' },
  'UTF-16 Text with BOM': { icon: 'article', color: 'text-gray-600' },
  'UTF-32 Text with BOM': { icon: 'article', color: 'text-gray-600' },
  EPS: { icon: 'article', color: 'text-gray-600' },

  // Executables
  EXE: { icon: 'code', color: 'text-green-700' },
  'Mach-O (32-bit)': { icon: 'code', color: 'text-green-700' },
  'Mach-O (64-bit)': { icon: 'code', color: 'text-green-700' },
  'Java Class File': { icon: 'code', color: 'text-green-700' },
  'Linux deb Package': { icon: 'code', color: 'text-green-700' },
  'Unix Executable': { icon: 'code', color: 'text-green-700' },
  JAR: { icon: 'code', color: 'text-green-700' },

  // Databases
  SQLite: { icon: 'database', color: 'text-brown-500' },
  MySQL: { icon: 'database', color: 'text-brown-500' },
  'Microsoft Access': { icon: 'database', color: 'text-brown-500' },
  'Microsoft SQL Server': { icon: 'database', color: 'text-brown-500' },
  'Redis RDB': { icon: 'database', color: 'text-brown-500' },

  // Fonts
  'TrueType Font': { icon: 'text_fields', color: 'text-teal-600' },
  'OpenType Font': { icon: 'text_fields', color: 'text-teal-600' },
  'Apple TrueType Font': { icon: 'text_fields', color: 'text-teal-600' },
  WOFF: { icon: 'text_fields', color: 'text-teal-600' },
  WOFF2: { icon: 'text_fields', color: 'text-teal-600' },

  // Disk Images
  DMG: { icon: 'disc_full', color: 'text-gray-500' },
  ISO: { icon: 'disc_full', color: 'text-gray-500' },
  'Apple Disk Image': { icon: 'disc_full', color: 'text-gray-500' },
  VMDK: { icon: 'disc_full', color: 'text-gray-500' },
  VDI: { icon: 'disc_full', color: 'text-gray-500' },
  VHD: { icon: 'disc_full', color: 'text-gray-500' },

  // Cryptocurrency Wallets
  'Bitcoin Private Key': { icon: 'account_balance_wallet', color: 'text-yellow-500' },
  'Bitcoin Public Key': { icon: 'account_balance_wallet', color: 'text-yellow-500' },
  'Ethereum Wallet': { icon: 'account_balance_wallet', color: 'text-yellow-500' },

  // 3D Models
  'Quicktime 3D': { icon: '3d_rotation', color: 'text-blue-500' },
  '3DS Max': { icon: '3d_rotation', color: 'text-blue-500' },
  'Unity3 D Asset': { icon: '3d_rotation', color: 'text-blue-500' },
  Blender: { icon: '3d_rotation', color: 'text-blue-500' },
  glTF: { icon: '3d_rotation', color: 'text-blue-500' },
  OBJ: { icon: '3d_rotation', color: 'text-blue-500' },

  // Certificates
  'X.509 Certificate': { icon: 'security', color: 'text-red-600' },
  'RSA Public Key': { icon: 'security', color: 'text-red-600' },
  'PEM Certificate': { icon: 'security', color: 'text-red-600' },

  // Directory
  Directory: { icon: 'folder', color: 'text-yellow-500' },

  // Unknown types
  Unknown: { icon: 'help', color: 'text-gray-500' }
}
