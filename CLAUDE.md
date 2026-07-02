# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Diyar Faraj, a Senior Backend, DevOps & Cloud Engineer. It's a static site built with Vite, TypeScript, and SCSS — zero runtime dependencies. The site is styled as an authentic Linux terminal emulator: window chrome with title bar, bash-colored prompts, a typing intro, a fully interactive shell (with easter eggs), CRT scanline/glow effects, and a tmux-style status bar.

**SEO Optimized**: comprehensive meta tags, Open Graph (with a generated 1200×630 og-image), Twitter Cards, Schema.org JSON-LD (Person, WebSite, ProfilePage), sitemap.xml, robots.txt, and web manifest.

## Development Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server on http://localhost:3080
npm run build      # tsc type-check + vite build → dist/
npm run preview    # preview the production build
npm run deploy     # build + publish dist/ to GitHub Pages (gh-pages branch)
```

After deployment, the custom domain (diyarfaraj.com) may need to be re-configured in GitHub repository settings (Settings > Pages > Custom domain).

## Project Architecture

### Directory Structure
- `src/` — source files (Vite root)
  - `index.html` — the page (SEO head + terminal markup)
  - `main.ts` — all behavior (typing intro, interactive shell, modal, effects)
  - `styles/man.scss` — main stylesheet entry
  - `styles/_config.scss` — palette variables and media-query/motion mixins
- `public/` — static assets copied verbatim into the build
  - `img/` — portrait, certification badges, `og-image.png` (social preview)
  - `favicon/` — favicons + `site.webmanifest`
  - `sitemap.xml`, `robots.txt`
- `dist/` — production build output (committed; deployed to GitHub Pages)

Legacy note: the root `scss/` folder is a leftover from the pre-Vite site; the live styles are in `src/styles/`.

### TypeScript Architecture (`src/main.ts`)

Vanilla TS classes, no frameworks:

1. **TerminalTyping** — types each section's command then reveals its output. Skippable via any click/keypress; with `prefers-reduced-motion` everything renders instantly.
2. **Shell** — the interactive prompt at the bottom. Commands: `help`, `whoami`, `about`, `skills`, `certs`, `contact`, `neofetch`, `ls`, `pwd`, `date`, `uname`, `echo`, `history`, `clear`, `matrix`, `exit`, plus easter eggs (`sudo`, `rm`, `vim`, Ctrl+L, Ctrl+C). Supports ↑/↓ history and Tab completion. All user input is HTML-escaped before printing.
3. **MatrixRain** — canvas-based falling-glyph effect triggered by the `matrix` command (time-boxed, motion-safe).
4. **CertModal** — certificate [view]/[visit] actions with Escape-to-close and focus restore.
5. **CertGlitch** — random hue-glitch filter on badge hover (per-image intervals, disabled under reduced motion).

Content visibility rule: `.typing-output` is only hidden when `html.js` is set (inline script in `<head>`), so crawlers and no-JS users see all content.

### Styling Theme

Linux terminal / CRT aesthetic, defined in `src/styles/_config.scss`:
- Terminal green `#33ff33` on black, body text `#d0d0d0`, path blue `#57c7ff`
- Font: Courier New monospace
- Terminal window chrome (title bar, dots, 80×24 badge), tmux-style status bar
- CRT overlay: scanlines + vignette + subtle flicker (flicker only under `prefers-reduced-motion: no-preference`)
- ASCII figlet name banner scales with `clamp()` so it never overflows on mobile

When modifying styles, edit `src/styles/*.scss`; Vite compiles them.

### Responsive Design

Breakpoint mixins in `_config.scss`: `mediaSm` (≤500px), `mediaMd` (≤768px), `mediaLg`, `mediaXl`. On mobile the layout stacks (portrait first), cert actions are always visible (no hover on touch), and the shell input uses a 16px floor to prevent iOS zoom-on-focus.

## SEO & Performance

- og-image: `public/img/og-image.png` (1200×630, terminal-style card). Regenerate by rendering an HTML card at 1200×630 with headless Chromium if the branding changes.
- JSON-LD: Person (with credentials), WebSite, ProfilePage — keep in sync with visible content.
- Update `<lastmod>` in `public/sitemap.xml` and `dateModified` in the ProfilePage schema when content changes.
- All images have alt text and width/height; portrait uses `loading="eager" fetchpriority="high"`, badges lazy-load.

## Accessibility

- Real `<button>` elements for cert actions with descriptive aria-labels
- `h1` contains sr-only "Diyar Faraj" text; the ASCII banner is `aria-hidden`
- Shell output is `role="log" aria-live="polite"`; decorative chrome is `aria-hidden`
- `:focus-visible` outlines, `prefers-reduced-motion` respected everywhere

## Security

- Zero runtime dependencies (no jQuery/React)
- `rel="noopener noreferrer"` on all external links
- Shell echoes are HTML-escaped (`escapeHtml`) to prevent DOM injection
