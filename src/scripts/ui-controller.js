function copyOutput() {
  const output = document.getElementById('output');
  const text = output.textContent;

  if (!text || text === 'Your converted text will appear here...') {
    alert('Nothing to copy! Please convert some markdown first.');
    return;
  }

  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator
      .clipboard
      .writeText(text)
      .then(() => {
        showCopySuccess();
      })
      .catch((error) => {
        console.warn('Modern clipboard API failed:', error);
        tryFallbackCopy(text);
      });
  } else {
    // Browser doesn't support modern clipboard API
    tryFallbackCopy(text);
  }

  function showCopySuccess() {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied! ✓';
    button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';

    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }

  function tryFallbackCopy(text) {
    try {
      // Fallback method using execCommand
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showCopySuccess();
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      console.error('All copy methods failed:', error);
      showCopyError();
    }
  }

  function showCopyError() {
    const button = event.target;
    const originalText = button.textContent;
    
    // Show error state on button
    button.textContent = 'Copy Failed!';
    button.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
    
    // Show helpful error message
    alert(
      'Unable to copy to clipboard automatically.\n\n' +
      'Please:\n' +
      '1. Select all the text in the output area\n' +
      '2. Copy it manually with Ctrl+C (or Cmd+C on Mac)\n\n' +
      'This may happen due to browser security restrictions.'
    );
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 3000);
  }
}

function clearAll() {
  document
    .getElementById('markdownInput')
    .value = '';
  document
    .getElementById('output')
    .textContent = 'Your converted text will appear here...';
  // Update character counter after clearing
  if (typeof updateCharacterCounter === 'function') {
    updateCharacterCounter();
  }
}

// Formatting toolbar functionality
function initializeFormattingToolbar() {
  const toolbarToggle = document.getElementById('toolbarToggle');
  const toolbarButtons = document.getElementById('toolbarButtons');
  const textarea = document.getElementById('markdownInput');

  // Toggle toolbar visibility
  toolbarToggle.addEventListener('click', function() {
    toolbarButtons.classList.toggle('show');
    const isVisible = toolbarButtons.classList.contains('show');
    toolbarToggle.textContent = isVisible ? '⚒️ Hide Formatting' : '⚒️ Formatting';
  });

  // Handle formatting button clicks
  document.querySelectorAll('.format-btn').forEach(button => {
    button.addEventListener('click', function() {
      const format = this.getAttribute('data-format');
      applyFormatting(format, textarea);
    });
  });
}

function applyFormatting(format, textarea) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const beforeText = textarea.value.substring(0, start);
  const afterText = textarea.value.substring(end);

  let formattedText = '';
  let cursorOffset = 0;

  switch (format) {
    case 'bold':
      formattedText = selectedText ? `**${selectedText}**` : '**bold text**';
      cursorOffset = selectedText ? 2 : 2; // Position cursor after opening **
      break;
    
    case 'italic':
      formattedText = selectedText ? `*${selectedText}*` : '*italic text*';
      cursorOffset = selectedText ? 1 : 1; // Position cursor after opening *
      break;
    
    case 'h1':
      formattedText = selectedText ? `# ${selectedText}` : '# Heading 1';
      cursorOffset = selectedText ? 2 : 2; // Position cursor after "# "
      break;
    
    case 'h2':
      formattedText = selectedText ? `## ${selectedText}` : '## Heading 2';
      cursorOffset = selectedText ? 3 : 3; // Position cursor after "## "
      break;
    
    case 'h3':
      formattedText = selectedText ? `### ${selectedText}` : '### Heading 3';
      cursorOffset = selectedText ? 4 : 4; // Position cursor after "### "
      break;
    
    case 'bullet':
      formattedText = selectedText ? `- ${selectedText}` : '- List item';
      cursorOffset = selectedText ? 2 : 2; // Position cursor after "- "
      break;
    
    case 'code':
      formattedText = selectedText ? `\`${selectedText}\`` : '`code`';
      cursorOffset = selectedText ? 1 : 1; // Position cursor after opening `
      break;
    
    case 'codeblock':
      formattedText = selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```\ncode block\n```';
      cursorOffset = selectedText ? 4 : 4; // Position cursor after opening ``` and newline
      break;
  }

  // Insert the formatted text
  textarea.value = beforeText + formattedText + afterText;

  // Position cursor appropriately
  if (selectedText) {
    // If text was selected, position cursor at the end of the formatted text
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
  } else {
    // If no text selected, position cursor to start editing the placeholder text
    const newStart = start + cursorOffset;
    const newEnd = start + formattedText.length - (format === 'codeblock' ? 4 : cursorOffset);
    textarea.setSelectionRange(newStart, newEnd);
  }

  textarea.focus();

  // Update character counter and trigger conversion
  if (typeof updateCharacterCounter === 'function') {
    updateCharacterCounter();
  }
  
  // Trigger auto-conversion with slight delay
  if (typeof convertMarkdown === 'function') {
    setTimeout(convertMarkdown, 100);
  }
}