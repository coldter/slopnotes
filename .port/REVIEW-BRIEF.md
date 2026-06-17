# Editorial Review Brief — make the Auth/Multi-Tenant courses smooth, example-driven & mid-level

You are an **editor**, not a porter. The page you're given already exists, is
technically accurate, and is reasonably structured. Your job is a **targeted quality
pass** that makes it engaging and accessible to a **mid-level engineer** — without
bloating it, dumbing it down, or changing any technical fact.

Read this whole brief, then read your target page in full, then improve it in place.

## The reader (calibrate everything to this person)

A working engineer with **~2–5 years of experience**. Comfortable with general
backend: HTTP, REST, SQL, a web framework, Docker, JWTs at a "I've used them" level,
basic auth flows. **NOT** an expert in: OAuth2/OIDC internals, authorization theory
(Zanzibar/ReBAC/ABAC), Cloudflare's edge platform, or the deep security nuances of
multi-tenancy. They're smart and can follow depth — they just need the specialized
concepts **introduced** rather than assumed.

So: **keep all the depth and every decision. Improve the on-ramp.** "Mid-level" means
a better runway to the same altitude — never less substance.

## What "good" looks like (the bar)

Smooth, **example-driven**, **interactive**, scannable. A reader should be pulled
through the page by concrete examples and visuals, not wade through walls of prose.

## DO — the levers (apply where they genuinely help; calibrate effort)

1. **Re-pitch the audience.** If a page (especially an overview) says "senior
   engineers" or assumes deep expertise in its opening, soften to the mid-level reader
   above. Course overviews: state plainly that it assumes solid general backend
   experience but teaches the auth/tenancy specifics from the ground up.
