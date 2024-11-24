// shared-data.js
let data = {}

export function getData() {
  return data
}

export function setData(newData) {
  data = { ...newData } // Create a new object copy
}
