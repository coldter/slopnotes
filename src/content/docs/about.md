---
title: About slopnotes
description: "What slopnotes is, why it exists, and how it is built."
template: splash
lastUpdated: 2026-06-16
head:
  - tag: style
    content: |
      .content-panel { max-width: 60rem !important; margin: auto; padding:1.5rem 0px !important; }
---

## What this is

**slopnotes** is where I keep learning material I generate with AI. I spawn research agents to survey a topic, then convert the output into these searchable Markdown/MDX pages.

## Why it's called slop

Because that's what it is. This isn't meticulously cited — it's a fast way to get started on a topic. I don't know the exact source behind every detail and it won't be 100% correct, maybe 99%. For how I learn, that beats ~95% of the material out there.

## How it is organized

Each topic is a **guide** — a folder under `src/content/docs/`. Every Markdown or MDX file inside becomes a page, grouped in `src/config/sidebar.json`. Browse from the [Content](/content/) page.

## How it is built

[Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/). Branding and navigation come from JSON in `src/config/`; styling lives in `src/config/theme.json` and `src/styles/global.css`.
