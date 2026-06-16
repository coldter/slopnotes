---
title: Add a Course
description: Create a course folder, write frontmatter, and register it in the sidebar.
sidebar:
  order: 1
---

Adding a course is three steps: create files, give them frontmatter, and register
the course group in the sidebar config.

## 1. Create the course folder

Make a folder under `src/content/docs/` named after the slug you want in the URL,
and add one markdown file per page:

```text title="filesystem"
src/content/docs/my-new-course/
  overview.md
  01-getting-started.md
  02-going-deeper.mdx
```

Use `.md` for prose-only pages and `.mdx` only when you need components like
`<Tabs>`, `<Card>`, or `<Steps>`.

## 2. Add frontmatter

Every page needs YAML frontmatter. At minimum, set `title` and `description`;
use `sidebar.order` to control where the page sits within its group.

```md title="src/content/docs/my-new-course/overview.md"
---
title: Overview
description: What this course covers and who it's for.
sidebar:
  order: 0
---

Your content starts here.
```

## 3. Register the course in the sidebar

Open `src/config/sidebar.json` and add a group object for the new course. Point
`autogenerate.directory` at the folder you created:

```json title="src/config/sidebar.json"
{
  "label": "My New Course",
  "autogenerate": { "directory": "my-new-course" }
}
```

`autogenerate` builds the group's links by scanning every page in that directory,
so you never have to list pages by hand. Within the group, pages are ordered by
each page's `sidebar.order` frontmatter (ties fall back to alphabetical by slug).

:::tip[Add an icon to the label]
The theme supports an optional `[icon-name]` prefix on the group `label`. Use any
icon from Starlight's icon set, including the `seti:` file-type icons:

```json
{
  "label": "[seti:vite] My Course",
  "autogenerate": { "directory": "my-new-course" }
}
```
:::

Once registered, start the dev server and the new course group should appear in
the sidebar with its pages in order.
