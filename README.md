# Browser Tools Hub for `immhusnainali.github.io`

## Overview
This repository contains Muhammad Husnain Ali's portfolio website plus a new static `/tools` section built for GitHub Pages. The tools hub is designed to stay fully frontend-only: no backend, no database, no authentication, and no paid APIs.

The live tools process files and text locally in the browser wherever that workflow is realistic for a static site.

## Supported tools
### Live tools
- Merge PDF
- Split PDF
- Add Watermark to PDF
- Image Compressor
- Image Resizer
- JSON Formatter and Validator
- Base64 Encode or Decode
- URL Encode or Decode
- UUID Generator
- Password Generator
- Password Strength Checker
- Random Token Generator
- QR Code Generator
- Portfolio Share
- Timestamp Converter
- Random Number Generator
- Calculator
- Word Counter
- Character Counter
- Text Case Converter
- Remove Duplicate Lines
- Text Sorter
- Line Number Generator

### Planned scaffold pages
- PDF: Rotate PDF Pages, Delete PDF Pages, Reorder PDF Pages, Extract Selected PDF Pages, Add Page Numbers to PDF
- Image: JPG to PNG, PNG to JPG, Image to WebP, Crop Image, Rotate or Flip Image, Add Watermark to Image
- Developer: Regex Tester, HTML Formatter, CSS Minifier
- Text: Text Diff Checker
- Utility: Hash Generator, Markdown to HTML, HTML to Markdown, CSV to JSON, JSON to CSV, Unit Converter

## Tech stack
- HTML5
- CSS3
- Vanilla JavaScript
- CDN libraries loaded only when needed:
  - `pdf-lib`
  - `PDF.js`
  - `JSZip`
  - `qrcodejs`

## Project structure
```text
/
  index.html
  tools/
    index.html
    pdf/
    image/
    developer/
    text/
    utility/
  assets/
    css/
      styles.css
      site-shell.css
      tools.css
    js/
      main.js
      site-shell.js
      tools/
        app.js
        i18n.js
        registry.js
        data/
        shared/
        controllers/
```

## Run locally
Use any simple static file server from the repo root. Examples:

```bash
python -m http.server 8000
```

or

```bash
npx serve .
```

Then open `http://localhost:8000`.

## Deploy on GitHub Pages
1. Push this repository to the branch you publish from for GitHub Pages.
2. Ensure GitHub Pages is configured to serve from the repository root.
3. Keep the `.nojekyll` file in place so the static directory structure stays untouched.
4. Because every route is an actual `index.html` file, direct refreshes like `/tools/pdf/merge-pdf/` work without server-side routing.

## Frontend-only limitations
- Planned tools are intentionally scaffolded only and do not fake unavailable functionality.
- Portfolio Share is optimized for public links, messages, QR handoff, and honest file support checks. It does not create public download links for uploaded files on static hosting.
- No server OCR, cloud conversion, or advanced office document conversion is included.
- PDF preview uses browser-side libraries and may feel slower on very large files.
- Browser memory limits still apply for large PDFs and large image batches.
- The tools section uses shared URLs with client-side language switching; English remains the default indexed HTML content.

## Future improvements
- Promote more planned tools to live browser-only implementations
- Add hash generation and data conversion utilities with the same local-first approach
- Add richer image editing flows like crop and watermark overlays
- Expand tool-specific translations beyond shared UI copy
- Add optional offline caching for the tools hub assets
- Add visual regression and browser automation tests for the tools section
