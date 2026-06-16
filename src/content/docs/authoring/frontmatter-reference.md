---
title: Frontmatter Reference
description: The Starlight frontmatter fields used across slopnotes pages.
sidebar:
  order: 2
---

Every page is a content file with a YAML frontmatter block at the top. The fields
below are the ones you'll reach for most often. Unless noted, these are Starlight
built-ins.

## Common fields

| Field            | Type             | Notes                                                           |
| ---------------- | ---------------- | --------------------------------------------------------------- |
| `title`          | string           | Required. Rendered as the page `<h1>` and used in nav.          |
| `description`    | string           | Required on slopnotes. Used for `<meta>` description / SEO.    |
| `sidebar`        | object           | Controls how the page appears in the sidebar (see below).       |
| `tableOfContents` | object \| false | Tune or disable the on-page TOC.                                |
| `template`       | `'doc'` \| `'splash'` | Page layout. `doc` (default) has a sidebar/TOC; `splash` is a wide landing page. |
| `prev` / `next`  | boolean \| object | Override the pagination links at the bottom of the page.       |
| `lastUpdated`    | boolean \| Date  | Show a last-updated date (from git or an explicit value).       |
| `draft`          | boolean          | When `true`, the page is excluded from production builds.       |

### The `sidebar` object

| Key      | Type            | Notes                                                            |
| -------- | --------------- | ---------------------------------------------------------------- |
| `order`  | number          | Position within the group. Lower sorts first.                    |
| `label`  | string          | Override the sidebar text (defaults to the page `title`).        |
| `badge`  | string \| object | A small badge next to the link, e.g. `{ text: 'New', variant: 'tip' }`. |
| `hidden` | boolean         | Keep the page reachable by URL but hide it from the sidebar.     |

## Realistic example

```md title="src/content/docs/my-new-course/02-advanced.mdx"
---
title: Advanced Patterns
description: Patterns that build on the basics covered earlier in this course.
sidebar:
  order: 2
  label: Advanced
  badge:
    text: New
    variant: tip
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 3
lastUpdated: true
draft: false
---
```

## slopnotes conventions vs Starlight built-ins

- **Starlight built-ins:** every field above is part of Starlight's content schema —
  `title`, `description`, `sidebar`, `tableOfContents`, `template`, `prev`/`next`,
  `lastUpdated`, and `draft`.
- **slopnotes conventions:**
  - `description` is treated as effectively required so every page has a useful
    meta description.
  - Numeric filename prefixes (`01-`, `02-`) plus a matching `sidebar.order` keep
    the directory and the rendered nav in the same order.

:::note
`lastUpdated` and `draft` are optional. `draft: true` hides a page from the
production build but still renders it in `astro dev`, which is handy for
work-in-progress lessons.
:::
