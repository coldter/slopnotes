# slopnotes

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

## Mostly build to learn public facing production grade RAG system. Checkout backend [Slopnotes RAG](https://github.com/coldter/slopnote-rag)

A place to keep the learning material I generate with AI.

Here's how I pick up new stuff these days: instead of grinding through hours of
videos and docs, I spawn a bunch of research agents and have them survey a topic
the way I actually want to read it — my taste, my format, lots of examples. That
gives me a pile of documents, and I convert them into clean pages here (Markdown
/ MDX, rich formatting, searchable).

The "slop" in the name is honest. This isn't a high-effort, carefully-sourced
project — it's a quick, low-effort way to get up to speed on something new. I
don't always know exactly where every detail came from, and it's not guaranteed
100% correct (call it ~99%). But for my taste the output is genuinely good,
better than ~95% of what's already out there. That's the whole thing.

Built on [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

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

## AI assistant

The floating **Ask slopnotes** widget is mounted globally and talks to the sibling
`slopnote-rag` Worker.

Optional public build variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PUBLIC_SLOPNOTES_RAG_URL` | Dev: `http://localhost:8787`; prod: `https://slopnote-rag.kuldeep.tech` | Base URL for `/pow/request` and streaming `POST /ask` |
| `PUBLIC_TURNSTILE_SITE_KEY` | unset | Cloudflare Turnstile site key; set this for production when the RAG Worker runs with Turnstile enabled |

For local end-to-end testing, run the RAG Worker from `../slopnote-rag` and this
site at `localhost:4321`; the RAG dev environment disables production gates but
still streams through the same `/ask` contract.

## Deploy

The site is a fully static build deployed to Cloudflare Workers via
[Wrangler](https://developers.cloudflare.com/workers/):

```bash
npm run preview:cf-workers   # build + run locally on the Workers runtime
npm run deploy:cf-workers    # build + deploy (requires `wrangler login`)
```

Deploy credentials come from your local Wrangler auth — nothing is committed.

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

## License

MIT. Includes third-party theme code — see [`LICENSE`](LICENSE).
