# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio for Diyar Faraj (diyarfaraj.com). It is one static page in a Matrix-style terminal look: green (#33ff33) on black, monospace, a `whoami` ASCII banner, a few prompt-headed sections, the portrait and four certification badges. No JavaScript, no animation, no runtime dependencies. Built with Vite and SCSS.

The message leads with agentic development (agentic-first workflows, a software factory around the code, AI in production, legacy modernisation) and keeps the classic backend, .NET, Kubernetes, Linux and DevOps work.

## Commands

```bash
npm install        # install dependencies
npm run dev        # Vite dev server on http://localhost:3080
npm run build      # vite build -> dist/
npm run preview    # preview the production build
npm run deploy     # build + publish dist/ to GitHub Pages (gh-pages branch)
```

`public/CNAME` (diyarfaraj.com) is copied into `dist/`, so the custom domain survives deploys. `dist/` is committed.

## Structure

- `src/index.html` is the whole page: SEO head (meta, Open Graph, Twitter, JSON-LD Person/WebSite/ProfilePage) and the body.
- `src/styles/man.scss` is the stylesheet. `src/styles/_config.scss` holds the palette and the media-query mixins.
- `public/img/` has the portrait, the certification badges and `og-image.png` (1200x630).
- `public/sitemap.xml`, `public/robots.txt`, `public/favicon/`, `public/CNAME`.

## Content rules

- Keep the JSON-LD in sync with the visible text. When content changes, update `<lastmod>` in `public/sitemap.xml` and `dateModified` in the ProfilePage block.
- Regenerate `public/img/og-image.png` if the headline changes: render an HTML card at 1200x630 with headless Chrome (`--screenshot`).
- Copy style: short, concrete sentences. No em-dashes. Avoid the words robust, seamless, leverage, passionate, end-to-end and production-grade.
- Do not name the Emerson product. Write "industrial monitoring platform". Saaty and Kraftsmedjan are CodeCentra's products.
- External links use `rel="noopener noreferrer"`. Images have alt text and width/height.
- Keep `:focus-visible` outlines and the mobile layout (single column at 768px and below).
