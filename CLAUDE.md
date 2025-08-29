# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern HTML application that converts Markdown text to LinkedIn-formatted text using Unicode characters. The application features a clean, user-friendly interface with a collapsible formatting toolbar for easy text formatting.

## Current Architecture

```
src/
├── index.htm                    # Main application file
├── styles/
│   ├── main.css                # Global styles with grey gradient background
│   └── components.css          # Component styles including formatting toolbar
├── scripts/
│   ├── unicode-generator.js    # Optimized Unicode generation system
│   ├── markdown-parser.js      # Markdown parsing and conversion logic
│   ├── ui-controller.js        # UI interactions and formatting toolbar
│   └── main.js                 # Event listeners and initialization
└── assets/                     # Static assets directory
```

## Key Features

**Text Conversion:**
- Converts Markdown syntax to LinkedIn-compatible Unicode characters
- Supports bold, italic, headers, bullet lists, code blocks, strikethrough, underline, and script text
- Handles Danish characters (æ, ø, å) correctly
- Real-time conversion with 500ms debounce

**User Interface:**
- Clean grey gradient background design
- Collapsible formatting toolbar with priority buttons (Bold, Italic, H1-H3, Bullets, Code)
- Real-time character counter with performance warnings for large inputs
- Side-by-side input/output layout
- Mobile responsive design

**File Handling:**
- Upload .md and .txt files (max 1MB)
- File type and size validation with error messages
- Auto-conversion after file loading

**Advanced Features:**
- Enhanced clipboard functionality with multiple fallback methods
- Comprehensive error handling and validation
- Performance warnings for large text inputs (>10k characters)
- Unicode character fallbacks for unsupported conversions

## Technical Implementation

**Unicode System:**
- Memory-efficient on-demand character generation
- Mathematical Alphanumeric Symbols for styled text
- Combining Diacritical Marks for strikethrough/underline
- Custom Danish character mappings
- Graceful fallbacks for conversion failures

**Error Handling:**
- Input validation and user-friendly error messages
- Clipboard access fallbacks for different browsers
- File upload restrictions and validation
- Comprehensive try-catch blocks preventing crashes

## Development

**Running the Application:**
- Open `src/index.htm` in any modern web browser
- No build process, package managers, or server required
- Static HTML application with embedded CSS and JavaScript

**Testing:**
- Manual testing across different browsers
- Unicode conversion verification
- Mobile responsiveness testing
- File upload and error handling testing

**Code Organization:**
- Modular JavaScript with clear separation of concerns
- Maintainable CSS with component-based organization
- Clean HTML structure with semantic elements
- Comprehensive error handling throughout