# Porter Brief — golang-guide → slopnotes "Go Guide" course

You are porting ONE source Markdown file from `/home/kuldeep/code/oss/golang-guide/`
into the slopnotes Astro Starlight site at `/home/kuldeep/code/oss/slopnotes/`,
converting it to a polished **MDX** page that uses slopnotes' native components.

This is **not** a lift-and-shift. You preserve the technical substance and the
pedagogical flow, but you (1) reframe the tone, (2) replace ASCII art with real
components, (3) use native Starlight/slopnotes components idiomatically, and
(4) make the page build cleanly as MDX.

Read this whole brief before you touch the file.

---

## 1. The course

The golang-guide is being ported as a single slopnotes course called **"Go Guide"**
living under `src/content/docs/go-guide/`. It teaches Go to an experienced
programmer, using the real **multigres** codebase ("Vitess for Postgres") as the
running source of concrete examples. The course has five tracks: Orientation,
Language, Project, Tooling, Reference.

---

## 2. TONE-DOWN POLICY (read carefully — this is a content change)

The source was written as *"A Go Guide for Contributing to Multigres."* We are
re-pitching it as a **Go guide** that happens to use multigres as its real-world
example codebase. **Tone down the multigres framing — but do NOT strip multigres
out.** The concrete grounding is what makes the guide good; removing it would
break the flow. Calibrate, don't gut.

**Reduce / soften:**
- Contributor framing: "to contribute to multigres you need…", "before you submit
  a PR…", "you'll be editing…" → reframe as understanding/reading real code.
- Repeated name-drops: don't say "multigres" five times a paragraph. Say it once
  to anchor, then use "the codebase", "this system", "the services", "here".
- Meta-references to the source repo's own tooling docs: `CLAUDE.md`, `.claude/docs/architecture.md`,
  "the README's H1", "the `/mt-dev` skill mandates…". Drop the citation scaffolding;
  keep the *fact* if it teaches something, stated plainly in your own voice.
- Insider trivia that teaches nothing about Go or general system design (exact line
  numbers like "line 194", hyper-specific field names that aren't illustrative) —
  trim or generalize. Keep file paths and API names when they make a concept concrete.

**Keep:**
- The Go teaching: every concept, example, and explanation about the language.
- multigres as the concrete example: real code snippets, the service names
  (multigateway/multipooler/pgctld/multiorch), the request path, the parser, etc.
  These are excellent real-world illustrations — keep them, just frame them as
  "here's how a real production system does X" rather than "here's your homework."
- Technical accuracy: never invent or alter a technical fact. If unsure, keep the
  original statement (lightly reworded) rather than guessing.

**Reframe, before → after (examples):**
- Before: "If you are an experienced engineer new to Go and want to contribute to
  multigres, start here." → After: "If you're an experienced engineer new to Go,
  start here. We'll learn Go by reading a real distributed-systems codebase."
- Before: "`CLAUDE.md` defines it in one sentence: > Multigres is Vitess for
  PostgreSQL…" → After: "Multigres is *Vitess for Postgres*: a set of small Go
  services that sit in front of real PostgreSQL servers…" (state it directly).
- Before: "Tests in multigres are run through the `/mt-dev` skill, not `go test`
  (see the repo `CLAUDE.md`)." → After (in tooling only, where relevant): "This
  codebase runs its tests through a dev wrapper rather than calling `go test`
  directly." (Keep the lesson — how a large project wraps testing — drop the
  insider command unless the page is specifically about that workflow.)

Net effect: a reader who has never heard of multigres should find the page a great
Go lesson with vivid real examples, not feel locked out of an internal onboarding doc.

---

## 3. Output: file location & frontmatter

Write a `.mdx` file (NOT `.md`) at the target path you are given. Every file starts
with frontmatter:

```mdx
---
title: <Page Title>
description: <one sentence, ~10-20 words, plain — used in the catalog and SEO>
sidebar:
  order: <number>
---
```

- `title`: the page's H1 — DROP the source's leading `# Title` line (frontmatter
  `title` renders the H1; a second `#` would duplicate it). Keep `##`/`###` headings.
- `description`: write a fresh, concrete one-liner (no "multigres" unless natural).
- `sidebar.order`: given to you. Lower = higher in the track.

Imports (if you use components) go immediately after the frontmatter:

```mdx
import Mermaid from "~/components/Mermaid.astro";
import { Tabs, TabItem, Steps, Card, CardGrid, LinkCard, Badge, FileTree } from "@astrojs/starlight/components";
```

Only import what you actually use.

---

## 4. MDX SAFETY (build-breaking — do not skip)

MDX parses `{` and `<` specially. Plain Markdown that was fine in `.md` will break
the build in `.mdx`. Fix every one of these in PROSE (text outside fenced code blocks):

- **Curly braces** `{ … }` in prose → wrap in backticks. `ID{component, cell, name}`
  → `` `ID{component, cell, name}` ``. `query.Target` is `{ table_group, shard }`
  → "… is `{ table_group, shard }`".
