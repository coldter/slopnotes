# Porter Brief — kotlin-java-labs → slopnotes "Kotlin Backend" course

You are porting ONE source page from `/home/kuldeep/code/oss/exp-ai-kotlin-java-labs/`
into the slopnotes Astro Starlight site at `/home/kuldeep/code/oss/slopnotes/`,
converting it to a polished **MDX** page that uses slopnotes' native components.

This is **not** a lift-and-shift. You preserve the technical substance and the
teaching flow, but you (1) turn the signature TS/Go/Kotlin code comparisons into
**synced Tabs**, (2) replace ASCII art with real components, (3) use native
Starlight/slopnotes components idiomatically, (4) clean up source-repo artifacts,
and (5) make the page build cleanly as MDX.

Read this WHOLE brief before you touch anything. You will be told whether you are
porting a **LESSON** (a module README) or an **EXERCISE** (an exercise README +
its worked solution). The shared rules (§3–§7) apply to both; §8 is lesson-only,
§9 is exercise-only.

---

## 1. The course

The source is an **example-driven** course: *"Kotlin & JVM Backend for
TypeScript/Go Developers."* It teaches an experienced TS/Go backend dev how to be
productive on the JVM, **every concept shown TypeScript-vs-Go-vs-Kotlin side by
side**, with runnable exercises. It is being ported as a single slopnotes course
called **"Kotlin Backend"** living under `src/content/docs/kotlin-backend/`.

The audience identity — a working TS/Go dev mapping known concepts to Kotlin — is
the whole point. **Keep the comparison pedagogy.** Keep the direct, concrete,
slightly opinionated voice ("Honest take: …").

Structure (already scaffolded):
- `kotlin-backend/overview.mdx` — the course intro (from the root README).
- `kotlin-backend/NN-name.mdx` — one **lesson** page per module (20 of them).
- `kotlin-backend/NN-name/<exercise>.mdx` — one **exercise** page per exercise,
  nested under its module. Exercises are NOT in the sidebar; the lesson links to
  them via a "Practice" card grid (you build that — see §8).

---

## 2. Content cleanup & framing (this is a content change — read it)

The source is a clean standalone course, so there's no heavy framing to strip
(unlike a contributor doc). But DO clean these up:

- **Machine-specific absolute paths** → genericize. e.g.
  `cd /home/kuldeep/code/learning/kotlin/course/shared-infra` → `cd shared-infra`.
  Never leak a real user home path. (Mostly in module 01, but watch everywhere.)
- **Cross-references to the repo's own file layout** ("see `exercises/json-cli/README.md`",
  "Next Module: [02 …](../02-…/README.md)") → rewrite to slopnotes routes (§7) or
  fold into the navigation cards (§8). Don't leave raw `../NN/README.md` links.
- **Repetition**: the source repeats setup boilerplate (SDKMAN, docker compose up)
  across modules. In a non-intro module, a one-line reminder + a link to the
  Overview/module-01 beats re-pasting the whole block. Trim 30-line dumps to the
  point being made.
- **"Table of Contents" hand-written lists** at the top of each README → DELETE
  them. Starlight auto-generates an on-page ToC in the right sidebar; a duplicate
  is noise.
- Technical accuracy: never invent or alter a technical fact, API, or version. If
  unsure, keep the original statement (lightly reworded) rather than guessing.

Net effect: each page stands on its own, reads as a polished lesson, and contains
no artifacts of "this used to be a folder of READMEs."

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

- `title`: the page's H1 — DROP the source's leading `# Module NN: …` line
  (frontmatter `title` renders the H1; a second `#` duplicates it). For a lesson,
  title is the clean module name (e.g. "Dev Environment & First Project", NOT
  "Module 01: …"). Keep `##`/`###` headings.
