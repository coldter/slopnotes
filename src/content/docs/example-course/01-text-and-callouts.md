---
title: Text & Callouts
description: Headings, lists, tables, blockquotes, inline code, and every aside type.
sidebar:
  order: 1
---

This page covers the plain prose primitives available in any `.md` file.

## Headings

Use `##` and below inside a page — the page `title` from frontmatter is the `<h1>`.
Headings render into the on-page table of contents automatically.

### A third-level heading

#### A fourth-level heading

## Lists

Unordered:

- First item
- Second item
  - Nested item
  - Another nested item
- Third item

Ordered:

1. Clone the repo
2. Install dependencies
3. Start the dev server

Task list:

- [x] Write the frontmatter
- [ ] Write the body
- [ ] Register in the sidebar

## Tables

| Field         | Type      | Required |
| ------------- | --------- | -------- |
| `title`       | string    | yes      |
| `description` | string    | yes      |
| `sidebar`     | object    | no       |

## Blockquotes

> A blockquote is good for callouts that are quotes or asides in the author's
> voice. For semantic warnings and tips, prefer the aside syntax below.

## Inline code and fenced blocks

Reference a value inline like `npm run dev` or a path like `src/content/docs/`.

For larger snippets, use a fenced block with a `title`:

```bash title="terminal"
git clone https://example.com/repo.git
cd repo
npm install
```

## Asides

Starlight ships four aside types. The first three use a default title matching
the type; any aside can take a custom title in square brackets.

:::note
This is a note. Use it for neutral, supplementary information.
:::

:::tip
This is a tip. Use it for advice that helps the reader work faster or avoid friction.
:::

:::caution
This is a caution. Use it for things that are easy to get wrong or have surprising
behavior.
:::

:::danger[Do not do this]
This is a danger aside with a custom title. Use it for actions that cause data
loss, break the build, or are otherwise irreversible.
:::
