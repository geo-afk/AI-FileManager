import { ObjectManager } from '../manager/resource_manager.js'
import { getResources } from '../manager/loadLocalFiles.js'
import { NetworkShare } from '../manager/network_share.js'

const fileName = document.getElementById('fileName')
const fileType = document.getElementById('fileType')
const fileSize = document.getElementById('fileSize')
const fileOpen = document.getElementById('openFile')
const thumbnail = document.getElementById('thumbnail-container')
const dropdownMenu = document.getElementById('dropdownMenu')
const dateModified = document.getElementById('dateModified')
const fileSummarize = document.getElementById('summarizeFile')
const dropdownButton = document.getElementById('dropdownButton')

// Show dropdown menu on button click
dropdownButton.addEventListener('click', function (event) {
  event.stopPropagation() // Prevent the click event from bubbling up
  dropdownMenu.classList.toggle('hidden')
})

// Hide dropdown menu when clicking outside of it
document.addEventListener('click', () => {
  if (!dropdownMenu.classList.contains('hidden')) {
    dropdownMenu.classList.add('hidden')
  }
})

// Prevent the dropdown menu from closing when clicking inside it
dropdownMenu.addEventListener('click', function (event) {
  event.stopPropagation()
  /* Prevent the click event from bubbling up, when click will prevent any other
       even to be emitted as when you call an event the parent and grandparent are
       also called, so the call ends after the child event
    */
})

// Hide context menu when clicking outside
document.addEventListener('click', (event) => {
  const contextMenu = document.getElementById('contextMenu')
  if (!contextMenu.contains(event.target)) {
    contextMenu.classList.add('hidden')
  }
})

fileOpen.addEventListener('click', () => {
  const currentFile = window.currentFile

  window.api.openFile(currentFile.path)
  document.getElementById('contextMenu').classList.add('hidden')
})

fileSummarize.addEventListener('click', () => {
  alert(`Summarizing file: ${window.currentFile.name}`)
  document.getElementById('contextMenu').classList.add('hidden')
})

// Function to create the file element with a right-click context menu
function createFileElement(resource) {
  const div = document.createElement('div')
  div.className =
    'p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group'
  div.innerHTML = `
    <div class="flex flex-col items-center space-y-3">
      <div class="transform scale-150 group-hover:scale-125 transition-transform duration-200">
        <span class="material-icons ${resource.icon.color} text-5xl">${resource.icon.icon}</span>
      </div>
      <span class="text-sm text-gray-600 text-center truncate w-full">
        ${resource.fileName}
      </span>
    </div>
  `

  // Add click event to update sidebar to show metadata
  div.addEventListener('click', (event) => updateFileDetails(resource, event))

  // Right-click event listener
  div.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    showContextMenu(event, resource)
  })

  return div
}

// Function to update file details in sidebar
async function updateFileDetails(resource, event) {
  dateModified.textContent = `Date Modified: ${resource.dateModified}`
  fileName.textContent = `File Name: ${resource.fileName}`
  fileType.textContent = `File Type: ${resource.type}`
  fileSize.textContent = `File Size: ${resource.size} mb`

  // Remove the previous image (if any)
  while (thumbnail.firstChild) {
    thumbnail.removeChild(thumbnail.firstChild)
  }

  const image = await window.api.retrieveThumbnail(resource.path)

  if (image) {
    // Create a new img element
    const img = document.createElement('img')

    img.src = image

    // Apply Tailwind classes for styling
    img.classList.add('w-full', 'h-auto', 'max-h-70', 'bg-gray-100', 'rounded-lg', 'object-cover')

    thumbnail.innerHTML = '' // Optionally clear existing content
    thumbnail.appendChild(img)
  }
}

// Show context menu
function showContextMenu(event, resource) {
  const contextMenu = document.getElementById('contextMenu')
  contextMenu.style.left = `${event.pageX}px`
  contextMenu.style.top = `${event.pageY}px`
  contextMenu.classList.remove('hidden')

  // Set the file details in the global variable to use in menu functions
  window.currentFile = resource
}

