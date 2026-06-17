# Porter Brief — /home/kuldeep/code/Auth → slopnotes (two courses)

You are porting ONE source page from `/home/kuldeep/code/Auth/` into the slopnotes
Astro Starlight site at `/home/kuldeep/code/oss/slopnotes/`, converting it to a
polished **MDX** page that uses slopnotes' native components.

This is **not** a lift-and-shift, and it is **not** a mechanical port either. The
source is a set of *Notion-exported design notes* (an architecture doc, an
integration guide, and a 12-file design series). It was written as working notes /
an internal RFC. Your job is to **restructure it into clean, didactic teaching
prose** that reads like a polished course chapter — while preserving every piece of
technical substance and every design decision. See §2 for exactly what that means.

Read this WHOLE brief before you touch anything. You will be told which COURSE and
which PAGE you are porting, the exact source file + line range, and the exact target
path + sidebar order. Shared rules (§2–§7, §10) apply to every page. §8 is the
chapter authoring spec; §9 is the reference-page (decision log / gotchas) spec.

---

## 1. The two courses

The source is **two distinct systems**, ported into **two separate slopnotes
courses**. They share a theme (modern identity + multi-tenancy) but are different
stacks — never imply they are the same system.

### Course A — "Auther: Centralized Auth" (route root `/auther/`)
A standalone, self-hostable **authentication + authorization server / IdP** (an
Auth0 / Keycloak / Ory alternative), built on Next.js 16 + better-auth, with a
Zanzibar-inspired ReBAC + ABAC permission engine, Lua pipelines, and webhooks.
Source = two companion files:
- `ARCHITECTURE 344e920b046e80c883acdeda408d1446.md` → **Part 1 · The Auther Server**
  (what Auther is and how each subsystem works, incl. client-integration scenarios).
- `integration-guide.md` → **Part 2 · Integrating Auther Into Your App** (the
  Shadow-User pattern + a file-by-file Hono/Drizzle walkthrough).

Audience: senior backend engineers adopting or operating a centralized IdP. The
running examples use a Hono/Node monorepo (`hono-node-template-2026`), `Payload CMS`
as a reference client, and `acme`-style placeholders. Keep them.

### Course B — "Multi-Tenant SaaS on Cloudflare" (route root `/multi-tenant/`)
A *different* system: converting a single-tenant template into a production
multi-tenant SaaS on **Cloudflare Workers** (Workers + Hyperdrive Postgres + Better
Auth + Hono + Drizzle + TanStack). Source = the 12-file `2026-05-05-multi-tenancy/`
series. Audience: senior engineers designing multi-tenant infra on the edge. The
running placeholders are `acme` (tenant), `example.com` (platform domain),
`app.acme.com` (custom domain). Keep them consistent — see §2 (canonical names).

**Tech facts to preserve verbatim (never invent or alter):** version numbers
(Next.js 16, Better Auth v1.6, Python/Node versions, CF product tiers Pro/Business/
Enterprise), API names, header names (`Cf-Access-Jwt-Assertion`, `x-webhook-*`),
claim names (`aud`, `iss`, `org.sessionVersion`, `abac_required`), table/column
names, decision IDs (D1–D78). If unsure about a fact, keep the source's statement
(lightly reworded) — do **not** guess.

---

## 2. Restructure into clean teaching prose (this is the core of the job)

