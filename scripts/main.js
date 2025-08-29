// File loading functionality with validation
document
  .getElementById('fileInput')
  .addEventListener('change', function (e) {
    const file = e
      .target
      .files[0];
    if (file) {
      // Validate file size (max 1MB)
      const maxSize = 1024 * 1024; // 1MB in bytes
      if (file.size > maxSize) {
        alert(`File too large! Maximum size is 1MB, but your file is ${(file.size / 1024 / 1024).toFixed(1)}MB. Please use a smaller file.`);
        e.target.value = ''; // Clear the file input
        return;
      }

      // Validate file type
      const allowedTypes = ['text/plain', 'text/markdown'];
      const allowedExtensions = ['.txt', '.md'];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      
      if (!allowedTypes.includes(file.type) && !hasValidExtension) {
        alert(`Unsupported file type! Please upload a .txt or .md file.\n\nYour file: ${file.name}`);
        e.target.value = ''; // Clear the file input
        return;
      }

      const reader = new FileReader();
      
      reader.onload = function (e) {
        const content = e.target.result;
        document
          .getElementById('markdownInput')
          .value = content;
        updateCharacterCounter(); // Update counter after loading
        convertMarkdown(); // Auto-convert after loading
      };
      
      reader.onerror = function () {
        alert(`Error reading file "${file.name}". Please try again or use a different file.`);
        e.target.value = ''; // Clear the file input
      };
      
      reader.readAsText(file);
    }
  });

// Character counter and auto-convert on input (with debouncing)
let convertTimeout;

function updateCharacterCounter() {
  const input = document.getElementById('markdownInput');
  const counter = document.getElementById('charCounter');
  const charCount = input.value.length;
  const performanceThreshold = 10000;
  
  counter.textContent = `${charCount.toLocaleString()} characters`;
  
  // Add warning class if over threshold
  if (charCount > performanceThreshold) {
    counter.classList.add('warning');
    counter.textContent += ' (large input - may be slow)';
  } else {
    counter.classList.remove('warning');
  }
}

document
  .getElementById('markdownInput')
  .addEventListener('input', function () {
    updateCharacterCounter();
    clearTimeout(convertTimeout);
    convertTimeout = setTimeout(convertMarkdown, 500);
  });

// Initial setup on page load
document.addEventListener('DOMContentLoaded', function () {
  // Initialize character counter
  updateCharacterCounter();
  // Initialize formatting toolbar
  if (typeof initializeFormattingToolbar === 'function') {
    initializeFormattingToolbar();
  }
  // Don't auto-convert placeholder, wait for user input
});