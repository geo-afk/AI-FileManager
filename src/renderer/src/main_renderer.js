import { setData } from './typeUrl'

// Variables to store state
let selectedStorage = null

// DOM Elements
const modal = document.getElementById('connectionModal')
const modalTitle = document.getElementById('modalTitle')
const connectionInput = document.getElementById('connectionUrl')
const alertBox = document.getElementById('alert')
const testConnectionBtn = document.getElementById('testConnection')
const cancelBtn = document.getElementById('cancelBtn')
const closeBtn = document.querySelector('.close-btn')

// Add click handlers for storage options
document.querySelectorAll('.storage-option').forEach((button) => {
  button.addEventListener('click', () => {
    selectedStorage = button.dataset.storage

    modalTitle.textContent = `Configure ${button.querySelector('span').textContent}`
    modal.classList.remove('opacity-0', 'pointer-events-none') // Show modal
    modal.classList.add('opacity-100', 'pointer-events-auto') // Enable interactions
    resetForm()
  })
})

// Close modal handlers
;[closeBtn, cancelBtn].forEach((btn) => {
  btn.addEventListener('click', () => {
    modal.classList.remove('opacity-100', 'pointer-events-auto') // Hide modal
    modal.classList.add('opacity-0', 'pointer-events-none') // Disable interactions
    resetForm()
  })
})

// Test connection handler
testConnectionBtn.addEventListener('click', async () => {
  const url = connectionInput.value.trim()
  if (!url) return

  testConnectionBtn.disabled = true
  testConnectionBtn.textContent = 'Testing...'

  try {
    // Simulate connection test - replace with actual electron IPC call
    const result = await testStorageConnection(url, selectedStorage)

    if (result) {
      showAlert('success', 'Connection successful! Saving configuration...')
      // Wait for the 1-second timeout before hiding the modal and resetting the form
      await new Promise((resolve) => setTimeout(resolve, 700))

      modal.classList.remove('opacity-100', 'pointer-events-auto') // Hide modal
      modal.classList.add('opacity-0', 'pointer-events-none') // Disable interactions

      await window.api.successConnection(url, selectedStorage)
      resetForm()

      setData({ url, selectedStorage })
    }

    resetForm()
  } catch (error) {
    showAlert('error', 'Connection failed. Please check your URL and try again.')
    testConnectionBtn.disabled = false
    testConnectionBtn.textContent = 'Test Connection'
  }
})

// Helper functions
function resetForm() {
  connectionInput.value = ''
  alertBox.className = 'alert'
  alertBox.textContent = ''
  testConnectionBtn.disabled = false
  testConnectionBtn.textContent = 'Test Connection'
}

function showAlert(type, message) {
  alertBox.className = `alert ${type}`
  alertBox.textContent = message
}

// Simulate connection test - replace with actual electron IPC implementation
async function testStorageConnection(url, type) {
  if (type == 'local') {
    return window.api.checkLocal(url)
  }
  if (type == 'network') {
    return window.api.testNetworkShareUrl(url)
  }
}
