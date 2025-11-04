# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Diyar Faraj, a certified software engineer. It's a static site built with semantic HTML5, SCSS (compiled to CSS), and pure vanilla JavaScript (no dependencies). The site features a Matrix-inspired animated theme with glitch effects and falling character animations.

**SEO Optimized**: This site includes world-class SEO with comprehensive meta tags, Open Graph, Twitter Cards, Schema.org structured data, sitemap.xml, and robots.txt.

## Development Commands

### Install Dependencies
```bash
npm install
```

### Watch and Compile SCSS
Watches the `scss/` directory and compiles SCSS files to `dist/css/` directory:
```bash
npm run sass
```

### Deploy to GitHub Pages
Deploys the `dist/` directory to GitHub Pages:
```bash
npm run deploy
```

After deployment, manually configure the custom domain in GitHub repository settings (Settings > Pages > Custom domain: diyarfaraj.com).

### Local Development
1. Install dependencies: `npm install`
2. Start SCSS watcher in one terminal: `npm run sass`
3. Use VS Code "Live Server" extension: Right-click `dist/index.html` and select "Open with Live Server"

## Project Architecture

### Directory Structure
- `dist/` - Production build directory (deployed to GitHub Pages)
  - `index.html` - Main HTML file
  - `css/main.css` - Compiled CSS from SCSS
  - `js/main.js` - Main JavaScript file with Matrix effects
  - `img/` - Images including portrait and certification badges
- `scss/` - SCSS source files
  - `man.scss` - Main SCSS entry point
  - `_config.scss` - Variables, mixins, and global functions
  - `_menu.scss` - Navigation menu styles
  - `_mobile.scss` - Responsive design breakpoints
- `node_modules/` - Dependencies (gitignored)

### SCSS Organization

The SCSS is modular with imports in `man.scss`:
- **_config.scss**: Contains color variables (`$primary-color`, `$secondary-color`), mixins (`easeOut`, `background`), media query mixins (`mediaSm`, `mediaMd`, `mediaLg`, `mediaXl`), and utility functions (`set-text-color`)
- **_menu.scss**: Navigation menu and overlay styles with animated transitions
- **_mobile.scss**: Responsive breakpoints for different screen sizes

When modifying styles, edit files in `scss/` directory, not the compiled `dist/css/main.css`.

### JavaScript Architecture

**Main JavaScript file**: `dist/js/main.js`

Key components:
1. **Messenger Animation System**: Matrix-inspired typing effect that cycles through career-related messages. Uses jQuery for DOM manipulation and custom animation timing.
2. **Matrix Rain Background**: Creates falling character columns with Japanese-inspired glyphs (ﾊﾐﾋｰｳｼﾅ etc.) dynamically positioned across the viewport
3. **First Name Glitch Effect**: Applies random character substitutions and flickering light effects to the name "Diyar" to simulate neon sign flicker
4. **Menu Toggle System**: (Currently disabled but preserved) Handles navigation menu show/hide with CSS class toggling

The animation system uses:
- Randomized timing for organic feel
- Character sets with Matrix-style glyphs
- Multiple animation layers (text fade, glitch, flicker)
- CSS animations injected via JavaScript for Matrix rain

### Styling Theme

The site uses a Matrix/cyberpunk aesthetic:
- Primary color: Dark green (`rgb(28, 87, 46)`)
- Secondary color: Bright green (`#04830f`)
- Font: Courier New monospace
- Effects: Green glow (`text-shadow: 0 0 5px #0f0`), flickering animations
- Background: Black with animated falling Matrix characters

### External Dependencies

- **Font Awesome 5.8.2**: Social media icons (CDN)
- **Google Analytics 4**: Modern analytics (ID placeholder: G-XXXXXXXXXX)
- **sass (dart-sass)**: Modern SCSS compilation
- **gh-pages v6.x**: GitHub Pages deployment (security patched)

**Note**: All JavaScript is vanilla/native - no jQuery or React dependencies.

### Responsive Design

Media query breakpoints defined in `_config.scss`:
- Small (phones): max-width 500px
- Medium (tablets): max-width 768px
- Large (laptops): 769px - 1170px
- Extra Large (widescreens): min-width 1171px

Mobile adjustments include simplified grid layouts, smaller fonts, and stacked navigation.

## Deployment Notes

- The site is deployed to GitHub Pages from the `dist/` directory
- Custom domain: diyarfaraj.com (must be manually configured after each deployment)
- GitHub Pages branch: gh-pages (automatically managed by gh-pages package)
- All production files must be in `dist/` directory to be deployed

## Working with This Codebase

- The main HTML is in `dist/index.html` - this is the production file with world-class SEO
- Always compile SCSS after making changes: `npm run sass` (watch mode) or `npx sass scss/man.scss dist/css/main.css`
- JavaScript is pure vanilla with comprehensive JSDoc comments - no external dependencies
- The Matrix effect performance depends on character count calculations based on viewport width
- Certification images are linked to external verification URLs (Credly, Sertifier)
- All images have proper alt text, lazy loading, and width/height for CLS optimization

## SEO & Performance

### SEO Features Implemented
- Comprehensive meta tags (title, description, keywords, author, robots)
- Open Graph protocol for Facebook/LinkedIn sharing
- Twitter Card tags for Twitter sharing
- Schema.org JSON-LD structured data (Person and WebSite schemas)
- All certifications included in structured data
- Canonical URL configuration
- sitemap.xml with image sitemaps
- robots.txt with crawl directives
- Semantic HTML5 (header, main, nav, section)
- ARIA labels and accessibility features

### Performance Optimizations
- Lazy loading on all images (`loading="lazy"`)
- Width/height attributes on images (prevents CLS)
- Async loading of analytics
- Pure vanilla JS (no heavy framework overhead)
- Minified assets ready for production

### To-Do for Full Production
1. Replace `G-XXXXXXXXXX` with actual Google Analytics 4 measurement ID
2. Generate and add favicons (favicon.ico, apple-touch-icon.png, etc.)
3. Consider adding a service worker for offline capabilities
4. Run Lighthouse audit and optimize based on recommendations

## Security

- **Zero npm vulnerabilities**: All dependencies updated to secure versions
- **No jQuery**: Eliminated jQuery 1.9.1 and other outdated libraries
- **rel="noopener noreferrer"**: All external links are secured
- **Modern gh-pages v6.x**: Patched prototype pollution vulnerability

## Code Quality

- All JavaScript uses ES6+ features (classes, arrow functions, const/let)
- Comprehensive JSDoc comments on all functions
- Clear code organization with section headers
- No dead code or commented-out sections
- Proper error handling (null checks before DOM operations)
