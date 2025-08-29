// Unicode style base code points for programmatic generation
const unicodeStyleBases = {
  bold: {
    upperCase: 120211,    // 𝗔 - 'A' = 120276 - 65
    lowerCase: 120205,    // 𝗮 - 'a' = 120302 - 97
    digits: 120764        // 𝟬 - '0' = 120812 - 48
  },
  italic: {
    upperCase: 119795,    // 𝐴 - 'A' = 119860 - 65
    lowerCase: 119789     // 𝑎 - 'a' = 119886 - 97
  },
  monospace: {
    upperCase: 120367,    // 𝙰 - 'A' = 120432 - 65
    lowerCase: 120361,    // 𝚊 - 'a' = 120458 - 97
    digits: 120774        // 𝟶 - '0' = 120822 - 48
  },
  script: {
    upperCase: 119899,    // 𝒜 - 'A' = 119964 - 65
    lowerCase: 119893     // 𝒶 - 'a' = 119990 - 97
  },
  strikethrough: {
    combiningChar: '\u0335'  // Combining long stroke overlay
  },
  underline: {
    combiningChar: '\u0332'  // Combining low line
  }
};

// Hardcoded Danish character exceptions (custom mappings that don't follow Unicode patterns)
const danishExceptions = {
  bold: {
    'æ': '𝗮𝗲', 'Æ': '𝗔𝗘', 'ø': '𝗼̸', 'Ø': '𝗢̸', 'å': '𝗮̊', 'Å': '𝗔̊'
  },
  italic: {
    'æ': '𝑎𝑒', 'Æ': '𝐴𝐸', 'ø': '𝑜̸', 'Ø': '𝑂̸', 'å': '𝑎̊', 'Å': '𝐴̊'
  },
  monospace: {
    'æ': '𝚊𝚎', 'Æ': '𝙰𝙴', 'ø': '𝚘̸', 'Ø': '𝙾̸', 'å': '𝚊̊', 'Å': '𝙰̊'
  },
  script: {
    'æ': '𝒶ℯ', 'Æ': '𝒜ℰ', 'ø': 'ℴ̸', 'Ø': '𝒪̸', 'å': '𝒶̊', 'Å': '𝒜̊'
  },
  strikethrough: {
    'æ': 'æ̵', 'Æ': 'Æ̵', 'ø': 'ø̵', 'Ø': 'Ø̵', 'å': 'å̵', 'Å': 'Å̵'
  },
  underline: {
    'æ': 'æ̲', 'Æ': 'Æ̲', 'ø': 'ø̲', 'Ø': 'Ø̲', 'å': 'å̲', 'Å': 'Å̲'
  }
};

function convertToUnicodeOnDemand(text, style) {
  if (!text || typeof text !== 'string') {
    return text || ''; // Handle null/undefined gracefully
  }

  return text
    .split('')
    .map(char => {
      try {
        // Check for Danish character exceptions first
        if (danishExceptions[style] && danishExceptions[style][char]) {
          return danishExceptions[style][char];
        }

        // Handle regular characters programmatically
        const charCode = char.codePointAt(0);
        const styleBase = unicodeStyleBases[style];

        if (!styleBase) {
          return char; // Unknown style, return original character
        }

        // Handle strikethrough and underline with combining characters
        if (style === 'strikethrough' || style === 'underline') {
          // Apply combining character to letters and digits
          if ((charCode >= 65 && charCode <= 90) || // A-Z
              (charCode >= 97 && charCode <= 122) || // a-z
              (charCode >= 48 && charCode <= 57)) {  // 0-9
            return char + styleBase.combiningChar;
          }
          return char;
        }

        // Handle mathematical alphanumeric symbols
        if (charCode >= 65 && charCode <= 90 && styleBase.upperCase) {
          // Uppercase A-Z
          try {
            const codePoint = styleBase.upperCase + charCode;
            const unicodeChar = String.fromCodePoint(codePoint);
            return unicodeChar;
          } catch (e) {
            return char; // Fallback if conversion fails
          }
        } else if (charCode >= 97 && charCode <= 122 && styleBase.lowerCase) {
          // Lowercase a-z
          try {
            const codePoint = styleBase.lowerCase + charCode;
            const unicodeChar = String.fromCodePoint(codePoint);
            return unicodeChar;
          } catch (e) {
            return char; // Fallback if conversion fails
          }
        } else if (charCode >= 48 && charCode <= 57 && styleBase.digits) {
          // Digits 0-9
          try {
            const codePoint = styleBase.digits + charCode;
            const unicodeChar = String.fromCodePoint(codePoint);
            return unicodeChar;
          } catch (e) {
            return char; // Fallback if conversion fails
          }
        }

        // Return original character if no conversion applies
        return char;
      } catch (error) {
        // If any Unicode conversion fails, return original character
        console.warn(`Unicode conversion failed for character '${char}' in style '${style}':`, error);
        return char;
      }
    })
    .join('');
}

// Keep original function for backward compatibility (legacy code might use it)
function convertToUnicode(text, style) {
  return convertToUnicodeOnDemand(text, style);
}