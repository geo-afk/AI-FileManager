// Import Material Icons
// Ensure to include Material Icons in your HTML: 
// <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

// Uncomment this line if you have environment variables set up in your project
// let env = import.meta.env;
// console.log(env);

// File data
const files = [
    { icon: 'description', name: 'Spreadsheet.xlsx', color: 'text-green-600', type: 'Excel', size: '1.2 MB' },
    { icon: 'image', name: 'Photo.jpg', color: 'text-blue-500', type: 'Image', size: '3.4 MB' },
    { icon: 'picture_as_pdf', name: 'Analytics.pdf', color: 'text-purple-600', type: 'PDF', size: '2.1 MB' },
    { icon: 'payment', name: 'Payment.pdf', color: 'text-gray-700', type: 'PDF', size: '0.8 MB' },
    { icon: 'folder', name: 'Documents', color: 'text-yellow-500', type: 'Folder', size: '-- MB' },
    { icon: 'code', name: 'script.js', color: 'text-blue-600', type: 'JavaScript', size: '0.2 MB' },
    { icon: 'bar_chart', name: 'Statistics.pdf', color: 'text-indigo-600', type: 'PDF', size: '1.7 MB' },
    { icon: 'video_library', name: 'Presentation.mp4', color: 'text-pink-500', type: 'Video', size: '15.8 MB' },
    { icon: 'article', name: 'Notes.txt', color: 'text-gray-600', type: 'Text', size: '0.1 MB' },
    { icon: 'security', name: 'Security.pdf', color: 'text-red-600', type: 'PDF', size: '1.9 MB' },
    { icon: 'music_note', name: 'Song.mp3', color: 'text-pink-500', type: 'Audio', size: '4.2 MB' },
    { icon: 'image', name: 'Graphics.png', color: 'text-blue-500', type: 'Image', size: '2.8 MB' }
];

// Function to create file elements
function createFileElement(file) {
    const div = document.createElement('div');
    div.className = 'p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer group';
    div.innerHTML = `
        <div class="flex flex-col items-center space-y-3 ">
            <div class="transform group-hover:scale-110 transition-transform duration-200">
                <span class="material-icons ${file.color} w-8 h-8">${file.icon}</span>
            </div>
            <span class="text-sm text-gray-600 text-center truncate w-full">
                ${file.name}
            </span>
        </div>
    `;

    // Add click event to update sidebar
    div.addEventListener('click', () => updateFileDetails(file));
    return div;
}

// Function to update file details in sidebar
function updateFileDetails(file) {
    const fileDetails = document.getElementById('fileDetails');
    const date = new Date().toLocaleDateString();
    fileDetails.innerHTML = `
        <p>Date Modified: ${date}</p>
        <p>File Name: ${file.name}</p>
        <p>File Type: ${file.type}</p>
        <p>File Size: ${file.size}</p>
    `;
}

// Function to handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchTerm)
    );
    renderFiles(filteredFiles);
}

// Function to render files
function renderFiles(filesToRender) {
    const fileGrid = document.getElementById('fileGrid');
    fileGrid.innerHTML = '';
    filesToRender.forEach(file => {
        fileGrid.appendChild(createFileElement(file));
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial render
    renderFiles(files);

    // Setup search handler
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
});
