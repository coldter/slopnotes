---
title: Overview
description: A sample template course showing how content looks and behaves on slopnotes.
sidebar:
  order: 0
---

This is a **sample course**. It exists as a copy-paste template so future courses
have a known-good starting point. Nothing here is meant to teach a real subject —
each page exists to demonstrate a slice of what Starlight markdown can do.

## How courses are structured

Every course on slopnotes is a folder under `src/content/docs/`. The folder name
becomes the URL slug, and each markdown file inside it is one page. This course
lives at `src/content/docs/example-course/` and contains:

- **Text & Callouts** — headings, lists, tables, blockquotes, and all four aside types.
- **Code & Tabs** — code blocks with titles and line highlighting, tabbed examples, and steps.
- **Cards & Media** — card grids, link cards, badges, and file trees.

:::note
Page order in the sidebar is controlled by the `sidebar.order` frontmatter field,
not by filename. The numeric prefixes on these files (`01-`, `02-`) are just a
convention to keep the directory readable.
:::

:::tip[Copy this course]
To bootstrap a new course, copy this folder, rename it, and start editing. Then
register it — see the [Authoring Guide](/authoring/) for the one config change required.
:::