const manager = new ObjectManager()
async function loadResources(url) {
  const resources = await getResources(url)
  manager.addObject(resources)
}

// Function to handle search
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase()

  const resource = manager.searchObjects('fileName', searchTerm)

  renderFiles(resource)
}

// Function to render files
function renderFiles(filesToRender) {
  const fileGrid = document.getElementById('fileGrid')
  fileGrid.innerHTML = ''

  filesToRender.forEach((resource) => {
    fileGrid.appendChild(createFileElement(resource))
  })
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Wait for resources to be loaded before rendering

    const data = await window.api.getSharedData()

    const type = data.type
    const resourcePath = data.resourcePath

    if (type == 'local') {
      await loadResources(resourcePath)
    }

    if (type == 'network') {
      // const platform = window.platform.operatingSystem()

      const sharePath = resourcePath
      // const sharePath = '\\\\KOOLAID\\Saved Pictures'

      const share = new NetworkShare(sharePath)

      try {
        await share.connect()
        manager.addObject(await share.listFiles())
      } catch (error) {
        console.error('Error:', error.message)
      } finally {
        if (share.connected) {
          await share.disconnect()
        }
      }
    }

    renderFiles(manager.getAllObjects())
    handleSorting()

    // Setup search handler
    const searchInput = document.getElementById('searchInput')
    searchInput.addEventListener('input', handleSearch)

    // Setup directory path
    const directoryPath = document.getElementById('location-path')
    directoryPath.textContent = resourcePath
  } catch (error) {
    console.error('Error loading resources:', error)
  }
})

// Sort handler
function handleSorting() {
  const menuItems = document.querySelectorAll('.menu-item')

  // Define the SVG paths for checked and unchecked states
  const uncheckedSVGPath = 'M3 3h18v18H3z' // Path for an empty checkbox
  const checkedSVGPath = 'M3 3h18v18H3z' // Path for checkbox background
  const checkMarkPath = 'M6 12l4 4 8-8' // Path for check-mark

  menuItems.forEach((item) => {
    item.addEventListener('click', function (event) {
      event.preventDefault() // Prevent default anchor behavior

      // Check if the clicked item is already active
      const isActive = this.classList.contains('active')
      if (isActive) {
        return // Exit the function if item is already active
      }

      // Reset all items' active state and icons
      menuItems.forEach((i) => {
        i.classList.remove('active')
        const iconPaths = i.querySelectorAll('.icon > path')
        if (iconPaths.length > 0) {
          iconPaths[0].setAttribute('d', uncheckedSVGPath)
          iconPaths[0].setAttribute('fill', 'none')

          // Remove check mark if it exists
          if (iconPaths[1]) {
            iconPaths[1].remove()
          }
        }
      })

      // Set the clicked item as active
      this.classList.add('active')

      // Get the data-name attribute and set property
      const sortBy = this.getAttribute('data-name')
      let property = ''

      switch (sortBy) {
        case 'type':
          property = 'type'
          break
        case 'name':
          property = 'fileName'
          break
        case 'date-modified':
          property = 'dateModified'
          break
      }

      manager.sortObjects(property)
      renderFiles(manager.getAllObjects())

      // Update the clicked item's icon to the checked state
      const clickedIconPaths = this.querySelectorAll('.icon > path')

      if (clickedIconPaths.length > 0) {
        // Update the background path for the checked state
        clickedIconPaths[0].setAttribute('d', checkedSVGPath)
        clickedIconPaths[0].setAttribute('fill', '#0078D4')

        // Create and append the check-mark path
        const checkmark = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        checkmark.setAttribute('d', checkMarkPath)
        checkmark.setAttribute('stroke-linecap', 'round')
        checkmark.setAttribute('stroke-linejoin', 'round')
        checkmark.setAttribute('stroke-width', '2')
        checkmark.setAttribute('stroke', '#ffffff')
        this.querySelector('.icon').appendChild(checkmark)
      }
    })
  })
}
