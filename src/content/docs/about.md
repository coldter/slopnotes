---
title: About slopnotes
description: What slopnotes is, why it exists, and how it is built.
template: splash
lastUpdated: 2026-06-16
head:
  - tag: style
    content: |
      .hero-bg { display: none !important; }
      .content-panel { max-width: 60rem !important; margin: auto; padding:1.5rem 0px !important; }
---

## What this is

**slopnotes** is a personal home for AI-generated learning material. Good
explanations from a model usually end up buried in a chat history and are never
seen again. slopnotes is where those notes get saved, organized, and given a
reading experience worth coming back to.

The name is a wink at the source: a lot of the content starts as AI "slop" —
then gets curated into something genuinely useful to learn from.

## Why it exists

- **Keep the good stuff.** Chat logs are disposable; courses are not.
- **Read anywhere.** A responsive, dark/light, search-enabled site beats
  scrolling a transcript on a phone.
- **Stay portable.** Everything is plain Markdown/MDX — no lock-in, easy to
  paste, refine, and version with git.

## How it is organized

Each topic is a **course** — a folder under `src/content/docs/`. Every Markdown
or MDX file inside becomes a page, and `src/config/sidebar.json` groups them in
the navigation. See the [Authoring guide](/authoring/) to add your own.

## How it is built

slopnotes is built on [Astro](https://astro.build/) and
[Starlight](https://starlight.astro.build/). Branding and navigation are driven
by JSON files in `src/config/`, and styling lives in `src/config/theme.json`
and `src/styles/global.css`.
