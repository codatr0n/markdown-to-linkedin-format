function convertMarkdown() {
  try {
    const input = document
      .getElementById('markdownInput')
      .value;
    const output = document.getElementById('output');

  if (!input.trim()) {
    output.textContent = 'Please enter some markdown text to convert.';
    return;
  }

  // Warn about large inputs that might affect performance
  const inputLength = input.length;
  const performanceThreshold = 10000; // 10k characters
  
  if (inputLength > performanceThreshold) {
    const shouldContinue = confirm(
      `Large input detected (${inputLength.toLocaleString()} characters).\n\n` +
      `This might slow down the conversion. Continue anyway?\n\n` +
      `Tip: Consider breaking your text into smaller sections.`
    );
    if (!shouldContinue) {
      return;
    }
  }

  let converted = input;

  // Convert headers (# ## ###) to bold text with spacing and visual separators
  converted = converted.replace(/^### (.+)$/gm, (match, text) => {
    return '\n▸ ' + convertToUnicodeOnDemand(text.trim(), 'bold') + '\n';
  });
  converted = converted.replace(/^## (.+)$/gm, (match, text) => {
    return '\n━━ ' + convertToUnicodeOnDemand(text.trim(), 'bold') + ' ━━\n';
  });
  converted = converted.replace(/^# (.+)$/gm, (match, text) => {
    return '\n🔹 ' + convertToUnicodeOnDemand(text.trim(), 'bold') + ' 🔹\n';
  });

  // Convert strikethrough ~~text~~
  converted = converted.replace(/~~(.+?)~~/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'strikethrough');
  });

  // Convert underline __text__ (alternative to **bold**)
  converted = converted.replace(/(?<!\*)\b__(.+?)__(?!\*)/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'underline');
  });

  // Convert script/fancy text ^^^text^^^
  converted = converted.replace(/\^\^\^(.+?)\^\^\^/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'script');
  });

  // Convert monospace/code blocks ```text```
  converted = converted.replace(/```([^`]+?)```/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'monospace');
  });

  // Convert **bold** text
  converted = converted.replace(/\*\*(.+?)\*\*/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'bold');
  });

  // Convert *italic* text
  converted = converted.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'italic');
  });

  // Convert inline code `text` to monospace
  converted = converted.replace(/`([^`]+?)`/g, (match, text) => {
    return convertToUnicodeOnDemand(text, 'monospace');
  });

  // Convert bullet points with various bullet styles
  converted = converted.replace(/^[\s]*[-*+] (.+)$/gm, '▸ $1');

  // Convert special bullet points
  converted = converted.replace(/^[\s]*• (.+)$/gm, '• $1');
  converted = converted.replace(/^[\s]*○ (.+)$/gm, '○ $1');
  converted = converted.replace(/^[\s]*► (.+)$/gm, '► $1');

  // Convert numbered lists
  converted = converted.replace(/^[\s]*\d+\. (.+)$/gm, (match, text, offset, string) => {
    const lines = string
      .substring(0, offset)
      .split('\n');
    const currentLineIndex = lines.length;
    const numberedLines = string
      .split('\n')
      .filter(line => /^[\s]*\d+\./.test(line));
    const currentIndex = numberedLines.findIndex(line => line.includes(text)) + 1;
    return `${currentIndex}. ${text}`;
  });

  // Convert links [text](url) to "text (url)" format
  converted = converted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

  // Convert blockquotes > to visual quotes
  converted = converted.replace(/^> (.+)$/gm, '❝ $1 ❞');

  // Convert horizontal rules --- to visual separators
  converted = converted.replace(/^---+$/gm, '━━━━━━━━━━━━━━━━━━━━');

  // Note: Code block visual spacing is now handled in the main conversion above

  // Clean up excessive newlines but preserve intentional spacing
  converted = converted.replace(/\n\n\n+/g, '\n\n');

  // Trim and ensure clean start/end
  converted = converted.trim();

  output.textContent = converted;
  
  } catch (error) {
    console.error('Markdown conversion failed:', error);
    const output = document.getElementById('output');
    output.textContent = 'Error converting markdown. Please check your input and try again.\n\n' +
                        'If the problem persists, try:\n' +
                        '1. Simplifying your markdown\n' +
                        '2. Breaking it into smaller sections\n' +
                        '3. Removing any unusual characters';
  }
}