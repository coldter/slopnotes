---
title: About slopnotes
description: What slopnotes is, why it exists, and how it is built.
template: splash
lastUpdated: 2026-06-16
head:
  - tag: style
    content: |
      .content-panel { max-width: 60rem !important; margin: auto; padding:1.5rem 0px !important; }
---

## What this is

**slopnotes** is where I keep the learning material I generate with AI.

The way I learn new things now: instead of sitting through hours of videos and
documentation, I spawn a handful of research agents and have them survey a topic
for me — in my taste, in the format I like to read, with plenty of examples. I
end up with a stack of documents, then convert them into the clean, searchable
pages you see here (Markdown / MDX).

## Why it's called slop

Because that's what it is, and I'd rather be honest about it. This isn't a
high-effort, meticulously-cited project — it's a fast, low-effort way to get
started on a new topic or technology.

I don't always know the exact source behind every detail, and I won't claim it's
100% correct — it's right maybe 99% of the time. But the results are good. For
how I like to learn, it beats ~95% of the material already out there. That's
enough for me.

## How it is organized

Each topic is a **guide** — a folder under `src/content/docs/`. Every Markdown
or MDX file inside becomes a page, and `src/config/sidebar.json` groups them in
the navigation. Browse what's here from the [Content](/content/) page.

## How it is built

slopnotes is built on [Astro](https://astro.build/) and
[Starlight](https://starlight.astro.build/). Branding and navigation are driven
by JSON files in `src/config/`, and styling lives in `src/config/theme.json`
and `src/styles/global.css`.
