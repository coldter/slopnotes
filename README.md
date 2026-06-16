# slop-learn

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

A personal home for **AI-generated learning material**. Good explanations from a
model usually get buried in a chat log and never seen again — slop-learn is where
those notes get saved, organized as courses, and given a clean, searchable,
responsive reading experience.

Built on [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/),
using the [DocKit](https://github.com/themefisher/dockit-astro) theme (MIT).

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
```

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Start the dev server at `localhost:4321`    |
| `npm run build`   | Build the production site to `./dist/`      |
| `npm run preview` | Preview the production build locally        |
| `npm run check`   | Run `astro check` (type/diagnostics)        |

## How it is organized

Each topic is a **course** — a folder under `src/content/docs/`. Every Markdown
or MDX file inside becomes a page.

```
src/
├── content/docs/          ← all course content
│   ├── index.mdx          ← landing page
│   ├── example-course/    ← sample course (use as a template)
│   └── authoring/         ← how to add/format content
├── config/                ← JSON-driven site config
│   ├── config.json        ← title, logo, footer, nav button
│   ├── sidebar.json       ← sidebar groups (one per course)
│   ├── menu.en.json       ← top nav + footer links
│   ├── social.json        ← social icons
│   ├── locals.json        ← locales (English only)
│   └── theme.json         ← colors & fonts
├── styles/global.css      ← global styling
└── assets/                ← logos & images
```

## Add a course

1. Create `src/content/docs/<course-slug>/` and add Markdown/MDX files.
2. Give each page frontmatter (`title`, `description`, `sidebar.order`).
3. Register the course in `src/config/sidebar.json`:

   ```json
   {
     "label": "[rocket] My Course",
     "autogenerate": { "directory": "my-course" }
   }
   ```

Full details — including the frontmatter reference — live in the on-site
[Authoring guide](src/content/docs/authoring/index.md).

## Credits

Theme: [DocKit](https://github.com/themefisher/dockit-astro) by
[Themefisher](https://themefisher.com), MIT licensed. See [`LICENSE`](LICENSE).
