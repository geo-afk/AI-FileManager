export function updateClickedSVG() {
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

      console.log(sortBy)

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
