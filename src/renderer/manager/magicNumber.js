import data from './magic_numbers.json' assert { type: 'json' }

function flattenObject(obj, result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects without concatenating parent keys
      flattenObject(value, result)
    } else {
      // Use only the current key without any parent prefix
      result[key] = value
    }
  }
  return result
}

export function retrieveFileType(hex) {
  const flattenedJson = flattenObject(data)

  let found = false

  let keys = Object.keys(flattenedJson)

  for (let key of keys) {
    if (key.startsWith(hex)) {
      found = true
    }
  }

  if (found) {
    return flattenedJson[hex]
  }

  return ''
}
