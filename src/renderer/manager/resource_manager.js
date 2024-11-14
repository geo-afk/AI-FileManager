function mergeSort(arr, property) {
  if (arr.length <= 1) return arr

  const mid = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid)
  const right = arr.slice(mid)

  return merge(mergeSort(left, property), mergeSort(right, property), property)
}

function merge(left, right, property) {
  let result = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex][property] < right[rightIndex][property]) {
      result.push(left[leftIndex])
      leftIndex++
    } else {
      result.push(right[rightIndex])
      rightIndex++
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

// Search function
function searchByProperty(arr, property, searchValue) {
  return arr.filter((item) => {
    const itemValue = item[property].toString().toLowerCase()
    const searchTerm = searchValue.toString().toLowerCase()
    return itemValue.includes(searchTerm)
  })
}

// Object Manager class
export class ObjectManager {
  constructor() {
    this.objects = []
  }

  addObject(resources) {
    this.objects = this.objects.concat(resources)
  }

  sortObjects(property) {
    this.objects = mergeSort(this.objects, property)
  }

  searchObjects(property, value) {
    console.log(property)
    console.log(value)

    return searchByProperty(this.objects, property, value)
  }

  getAllObjects() {
    return this.objects
  }
}