The source reads like an internal design review: first-person-plural ("we picked
X", "we do NOT use Y"), MUST/NEVER/ALWAYS imperatives, "the validator caught this in
v3.2", strikethrough retracted ideas, "Related:" blockquotes, hand-written ToCs.
**Rewrite that voice into calm, explanatory teaching prose** without losing any
fact or decision:

- **Decisions stay; the RFC framing goes.** "We picked Cloudflare for SaaS because
  we're already on Workers" → "Cloudflare for SaaS handles hostname management, and
  because the stack already runs on Workers the integration is a natural fit." Keep
  the *reason*; drop the war-room voice. Prefer second person / neutral third person.
- **Lead each section with one plain sentence on why it matters** before diving into
  mechanics or code. The reader should always know what problem this solves.
- **Keep all the engineering judgment** — the tradeoffs, the "why not the obvious
  alternative", the gotchas inline. That insight is the whole value. Just present it
  as teaching ("A tempting shortcut is X, but it breaks Y, so…") rather than as a
  logged decision.
- **Do NOT preserve**: "Round 1/2/3 validation", "the validator agent caught",
  version-evolution narration (v3.1→v3.3), strikethrough retracted decisions in the
  body, internal-doc-drift notes, and references to the absent `../*-design.md`
  mega-doc or to `docs/9_ha.md`. Fold their *conclusions* into the prose; drop the
  meta-narrative. (Exception: the dedicated Decisions and Gotchas reference pages —
  see §9 — keep that material, cleaned up.)

### Notion / export artifacts to strip or fix (every page)
- **Double H1.** Each source file opens with `# <filename>` (the Notion page title)
  then the real `# <Real Title>`. DROP BOTH `#` lines — frontmatter `title` renders
  the H1. Keep `##`/`###` subheads.
- **Hand-written "Table of Contents" / "Quick links" lists** → DELETE (Starlight
  auto-generates the on-page ToC and the sidebar).
- **"Related: [a] · [b]" blockquotes** (with a trailing empty `>` line) → DELETE the
  blockquote. If a link in it is genuinely useful mid-prose, fold it into a sentence
  as a real route link instead.
- **Broken cross-links — fix ALL of them (§7):**
  - `about:blank#1-technology-stack` (Course A) → the right `/auther/...` route.
  - `[01-architecture](01-architecture%20357e...md)` (URL-encoded hex filenames,
    Course B) → the right `/multi-tenant/...` route.
  - `[03-auth-and-sso.md](./03-auth-and-sso.md#part-1-better-auth-config)` (clean but
    **broken** `./NN-name.md` links, Course B) → `/multi-tenant/auth-sso/#...`.
- **Curly quotes / smart apostrophes** (`'` `"` `"`) in prose → straight quotes.
  Inside code blocks, fix them too if the code wouldn't run otherwise (e.g. a Lua
  string `'@example.com$'` that became a curly quote).
- **`Bearer${token}` / `Basic${creds}` bug** (Course A, the export dropped the
  space): restore the space → `` `Bearer ${token}` `` / `` `Basic ${creds}` `` in
  code. This is a real correctness fix.
- **Machine-specific absolute paths** (`/home/<user>/…`) → genericize. Repo/project
  paths (`apps/server/src/...`, `packages/db/...`, `src/lib/auth.ts`) are correct —
  keep them.
- **Stale repo line-number references** ("see lines 222–239 of instance.ts") → drop
  the line numbers; keep the prose pointer ("in the existing `instance.ts`").

### Canonical names (Course B — make consistent across pages)
Platform domain `example.com`; default tenant subdomain `acme.app.example.com`;
custom domain `app.acme.com`; admin host `admin.example.com`; tenant slug `acme`.
The five deployable units: `apps/auth`, `apps/server`, `apps/admin` (Workers) +
`apps/app`, `apps/admin-ui` (static SPAs). Packages: `@repo/tenancy`,
`@repo/auth-tokens`, `@repo/authorization`, `packages/ui`. Use these verbatim.

Net effect: each page stands alone, reads as a polished lesson, and shows no trace
of "this used to be an exported Notion design note."

---

## 3. Output: file location & frontmatter

Write a `.mdx` file (NOT `.md`) at the EXACT target path you are given. Every file
starts with frontmatter:

```mdx
---
title: <Page Title>
description: <one sentence, ~10-20 words, plain — used in SEO and link cards>
sidebar:
  order: <number>
---
```