- **Angle brackets** `<…>` in prose → wrap in backticks. `go/cmd/<svc>/main.go`
  → `` `go/cmd/<svc>/main.go` ``. Channel receive `<-ch`, type params shown as
  `<T>`, `/proxy/<type>/<cell>/<name>` — all backtick-wrapped.
- **Bare `->` / `=>`** in prose are usually fine, but if a token mixes `<` like
  `<-chan` always use backticks.
- Inside **fenced code blocks** (```go, ```bash, ```text) nothing needs escaping —
  code is literal. So prefer putting tricky syntax in code spans/blocks.
- **`<details><summary>`** HTML works in MDX, BUT the form is strict — MDX will
  fail the build otherwise. Use EXACTLY this shape, with NO blank lines inside the
  block and `</details>` glued to the end of the (single-line) answer:
  ```
  <details><summary>Question text?</summary>
  Answer on one contiguous line (no blank lines), ending with the close tag.</details>
  ```
  Do NOT put a blank line after `</summary>` or before `</details>`, and do NOT put
  `</details>` on its own line. Summary/body must have no raw `{`/`<` (backtick-wrap;
  `<code>X</code>` and `<em>X</em>` inside summary are fine).
- Component tags must be balanced and importable. No stray `<` that looks like a tag.

When in doubt, wrap the token in backticks. After porting, mentally scan every line
of prose for `{` and `<`.

---

## 5. ASCII art → the RIGHT component

The source uses fenced ```text blocks for diagrams. Classify each and convert:

### 5a. Flow / architecture / box-and-arrow diagrams → `<Mermaid>`
Boxes connected by arrows, data flow, request paths, state transitions, sequences
of messages between actors. Convert to a Mermaid diagram and render with the
slopnotes component:

```mdx
import Mermaid from "~/components/Mermaid.astro";

<Mermaid title="Request flow" code={`
flowchart LR
  Client -->|PG wire| Gateway
  Gateway -->|gRPC| Pooler
  Pooler -->|pooled SQL| Postgres
`} />
```

Pick the right Mermaid diagram type:
- Boxes + arrows, grouping/zones → `flowchart TB`/`flowchart LR` with `subgraph` for
  cells/zones/phases.
- Messages between actors over time (the "client → gateway → pooler → postgres"
  step traces with `|----->|` columns) → `sequenceDiagram` (participants + `->>`/`-->>`).
- Lifecycle / status machines → `stateDiagram-v2`.
- Component `title` should be short and descriptive. Default height is fine; pass
  `height={560}` for large/tall flowcharts, `height={360}` for small ones.

Rules:
- Preserve the diagram's MEANING and labels; you may simplify noisy ASCII into a
  clean graph. Keep node labels faithful to the original (service names, edge labels).
- Node text with special chars: wrap in quotes, e.g. `A["multigateway (PG wire in)"]`.
- Edge labels: `A -->|"gRPC: MultiPoolerService"| B`.
- Do NOT leave any ```text box-drawing diagram in the output. Every one becomes a
  `<Mermaid>` (or a FileTree — see next).
- The `code={` … `}` template string is a JS template literal: a literal backtick or
  `${` inside the diagram would break it (rare in diagrams; avoid).

### 5b. Directory / file trees → `<FileTree>` (NOT Mermaid)
Any `├──`/`└──`/indented path listing of a directory layout uses the native
component:

```mdx
import { FileTree } from "@astrojs/starlight/components";

<FileTree>
- go/
  - cmd/ the 7 binaries
  - services/ the long-running services
  - common/ shared code
</FileTree>
```

Mark the focused entry with `**bold**`; trailing text becomes a comment. A trailing
`/` denotes a directory; `…` shows truncation.

---

## 6. Native component usage (use these idiomatically)

- **Code blocks (Expressive Code):** keep fenced blocks. Add a `title=` when the
  prose names the file the code comes from:  ```go title="go/.../handler.go" .
  Use `{3-5}` line ranges to highlight lines the prose calls out. Use `ins={n}`/`del={n}`
  for before/after diffs. Always set the language (` ```go `, ` ```bash `, ` ```yaml `).
- **Admonitions (asides):** convert `> **Gotcha — …**` callouts to
  `:::caution[Gotcha]` … `:::`. Map by intent:
  - `> **Gotcha …**`, "don't", "never", warnings → `:::caution[Gotcha]`
  - neutral asides, "note that", caveats → `:::note`
  - tips/best-practice → `:::tip`
  - real danger / data-loss → `:::danger`
  Keep the custom title in brackets when the original had a label
  (`:::caution[Gotcha — pgctld is not a query relay]`). Body is plain markdown.
  Plain `>` blockquotes that are genuine quotes (not asides) may stay as blockquotes.
- **Steps:** ordered, do-this-then-that procedures → wrap the ordered list in
  `<Steps>…</Steps>`.
- **Tabs:** "pick one of N" alternatives (OS, package manager, approaches) →
  `<Tabs syncKey="…"><TabItem label="…">…</TabItem></Tabs>`.
- **LinkCard / CardGrid:** the trailing "## See also" / "## Next" navigation link
  lists read nicely as `<LinkCard title="…" description="…" href="…" />` (one per
  link) — optionally grouped in a `<CardGrid>`. The page's own prev/next is also
  auto-generated by the site, so keep "See also" as cross-references and keep "Next"
  short (a single LinkCard or one sentence + link).
- **Badge:** small inline status labels only. Don't overuse.
- **GFM tables:** keep as Markdown tables — they render great. Don't convert tables
  to anything else.

Don't over-decorate. The content is technical prose + code; components are for
diagrams, callouts, procedures, file trees, and navigation — not every paragraph.

### Readability & polish (the bar: "best as possible, enjoyable to read")
- This page should be a pleasure to read, not a wall of text. Lead each section with
  a short, plain-spoken sentence that says why it matters before diving into detail.
- Break long runs of prose with the right component: a `<Mermaid>` for a flow you're
  describing in words, a `:::note`/`:::tip` for an aside, `<Steps>` for a procedure,
  a table for anything you're enumerating in parallel.
- Keep the author's voice — direct, concrete, a little opinionated. Smooth any
  sentence left awkward by the tone-down edits; don't leave dangling "the codebase"
  references that lost their antecedent.
- Code blocks: prefer a focused excerpt with a `title=` and highlighted lines over a
  giant dump. If the source pasted 30 lines to make a 5-line point, trim to the point.
- Every page should stand on its own and read well start-to-finish.

### Calibration decisions (from the approved pilot)
- Tone-down level: the pilot was approved as-is. Match that exact level — measured,
  not aggressive. multigres stays as the running example; drop insider/citation
  framing. (See orientation.mdx, project/01-architecture-request-flow.mdx, and
  language/01-packages-modules-imports.mdx — already ported — as the reference bar.)
- Version numbers: "Go 1.25.x" → "Go 1.25" is fine; don't fuss over patch versions.

Canonical live examples to match style (READ at least one before porting):
- `src/content/docs/example-course/04-diagrams.mdx` — Mermaid usage.
- `src/content/docs/example-course/02-code-and-tabs.mdx` — code blocks, Tabs, Steps.
- `src/content/docs/example-course/03-cards-and-media.mdx` — Cards, LinkCard, FileTree, Badge.

---

## 7. Link rewriting

The source uses relative `.md` links. Rewrite EVERY internal link to its slopnotes
route. The rule: `<track>/<filename without .md>` → `/go-guide/<track>/<filename>/`.

Slug map (source path → site route):
- `00-orientation.md`, `../00-orientation.md`, `README.md`         → `/go-guide/orientation/`
- `language/NN-name.md`  (e.g. `03-interfaces-composition.md`)     → `/go-guide/language/NN-name/`
- `project/NN-name.md`                                             → `/go-guide/project/NN-name/`
- `tooling/NN-name.md`                                             → `/go-guide/tooling/NN-name/`
- `reference/cheatsheet.md`                                        → `/go-guide/reference/cheatsheet/`
- `reference/glossary.md`                                          → `/go-guide/reference/glossary/`
- `reference/idioms-and-gotchas.md`                                → `/go-guide/reference/idioms-and-gotchas/`
- `reference/further-reading.md`                                   → `/go-guide/reference/further-reading/`

Relative prefixes (`../`, `./`) are dropped — always use the absolute `/go-guide/...`
route. Anchors carry over: `…/05-errors.md#wrapping` → `/go-guide/language/05-errors/#wrapping`.
External links (https://…) are left unchanged. Links to the source repo on GitHub
(e.g. github.com/multigres/multigres) stay as-is.

---

## 8. Quality checklist (verify before returning)

- [ ] Frontmatter present; source `# H1` removed; good `description`.
- [ ] Tone-down applied per §2 (less contributor/insider framing; multigres kept as example).
- [ ] Every ```text ASCII diagram converted: flow→`<Mermaid>`, tree→`<FileTree>`. None left.
- [ ] `> **Gotcha**`/asides → `:::caution`/`:::note`/`:::tip`.
- [ ] Every prose `{` and `<` is inside backticks/code (MDX-safe). Code blocks have languages + titles where prose names a file.
- [ ] All internal links rewritten to `/go-guide/...` routes.
- [ ] Only-used components imported; imports right after frontmatter.
- [ ] Technical content faithful; nothing invented.

## 9. Return format

Write the `.mdx` file to the target path. Then return a concise report:
- Target path written.
- Diagrams converted: how many → Mermaid (with types) and → FileTree.
- Notable tone-down changes you made.
- Anything you were unsure about (technical facts you preserved verbatim, links you
  couldn't map, MDX edge-cases) so the reviewer can check.