2. **Gloss jargon on first use** — half a sentence, inline, no lecture. Examples of
   terms that currently appear cold and should get a quick gloss the first time:
   *Zanzibar* ("Google's permissions system that models access as relationships"),
   *ReBAC/ABAC*, *PKCE*, *JWKS*, *DCV* ("Domain Control Validation — how the CA
   confirms you own a domain"), *Hyperdrive* ("Cloudflare's Postgres connection
   pooler"), *eTLD+1* ("the registrable domain, like `acme.com`"), *BFF*,
   *fallback origin*, *service binding*, *idempotency*, *shadow user*. Don't gloss what
   a mid-level dev already knows (HTTP verbs, SQL joins, BFS, env vars).
3. **Add a one-line mental model or analogy** for the hardest concepts — only where it
   truly clarifies (e.g. "a JWKS endpoint is like a public phone book of signing keys;
   clients look up the key once and verify tokens offline after that"). Don't force an
   analogy onto something already clear.
4. **Lead with the concrete problem before the abstraction.** Many sections jump
   straight into mechanism. Add a crisp "here's the problem this solves" or "in a
   single-tenant app you'd just do X; you can't here because Y" hook. One or two
   sentences, then the mechanism.
5. **Add or sharpen worked examples.** Prefer "let's trace one request/grant/token"
   over describing it abstractly. If the page has an abstract rule with no example,
   add a small concrete one. **Pull examples from the source file (path given below) —
   never invent API names, claims, numbers, or behavior.**
6. **Break up walls of text.** Any paragraph longer than ~4–5 sentences, or 3+ dense
   paragraphs in a row, should be broken with: a sub-heading, a short list, a table, a
   diagram, an aside, or just tighter sentences. Scannability is a feature.
7. **Increase (sensible) interactivity:**
   - `<Steps>` for any do-this-then-that procedure or runtime trace.
   - `<Tabs syncKey="...">` for genuine "pick one of N" alternatives (don't invent
     alternatives).
   - `<Mermaid>` instead of a paragraph that describes a flow/topology/state machine.
   - Code **line-highlighting** (`{3-5}`) to point the eye at the lines the prose
     discusses.
   - `:::note` / `:::tip` / `:::caution` / `:::danger` to surface insight, pitfalls,
     and "why" — these double as visual breaks and scannable signposts.
   - A `<details><summary>…</summary>…</details>` "deeper dive" for a senior-level
     tangent that would otherwise interrupt a mid-level reader — STRICT single-line
     form (see MDX rules). Use rarely.
8. **Tighten.** Cut redundancy, hedging, and senior-only tangents. Shorter-and-clearer
   beats longer. Engagement comes from clarity and examples, not word count.

## DON'T — guardrails (violating these is worse than a boring page)

- **Don't change technical facts.** Versions, API/method/header/claim/table/column
  names, decision IDs (D1–D78), numbers, TTLs, regexes — all verbatim. Don't invent
  examples, endpoints, or behavior the source didn't state.
- **Don't dumb it down.** Keep every decision, tradeoff, edge case, and security
  subtlety. You're adding a runway, not removing altitude.
- **Don't bloat or pad.** No filler, no restating the heading as a sentence, no
  decorative components. If an edit doesn't make the page clearer or more engaging,
  don't make it.
- **Don't touch frontmatter** (`title`, `description`, `sidebar.order`), **slugs, or
  internal links / routes.** Leave the navigation contract intact. (You may add a
  cross-link in prose if it genuinely helps, using the existing `/auther/...` or
  `/multi-tenant/...` route forms.)
- **Don't restructure wholesale.** Preserve the page's heading anchors (other pages
  link to them) and overall section order unless a change is clearly an improvement and
  keeps anchors stable. Match the existing voice — calm, concrete, second-person-ish.
- **Preserve reference-page nature** (see below).

## MDX safety (a broken build is an automatic fail)

- **Backtick every `{…}` and `<…>` you write or move into prose**: object/claim shapes
  (`{ aud, iss, org }`), TS generics (`Record<string, string[]>`, `Promise<T>`,
  `<User>`), JSX tags shown inline (`<TenantLogo />`), URL placeholders (`{slug}`,
  `{id}`), template expressions (`${host}`). A bare one compiles but **crashes at
  render**.
- **Import every component you use.** If you add `<Steps>`, `<Tabs>`, `<TabItem>`,
  `<FileTree>`, `<Badge>`, `<LinkCard>`, `<CardGrid>` etc., ensure it's in the
  `import { … } from "@astrojs/starlight/components";` line. `<Mermaid>` is
  `import Mermaid from "~/components/Mermaid.astro";`. A used-but-unimported component
  crashes the build with "Expected component X to be defined."
- **Code fences:** `ts` (not `tsx`) unless the block has real JSX; `jsonc` for JSON
  with `//` comments; only real languages (`ts`, `tsx`, `js`, `json`, `jsonc`, `sql`,
  `lua`, `go`, `swift`, `python`, `ruby`, `bash`, `yaml`, `toml`, `ini`, `http`,
  `nginx`, `dockerfile`, `diff`, `text`) — anything else → `text`.
- **Mermaid:** inside `code={`…`}` never put a literal backtick or `${`; quote node
  text with special chars (`A["apps/auth (Better Auth)"]`).
- **`<details>`** strict form: `<details><summary>Q?</summary>` then the answer on
  contiguous lines, `</details>` glued to the end, no blank lines inside.
- The file ends with content + a single newline. **No stray tags** (`</content>`,
  `</invoke>`, `antml:`).

## Page-type notes

- **Chapter pages** (most pages): full treatment above — hooks, examples, diagrams,
  interactivity.
- **Reference pages** (`multi-tenant/decisions`, `multi-tenant/gotchas-lessons`, and
  the catalog-style `auther/integration/edge-cases`): these are **lookup material**.
  "Not boring" here means a clear "what this is / how to use it" intro, good grouping,
  and scannable tables/asides — **NOT** forced narrative. Don't turn a decision log
  into an essay. A short orienting sentence per group is enough.

## Verify before returning

1. Re-scan every prose line for bare `{` / `}` / `<` — backtick or fence them.
2. Confirm every component you used is imported.
3. Sanity-compile your single file with `@mdx-js/mdx` if you can (strip frontmatter
   first). Note: this catches syntax, NOT missing-import render crashes — so also
   eyeball the import line against the components you used.
4. Confirm you changed NO frontmatter, slug, or route.

## Return format

A concise report:
- Target path.
- The 3–6 most impactful edits you made and *why* (which lever: mid-level on-ramp,
  worked example, broke-up-wall, added diagram/steps/tabs, tightened, etc.).
- Net effect on length (roughly shorter / same / longer — shorter-or-same preferred).
- Anything you deliberately left alone (already strong) and anything you were unsure
  about (a fact you couldn't verify, an analogy you weren't certain landed).

## Hard constraints

- Edit ONLY your single target page. No other files. No `sidebar.json`/`menu.en.json`.
- No `npm`/`astro`/full build (single-file `@mdx-js/mdx` compile only).