- `title`: a clean name (e.g. "Tenant Resolution", "The Shadow-User Pattern", "ReBAC
  & the Permission Engine"). NOT "01 — Architecture" or "# README". Drop any
  leading `NN —` numbering and the source's double H1.
- `description`: a fresh, concrete one-liner you write.
- `sidebar.order`: the number you're given.

Imports (only the ones you actually use) go immediately after the frontmatter:

```mdx
import Mermaid from "~/components/Mermaid.astro";
import { Tabs, TabItem, Steps, Card, CardGrid, LinkCard, Badge, FileTree } from "@astrojs/starlight/components";
```

Asides use the `:::note` / `:::tip` / `:::caution` / `:::danger` Markdown syntax — no
import needed.

---

## 4. MDX SAFETY (build-breaking — do not skip)

MDX parses `{` and `<` specially. Plain Markdown that was fine in `.md` will break
the build in `.mdx`. **This source is TypeScript-heavy — generics like
`Record<string, string[]>`, `Promise<Session>`, `autherAuth<User>()`, object
literals `{ aud, iss }`, and template expressions `${token}` in PROSE are the #1
risk.** Fix every one of these in PROSE (text OUTSIDE fenced code blocks):

- **Angle brackets** `<…>` in prose → wrap in backticks. TS generics
  (`Record<string, string[]>`, `Array<Thunk>`, `Promise<T>`), inline JSX/HTML tags
  (`<TenantLogo />`, `<details>`), and placeholders (`<your-domain>`, `{slug}`) all
  must be backticked. A bare `<User>` reads as an unclosed JSX tag and breaks the
  build.
- **Curly braces** `{ … }` in prose → wrap in backticks. Object literals
  (`{ organizationId, slug }`), claim shapes (`{ aud, iss, org }`), template
  expressions (`${tenant.host}`), and the `{slug}` / `{id}` URL placeholders — ALL
  must be backticked inline. A bare `{ aud, iss }` in a sentence WILL crash the build
  (often only at render time, see below).
- **The render-time trap:** a bare `{...}` can pass a single-file compile and still
  **crash at render** with `X is not defined` (MDX treats `{foo}` as a JS
  expression). So: backtick braces even inside `<FileTree>` comments and component
  text. When in doubt, backtick.
- **Inside fenced code blocks** (```ts, ```json, ```sql, ```bash …) nothing needs
  escaping — code is literal. PREFER putting tricky syntax in code spans/blocks
  rather than bare prose.
- **`<details><summary>`**: works in MDX but the form is STRICT — no blank lines
  inside, `</details>` glued to the end. Prefer `:::note[…]` asides over `<details>`.
- Component tags must be balanced; no stray `<` that looks like a tag.
- **Never** end the file with stray tool/XML output (e.g. a literal `</…>`,
  `</content>`, `</invoke>`, or `antml:` text). The file ends with your last line of
  MDX content and a single trailing newline.

After porting, scan EVERY line of prose for `{`, `}`, and `<`.

---

## 5. The signature move: correct code highlighting + file titles

These courses are **single-stack TypeScript**, with supporting languages. The
signature quality move is **clean, correctly-highlighted, file-titled code blocks**.
For every fenced code block:

1. **Set the right language.** Safe languages (use these):
   `ts`, `tsx`, `js`, `json`, `jsonc`, `sql`, `lua`, `go`, `swift`, `python`,
   `bash`, `yaml`, `toml`, `ini`, `http`, `nginx`, `dockerfile`, `diff`, `text`.
   - **`ts` vs `tsx`:** the source over-tags TypeScript as ` ```tsx ` even when there
     is no JSX. Use ` ```ts ` for ordinary TypeScript (config objects, middleware,
     Drizzle schema, services). Use ` ```tsx ` ONLY when the block actually contains
     JSX (`<Component />`).
   - **JSON with `// comments`** (some "JSON" model/config blocks have comments) → tag
     it ` ```jsonc ` so it stays valid-highlighted, OR ` ```json ` if you remove the
     comments. Wrangler config with comments is ` ```jsonc `.
   - If a language isn't in the safe list, use ` ```text ` — never leave an
     unsupported lang tag, it breaks the build.
2. **Add a `title` when the code is a file.** The source marks files inline, e.g.
   `packages/db/src/schema/auth.ts`, `src/lib/auth.ts`, `apps/admin/wrangler.jsonc`,
   or a `// File:` / `# path` comment. Lift that path into the fence:
   ````
   ```ts title="apps/server/src/middlewares/auth-context.ts"
   import { jwtVerify } from "jose";
   ...
   ```
   ````
   A shell sequence or a generic snippet needs no title.
3. **Before / after diffs.** The integration guide (Course A Part 2) shows many
   "before" and "after" versions of a file. Render them as **two consecutive titled
   blocks**, each preceded by a one-line label in prose ("Before — the local
   better-auth instance:" / "After — verify Auther's JWT:"), OR as a single
   ` ```diff ` block when it's genuinely a small diff. Do NOT use Tabs for
   before/after (it's a transformation, not a pick-one choice).
4. **Highlight the lines the prose calls out** with `{3-5}` / `{3,7}` markers. Use
   sparingly, only where the text discusses specific lines.
5. **Trim giant pastes** to the illustrative core with a `// … (rest unchanged)`
   elision. Faithfully reproduce real logic; don't rewrite or invent it. Truncated
   source (`...`, `{...}` placeholders) — keep the elision, it's intentional.

**Genuine paired alternatives → Tabs.** Only when the source presents two real
*alternatives* a reader picks between (e.g. "BFF pattern vs direct-token pattern",
"stateless vs stateful verifier", "URL-path tenancy vs JWT-claim tenancy", "Node.js
vs Go middleware") use a synced Tabs block:

```mdx
<Tabs syncKey="approach">
  <TabItem label="BFF (recommended)">

  ```ts
  // confidential client holds tokens server-side
  ```

  </TabItem>
  <TabItem label="Direct token">

  ```ts
  // SPA holds the access token
  ```

  </TabItem>
</Tabs>
```

Blank lines around the fences inside each `<TabItem>`. Don't tab a lone block, and
don't invent an alternative the source didn't write. Most code is a single titled
block — that's the norm; Tabs are the exception.

---

## 6. ASCII art → the RIGHT component

The source uses fenced ` ``` ` blocks for diagrams. Classify each:

### 6a. Directory / file trees → `<FileTree>` (NOT Mermaid)
Any `├──`/`└──`/indented path listing of a repo, package, or `src/` layout:

```mdx
<FileTree>
- apps/
  - auth/ **Better Auth worker (service-binding only)**
  - server/ public tenant-facing API + cron reconciler
  - admin/ operator API behind Cloudflare Access
- packages/
  - tenancy/ host → organization resolution
</FileTree>
```

Mark a focused entry with `**bold**`; trailing text after a name becomes a comment.
Trailing `/` = directory; `…` = truncation. Convert inline `# comment` annotations in
the source tree into that trailing comment text. **Backtick any `{…}` or `<…>` in a
comment** (§4). The Auther `src/` tree and the multi-tenant `apps/`+`packages/`
layouts appear repeatedly — convert every one.

### 6b. Flow / architecture / topology / sequence / state diagrams → `<Mermaid>`
Boxes-and-arrows, worker topologies, request lifecycles, data flow, the permission
resolution algorithm, hostname lifecycle state machines, OAuth/SSO sign-in
sequences, the microservice mesh:

```mdx
<Mermaid title="Worker topology" height={520} code={`
flowchart TB
  Access["Cloudflare Access"] --> Admin["apps/admin (Hono)"]
  Admin -->|"AUTH binding"| Auth["apps/auth (Better Auth)"]
  Admin -->|"API binding"| Server["apps/server (Hono)"]
  Server --> Auth
  Auth --> DB["PostgreSQL via Hyperdrive"]
`} />
```

- Pick the type: boxes+arrows/zones → `flowchart LR`/`TB` (use `subgraph` for
  groupings like the two perimeters); messages between actors over time (sign-in
  flows, request traces, the 6 end-to-end flows, the OAuth scenarios) →
  `sequenceDiagram`; lifecycle/status machines (custom-hostname
  `awaiting_txt → pending_cloudflare → active`, document/permission states) →
  `stateDiagram-v2`.
- Quote node text with special chars: `A["apps/auth (Better Auth)"]`. Edge labels:
  `A -->|"Cf-Access-Jwt-Assertion"| B`. Do NOT put a literal backtick or `${` inside
  the `code={` … `}` template literal.
- `height={360}` small, `height={520}` tall.

**Specific high-value diagrams to build** (don't leave these as ASCII):
- Course B README "Architecture at a glance" and 01's "Worker topology" → `flowchart`.
- Course B 01's five "Request flow examples" → `sequenceDiagram` each (great content).
- Course B 04 custom-hostname lifecycle enum → `stateDiagram-v2`.
- Course A's 8-step permission-resolution algorithm → `flowchart TB` (or `<Steps>` if
  it reads better as a procedure); the microservice-mesh box-art → `flowchart`; the
  permission-check decision tree (`in permissions? → abac_required? → call`) →
  `flowchart TB`.

### 6c. Annotation / call-out ASCII → keep as a ```text``` block
Labeled annotation art (arrows pointing at parts of a token, an aligned callout) that
is neither a tree nor a flow → keep as a literal ` ```text ` block. Only genuine
annotation art stays fenced; no tree or flow should survive as raw ` ```text `.

The runtime "traces" in the integration guide (numbered step lists like "1. browser
→ /authorize 2. …") read best as a `<Steps>` ordered list or a `sequenceDiagram` —
not as a raw text block. Use judgment: a linear list of steps → `<Steps>`; an
actor-to-actor message exchange → `sequenceDiagram`.

---

## 7. Link rewriting

Rewrite EVERY internal cross-reference to its absolute slopnotes route (drop
`../`/`./`, drop the `%20hex.md` Notion suffix, drop `about:blank`). Anchors carry
over (lowercase, spaces→`-`, `&`→dropped). External `https://…` links stay.

### Course A — "Auther" slug map (route root `/auther/`)
```
Overview / landing                     → /auther/overview/
PART 1 · The Auther Server (ARCHITECTURE.md)
  Stack & Project Structure            → /auther/server/stack-structure/
  Authentication System                → /auther/server/authentication/
  ReBAC & the Permission Engine        → /auther/server/rebac/
  ABAC, Guards, Groups & Invites       → /auther/server/abac-groups/
  API Keys & Machine Access            → /auther/server/api-keys/
  Pipelines, Webhooks & Observability  → /auther/server/pipelines-webhooks/
  Client Integration (Scenarios A–D)   → /auther/server/client-integration/
  Advanced Integration (E–F + how-tos) → /auther/server/advanced-integration/
  Configuration & Local Dev            → /auther/server/reference/
PART 2 · Integrating Auther (integration-guide.md)
  Who Owns the User Row?               → /auther/integration/user-ownership/
  Four Integration Archetypes          → /auther/integration/archetypes/
  The Shadow-User Pattern              → /auther/integration/shadow-user/
  Hono Walkthrough — Schema            → /auther/integration/hono-schema/
  Hono Walkthrough — Auth Core         → /auther/integration/hono-auth-core/
  Hono Walkthrough — Server Internals  → /auther/integration/hono-server-internals/
  End-to-End Flows                     → /auther/integration/flows/
  Edge Cases Catalog                   → /auther/integration/edge-cases/
  DX Stack, Libraries & Testing        → /auther/integration/dx-stack/
  Alternative System Shapes            → /auther/integration/alternative-shapes/
  FAQ & Summary                        → /auther/integration/faq/
```

### Course B — "Multi-Tenant on Cloudflare" slug map (route root `/multi-tenant/`)
```
Overview / landing            → /multi-tenant/overview/
Architecture & Topology       → /multi-tenant/architecture/
Tenant Resolution             → /multi-tenant/tenant-resolution/
Auth & SSO                    → /multi-tenant/auth-sso/
Custom Hostnames              → /multi-tenant/custom-hostnames/
Admin Panel & Operators       → /multi-tenant/admin-panel/
Web Layer (SPAs & Branding)   → /multi-tenant/web-layer/
Deep Modules                  → /multi-tenant/deep-modules/
Schema & Migrations           → /multi-tenant/schema-migrations/
Security                      → /multi-tenant/security/
Decision Log (D1–D78)         → /multi-tenant/decisions/
Gotchas & Lessons             → /multi-tenant/gotchas-lessons/
```
Anchor example: `./03-auth-and-sso.md#part-2-sso-plugin` →
`/multi-tenant/auth-sso/#part-2-sso-plugin` (verify the anchor matches a `##` heading
you actually emit; if you renamed the heading, point at the new slug).

---

## 8. CHAPTER pages — authoring spec

You are porting one source section to a chapter `.mdx`. Steps:

1. **Frontmatter** (§3): clean title, fresh description, the `order` you're given.
2. **Strip Notion artifacts** (§2): double H1, ToC/Quick-links, "Related:"
   blockquotes, RFC voice → teaching prose.
3. **Open with a 1–2 sentence "why this matters"** before the first mechanic.
4. **Code blocks** (§5): right language (`ts` not `tsx` unless JSX); lift file paths
   to `title=`; before/after as two titled blocks; fix the `Bearer ${}` spacing bug;
   highlight discussed lines; trim mega-pastes faithfully. This is the bulk of the
   quality work.
5. **ASCII → components** (§6): trees → FileTree; topology/flow/lifecycle/sequence →
   Mermaid; numbered runtime traces → `<Steps>` or `sequenceDiagram`; annotation art
   stays text.
6. **Asides / Steps / tables** (§10): "Pro tip"/"gotcha"/"never" → asides; ordered
   setup/runbook steps → `<Steps>`; comparison/decision matrices stay GFM tables.
7. **Cross-references** → real route links (§7).
8. If the section ends with a useful "Summary"/"Key invariants"/"Performance
   targets" block, KEEP it (reworded as teaching). Drop navigation footers and
   "Related:" blocks.

---

## 9. REFERENCE pages — authoring spec (Course B "Decision Log" & "Gotchas & Lessons")

Two Course B pages are reference material, not narrative chapters: `10-decisions`
(D1–D78) and `11-gotchas`. For these:

- **Keep the substance, clean the presentation.** The decision log is topic-grouped
  tables of `Dnn | one-line decision | source`. Keep it as **GFM tables**, one per
  topic group. Rewrite the `source` column's broken links to real routes (§7); if a
  link can't be mapped, keep the plain topic text.
- **Decision log:** drop the "Decisions retracted" strikethrough section from the
  main flow OR keep it as a short final "Superseded decisions" table with the
  strikethrough rendered as plain "(retracted)" text — your call, but don't use raw
  `~~strikethrough~~` noise; state it cleanly.
- **Gotchas page:** the source has "Validation history / three rounds of agent
  review / validator agent IDs" meta-narrative — **DROP** the meta-narrative and the
  agent IDs. KEEP the actual gotchas catalogue (the "would have failed at runtime",
  "security holes", "subtle correctness" tables) as clean tables/asides, and KEEP the
  "Lessons learned" as teaching prose and the "Open questions" as a short list framed
  as "Future work / v2 backlog". These are genuinely useful; just strip the
  post-mortem framing.
- Open each reference page with one sentence explaining what it is and how to use it.
- A back-link card to the overview at the top is nice but optional:
  `<LinkCard title="← Multi-Tenant overview" href="/multi-tenant/overview/" />`.

---

## 10. Native component usage & readability (bar: "best as possible, enjoyable")

- **Admonitions (asides):**
  - warnings / "don't" / "never" / gotchas / squatting/abuse risks → `:::caution[…]`
  - neutral asides / "note that" / "why this works" → `:::note`
  - tips / best-practice / "prefer X" → `:::tip`
  - real danger / data-loss / account-takeover / security-critical → `:::danger`
  Keep a custom label when useful: `:::caution[Common mistake]`, `:::tip[Why this works]`.
- **Steps:** ordered do-this-then-that procedures (zone setup runbooks, onboarding
  flows, the ordered migration sequence, PKCE flows, runtime traces) → wrap the
  ordered list in `<Steps>…</Steps>`.
- **Tabs (non-language):** genuine "pick one of N" alternatives only (§5). Use a
  descriptive `syncKey` (`syncKey="tenancy"`, `syncKey="verifier"`).
- **LinkCard / CardGrid:** the course landing grids, the optional reference back-link.
- **Badge:** small inline status labels only (e.g. `v16`, `Pro/Business`,
  `deferred to v2`); don't overuse.
- **GFM tables:** keep as Markdown tables — they render great. The stack tables,
  service-binding tables, operator-role matrix, threat↔mitigation matrix, decision
  log, per-column ownership table, archetype matrix — ALL stay tables. Never turn a
  comparison matrix into code or Tabs.
- Don't over-decorate: components are for comparisons, diagrams, callouts,
  procedures, file trees, and navigation — not every paragraph.

Canonical live examples already in the repo to match style (READ at least one before
porting):
- `src/content/docs/auther/overview.mdx` — Course A landing (tone/scope).
- `src/content/docs/auther/server/stack-structure.mdx` — Course A pilot CHAPTER.
- `src/content/docs/multi-tenant/overview.mdx` — Course B landing.
- `src/content/docs/multi-tenant/architecture.mdx` — Course B pilot CHAPTER (match
  its Mermaid + sequenceDiagram + table style exactly).

---

## 11. Quality checklist (verify before returning)

- [ ] Frontmatter present; both source `#` H1 lines removed; clean title; good description.
- [ ] RFC/post-mortem voice rewritten to teaching prose; decisions + tradeoffs kept; validation-round/agent-ID meta-narrative dropped.
- [ ] Hand-written ToC/Quick-links deleted; "Related:" blockquotes deleted; curly quotes normalized; `Bearer ${}`/`Basic ${}` spacing fixed.
- [ ] Every code block has the right (safe) language; `tsx`→`ts` unless real JSX; file paths lifted to `title=`; before/after as two titled blocks; mega-pastes trimmed faithfully.
- [ ] Every ASCII tree → `<FileTree>`; every topology/flow/lifecycle/sequence → `<Mermaid>`; numbered traces → `<Steps>` or `sequenceDiagram`; only annotation art left as ```text```.
- [ ] Genuine pick-one alternatives → `<Tabs>` with a descriptive syncKey; no invented alternatives; no tabbed lone blocks.
- [ ] Asides mapped; ordered procedures → `<Steps>`; all comparison/decision matrices kept as GFM tables.
- [ ] EVERY prose `<…>` (TS generic, JSX/HTML tag, placeholder) and `{…}` (object, claim shape, `${}`, `{slug}`) is backtick-wrapped (MDX-safe, render-safe).
- [ ] All internal links rewritten to `/auther/...` or `/multi-tenant/...` routes (§7); broken `about:blank#` / `%20hex.md` / `./NN-name.md#` links all fixed.
- [ ] Canonical names consistent (Course B: example.com/acme/the five apps/the packages).
- [ ] Only-used components imported; imports right after frontmatter.
- [ ] No stray tool/XML output anywhere (no `</content>`, `</invoke>`, `antml:`); file ends with content + a single newline.
- [ ] Technical content faithful; versions/API/header/claim/table names + D-numbers preserved verbatim; nothing invented.

## 12. Return format

Write the `.mdx` file to the target path. Then return a concise report:
- Target path written.
- Counts: code blocks titled, FileTrees, Mermaid diagrams (with types), Steps, asides, Tabs, tables.
- Cleanup applied (double-H1 removed, ToC/Related stripped, voice rewritten, links fixed, quotes/`Bearer ${}` fixed).
- Anything you were unsure about (facts preserved verbatim, links you couldn't map,
  MDX edge-cases) so the reviewer can check.

## 13. Hard constraints (do NOT violate)

- Write ONLY your single target `.mdx` file. Do NOT create, move, rename, or delete
  any other file. Do NOT touch `sidebar.json`, `menu.en.json`, or sibling pages.
- Do NOT run `npm`, `astro`, or any build. If you want to sanity-check MDX, compile
  ONLY your one file with `@mdx-js/mdx` — a full build is forbidden (it disrupts
  parallel porters).
- Do NOT edit files outside your target course directory
  (`src/content/docs/auther/` or `src/content/docs/multi-tenant/`).
</content>
</invoke>