- `description`: a fresh, concrete one-liner.
- `sidebar.order`: given to you. (Exercise pages are off-sidebar; still include
  `order` harmlessly, it's ignored.)

Imports (only what you use) go immediately after the frontmatter:

```mdx
import Mermaid from "~/components/Mermaid.astro";
import { Tabs, TabItem, Steps, Card, CardGrid, LinkCard, Badge, FileTree, Aside } from "@astrojs/starlight/components";
```

---

## 4. MDX SAFETY (build-breaking — do not skip)

MDX parses `{` and `<` specially. Plain Markdown that was fine in `.md` will break
the build in `.mdx`. **Kotlin/Java content is FULL of `<…>` generics and `?`
nullables in prose — this is the #1 risk here.** Fix every one of these in PROSE
(text outside fenced code blocks):

- **Angle brackets** `<…>` in prose → wrap in backticks. `List<String>`,
  `Map<String, User>`, `Flow<T>`, `Result<T, E>`, `suspend () -> Unit`,
  `Comparable<T>`, `Channel<Int>` — ALL must be `` `List<String>` `` etc. A bare
  `MutableList<String>` in a sentence WILL break the build.
- **Curly braces** `{ … }` in prose → wrap in backticks. Lambda shorthand
  `{ it.name }`, `${variable}` string templates, `data class Foo { … }` mentioned
  inline → backtick them.
- **Bare `->`** in prose is usually fine, but a `when`/lambda arrow shown inline
  (`x -> y`) reads best backticked, and anything mixing `<`/`{` MUST be backticked.
- Inside **fenced code blocks** (```kotlin, ```bash, ```text) nothing needs
  escaping — code is literal. PREFER putting tricky syntax in code spans/blocks.
- **`<details><summary>`**: works in MDX but the form is STRICT. Use EXACTLY this
  shape — NO blank lines inside, `</details>` glued to the end of the single-line
  answer:
  ```
  <details><summary>Question text?</summary>
  Answer on one contiguous line (no blank lines), ending with the close tag.</details>
  ```
  No blank line after `</summary>` or before `</details>`; don't put `</details>`
  on its own line. (Prefer `:::note[…]` asides over `<details>` unless it's
  genuinely a collapsible Q&A.)
- Component tags must be balanced. No stray `<` that looks like a tag.

When in doubt, wrap the token in backticks. After porting, scan EVERY line of prose
for `{` and `<`.

**Never** end the file with stray tool/XML output (e.g. a literal `</…>` tag). The
file ends with your last line of MDX content and a trailing newline — nothing else.

---

## 5. The signature move: TS/Go/Kotlin comparisons → synced Tabs

The source's defining pattern is a concept shown in two or three languages as
consecutive code blocks, usually labeled **TypeScript:** / **Go:** / **Kotlin:**,
often followed by a "**Key Differences**" list. Convert each such group to ONE
synced Tabs block:

```mdx
<Tabs syncKey="lang">
  <TabItem label="TypeScript">

```typescript
const name = "Alice";
```

  </TabItem>
  <TabItem label="Go">

```go
name := "Alice"
```

  </TabItem>
  <TabItem label="Kotlin">

```kotlin
val name = "Alice"
```

  </TabItem>
</Tabs>
```

HARD RULES (so cross-page sync works):
- **Always `syncKey="lang"`.** Picking "Go" on one block selects Go on every block
  across the whole site — exactly the UX a Go dev wants.
- **Exact labels, exact order: `TypeScript`, `Go`, `Kotlin`.** Always that order.
  If the source only shows two languages, include just those two (still in that
  relative order, still those exact labels). Never relabel ("TS", "Golang").
- **Blank line after `<TabItem …>` and before `</TabItem>`** — the fenced code
  block needs blank lines around it inside the tab or MDX mis-parses it.
- Preserve each block's inline `// comments` — they carry the teaching.
- Keep the "**Key Differences**" prose immediately AFTER the Tabs (don't tab it).

WHEN NOT to tab:
- A single-language snippet (Kotlin-only example, a bash command, a config file) →
  just a normal fenced code block, no Tabs.
- A **concept-mapping table** (columns like `npm | go | Gradle`, or
  `TypeScript | Go | Kotlin | Notes`) → KEEP AS A GFM TABLE. Tables are great and
  must not become Tabs or code.
- Trivial one-liners where the comparison is the whole point and tabbing hides it
  — rare; use judgment, but default to Tabs for any 2–3 block language triad.

---

## 6. ASCII art → the RIGHT component

The source uses fenced ```text / ``` blocks for diagrams. Classify each:

### 6a. Directory / file trees → `<FileTree>` (NOT Mermaid)
Any `├──`/`└──`/indented path listing of a project layout:

```mdx
<FileTree>
- build.gradle.kts deps + build config
- settings.gradle.kts project name, module includes
- src/
  - main/kotlin/ source code
  - test/kotlin/ tests
- gradlew wrapper script
</FileTree>
```

Mark the focused entry with `**bold**`; trailing text after a name becomes a
comment. Trailing `/` = directory; `…` = truncation. Convert the inline `# comment`
annotations in the source tree into that trailing comment text. There are MANY of
these (project structures everywhere) — convert every one.

### 6b. Flow / architecture / pipeline / sequence diagrams → `<Mermaid>`
Boxes-and-arrows, data flow, request paths, producer→topic→consumer pipelines,
state machines, fan-out/fan-in:

```mdx
<Mermaid title="Order pipeline" code={`
flowchart LR
  P["Producer"] -->|"orders topic"| K["Kafka"]
  K --> C["Consumer"]
`} />
```

- Pick the type: boxes+arrows/zones → `flowchart LR`/`TB` (use `subgraph` for
  groupings); messages between actors over time → `sequenceDiagram`; lifecycle/
  status → `stateDiagram-v2`.
- Node text with special chars → quote it: `A["HttpClient (JDK 11+)"]`.
- Edge labels → `A -->|"gRPC"| B`.
- `title` short; pass `height={360}` for small diagrams, `height={560}` for tall.
- The `code={` … `}` is a JS template literal: avoid a literal backtick or `${`
  inside it.

### 6c. Annotation / call-out ASCII → keep as a ```text``` code block
Some ASCII isn't a tree or a flow — it's a *labeled annotation* pointing arrows at
parts of a token (e.g. `group:artifact:version` with `│ ├──` captions underneath).
That doesn't map to Mermaid or FileTree. Keep it as a literal ```text``` fenced
block. Don't force it into a diagram.

No ASCII tree or flow should survive as raw ```text```. Only genuine annotation
art (6c) stays fenced.

---

## 7. Link rewriting

Rewrite EVERY internal link to its slopnotes route. Drop relative `../`/`./`
prefixes — always use the absolute `/kotlin-backend/...` route. Anchors carry over.
External `https://…` links stay unchanged.

Slug map (source path → site route):
- root `README.md`, `../README.md`                          → `/kotlin-backend/overview/`
- a module `../NN-name/README.md` or `./NN-name/README.md`  → `/kotlin-backend/NN-name/`
  (e.g. `../08-spring-boot/README.md` → `/kotlin-backend/08-spring-boot/`)
- an exercise `exercises/<name>/README.md` (within module NN) → `/kotlin-backend/NN-name/<name>/`
  (e.g. from module 05: `exercises/concurrent-fetcher/README.md`
   → `/kotlin-backend/05-coroutines/concurrent-fetcher/`)
- a cross-module exercise `../NN-name/exercises/<x>/README.md` → `/kotlin-backend/NN-name/<x>/`

The 20 module slugs (use verbatim): `01-dev-environment`, `02-kotlin-language`,
`03-collections-and-fp`, `04-oop-generics-java-interop`, `05-coroutines`,
`06-flow-reactive`, `07-gradle-build-system`, `08-spring-boot`, `09-ktor`,
`10-database-postgresql`, `11-redis-caching`, `12-kafka-events`, `13-testing`,
`14-security-auth`, `15-api-design`, `16-observability`, `17-advanced-kotlin`,
`18-deployment`, `19-compose-multiplatform`, `20-capstone`.

---

## 8. LESSON pages — authoring spec

You are porting a module `README.md` to `kotlin-backend/NN-name.mdx`.

1. **Frontmatter**: clean title (no "Module NN:"), fresh description, the `order`
   you're given.
2. **Delete the hand-written Table of Contents** (§2).
3. **Convert all language triads to synced Tabs** (§5) and concept tables stay
   tables. This is the bulk of the work — be thorough and consistent.
4. **Convert all ASCII** (§6): trees → FileTree, flows → Mermaid, annotations stay.
5. **Native components & readability** (§10).
6. **Code blocks**: keep the language; add `title="src/main/kotlin/…/Foo.kt"` when
   the prose names the file. Use `{3-5}` highlights for lines the prose calls out.
   Trim giant pastes to the illustrative core.
7. **The trailing "## Exercises" section** of the module → rebuild it as a
   "Practice" section: a short intro sentence + a `<CardGrid>` of `<LinkCard>`s,
   one per exercise, pointing at the exercise routes (§7), with the "What you'll
   practice" bullets as the card `description`. Example:
   ```mdx
   ## Practice

   <CardGrid>
     <LinkCard title="JSON CLI Tool" href="/kotlin-backend/01-dev-environment/json-cli/"
       description="Build a Gradle project from scratch: deps, stdin, data classes." />
   </CardGrid>
   ```
   You'll be told the exact exercise slug(s) and titles for your module.
8. **Drop the "Next Module" footer link** — the site auto-paginates. (If the source
   had a "Quick Reference Card" at the very end, keep it; it's useful content.)

---

## 9. EXERCISE pages — authoring spec

You are AUTHORING a walkthrough page at `kotlin-backend/NN-name/<exercise>.mdx`
from TWO inputs in the source exercise directory: the `README.md` (Goal /
Requirements / Hints / Run / Test / Stretch) AND the worked solution code under
`src/` (the `.kt` files, `build.gradle.kts`, etc.). Read BOTH. This is synthesis,
not transcription — you're turning "here's the assignment + here's the answer key"
into a polished, example-driven walkthrough.

Page shape:
1. **Frontmatter**: `title` = the exercise name (e.g. "Concurrent HTTP Fetcher"),
   a concrete `description`.
2. **A back-link card at the top** so the off-sidebar page is anchored:
   ```mdx
   <LinkCard title="← Module NN: <Module Name>" href="/kotlin-backend/NN-name/" />
   ```
3. **Goal**: a tight 1–2 sentence framing (from the README's Goal).
4. **What you'll build / Requirements**: the README's requirements as a list (or
   `<Steps>` if it's sequential). Keep the TS/Go analogies the source draws.
5. **The worked solution** — the centerpiece:
   - A `<FileTree>` of the project layout (from the real `src/` tree).
   - The key source file(s) as code blocks WITH `title="src/main/kotlin/…/Main.kt"`,
     each preceded by a sentence on what it does. Walk through the interesting
     parts in prose (highlight lines with `{n-m}` where you discuss them).
   - For a SMALL solution (1–2 files), show it in full. For a LARGE multi-file
     solution (e.g. the capstone, 30+ files), show the architecture (FileTree +
     a Mermaid if there's a flow) and the 3–6 most instructive files only — say
     explicitly that you're showing the highlights, don't dump every file.
   - Faithfully reproduce the solution code (it's real, runnable code — don't
     rewrite its logic; you may trim imports/boilerplate and add a `// …` elision).
6. **Run / Test**: as a small `<Steps>` or code blocks (`./gradlew run`, etc.).
   Note any infra prerequisite (`cd shared-infra && docker compose up -d`).
7. **Stretch goals**: the README's stretch list, nicely as a `:::tip[Stretch goals]`
   aside or a bullet list.

Keep it example-first: the reader should see real, working Kotlin and understand
how it maps from what they'd write in TS/Go.

---

## 10. Native component usage & readability (the bar: "best as possible, enjoyable")

- **Admonitions (asides):** map `> **Note** …`, "Honest take:", warnings, tips:
  - warnings / "don't" / "never" / gotchas → `:::caution[…]`
  - neutral asides / "note that" → `:::note`
  - tips / best-practice / "Honest take" recommendations → `:::tip`
  - real danger / data-loss → `:::danger`
  Keep a custom label in brackets when useful: `:::tip[Honest take]`.
- **Steps:** ordered do-this-then-that procedures (install flows, setup) → wrap the
  ordered list in `<Steps>…</Steps>`.
- **Tabs (non-language):** "pick one of N" alternatives that AREN'T the language
  triad (e.g. "IntelliJ vs VS Code", "macOS vs Linux") → `<Tabs>` WITHOUT the
  `lang` syncKey (use a different syncKey like `syncKey="os"` or none). Reserve
  `syncKey="lang"` exclusively for TypeScript/Go/Kotlin code triads.
- **LinkCard / CardGrid:** navigation and the Practice grid (§8). 
- **Badge:** small inline status labels only; don't overuse.
- **GFM tables:** keep as Markdown tables — they render great.
- Lead each section with a short plain sentence on why it matters before the code.
- Don't over-decorate: components are for comparisons, diagrams, callouts,
  procedures, file trees, and navigation — not every paragraph.

Canonical live examples already in the repo to match style (READ at least one
before porting):
- `src/content/docs/go-guide/orientation.mdx` — Mermaid, tables, asides, voice.
- `src/content/docs/go-guide/language/01-packages-modules-imports.mdx` — code
  blocks with titles, FileTree, callouts.
- `src/content/docs/go-guide/language/07-concurrency.mdx` — dense technical page,
  `<details>` Q&A form, Mermaid.

---

## 11. Quality checklist (verify before returning)

- [ ] Frontmatter present; source `# Module NN:` H1 removed; clean title; good description.
- [ ] Hand-written ToC deleted; machine-specific paths genericized; "Next Module" footer dropped.
- [ ] Every TS/Go/Kotlin code triad → `<Tabs syncKey="lang">` with exact labels in order TypeScript/Go/Kotlin and blank lines around the fences. Concept tables kept as tables.
- [ ] Every ASCII tree → `<FileTree>`; every flow → `<Mermaid>`; only annotation art left as ```text```.
- [ ] Asides mapped to `:::note`/`:::tip`/`:::caution`/`:::danger`; procedures → `<Steps>`.
- [ ] EVERY prose `<…>` generic and `{…}` is backtick-wrapped (MDX-safe). Code blocks have languages + titles where prose names a file.
- [ ] All internal links rewritten to `/kotlin-backend/...` routes.
- [ ] (Lesson) Practice CardGrid built linking the module's exercises.
- [ ] (Exercise) Back-link card at top; FileTree + key solution files with titles; Run/Test; Stretch.
- [ ] Only-used components imported; imports right after frontmatter.
- [ ] No stray tool/XML output anywhere; file ends with content + newline.
- [ ] Technical content faithful; nothing invented.

## 12. Return format

Write the `.mdx` file to the target path. Then return a concise report:
- Target path written.
- Counts: language Tabs created, FileTrees, Mermaid diagrams (with types).
- Cleanup applied (paths genericized, ToC removed, repetition trimmed).
- Anything you were unsure about (facts preserved verbatim, links you couldn't map,
  MDX edge-cases) so the reviewer can check.
