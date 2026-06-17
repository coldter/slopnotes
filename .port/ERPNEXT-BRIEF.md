# Porter Brief — exp-guide-erp-next → slopnotes "ERPNext & Frappe" course

You are porting ONE source page from `/home/kuldeep/code/oss/exp-guide-erp-next/`
into the slopnotes Astro Starlight site at `/home/kuldeep/code/oss/slopnotes/`,
converting it to a polished **MDX** page that uses slopnotes' native components.

This is **not** a lift-and-shift. You preserve the technical substance and the
teaching flow, but you (1) give every code block the correct highlight language
and a file-path `title`, (2) replace ASCII art with real components
(FileTree / Mermaid), (3) use native Starlight/slopnotes components idiomatically,
(4) clean up source artifacts (hand-written ToCs, "next chapter" footers, raw
relative links), and (5) make the page build cleanly as MDX.

Read this WHOLE brief before you touch anything. You will be told whether you are
porting a **CHAPTER** (a Guide chapter → a lesson page) or a **RECIPE** (a Cookbook
recipe → a recipe page). Shared rules (§2–§7, §10) apply to both; §8 is
chapter-only, §9 is recipe-only.

---

## 1. The course

The source is **two companion works**, both ported into ONE slopnotes course
called **"ERPNext & Frappe"** living under `src/content/docs/erpnext/`
(route root `/erpnext/`):

- **The Guide** — *The Complete ERPNext v16+ & Frappe Framework Developer Guide*:
  a progressive **35-chapter / 7-part** learning path for an experienced backend
  developer (Node.js background) learning to build and run ERPNext at scale.
  Each chapter → one **lesson page** at `erpnext/NN-name.mdx`.
- **The Cookbook** — *The Frappe Developer Cookbook*: **56 self-contained recipes**
  in a Problem → Solution → Why → Common-mistake format. Each recipe → one page at
  `erpnext/cookbook/<section>/<recipe>.mdx`.

The whole thing is themed around **"ScoopJoy"**, a franchise-based ice-cream / food
chain in India (multiple outlets, central kitchen, 50+ staff). **KEEP the ScoopJoy
running example** — it is the spine that ties the course together, exactly the role
multigres plays in the Go Guide. Do not genericize it away.

Audience identity: a working backend dev (Node.js/Express, Postgres, Redis, Docker)
mapping known concepts onto Frappe/Python. **Keep the Node.js analogies** the source
draws ("in Express you'd…, in Frappe you…") — they're the teaching hook. Keep the
direct, concrete, lightly opinionated voice; keep "Pro tip" / warning insights
(map them to asides, §10).

Tech facts to preserve verbatim (never invent or alter): ERPNext/Frappe **v16+**,
Python 3.10+ (the source sometimes shows 3.14), MariaDB/MySQL or Postgres, Redis,
Node.js for realtime/Socket.IO, the `bench` CLI, the "everything is a DocType"
model. If unsure about a fact/API/version, keep the source's statement (lightly
reworded) — do **not** guess.

---

## 2. Content cleanup & framing (this is a content change — read it)

The source is a clean authored guide, so there's little framing to strip, but DO:

- **Hand-written "Table of Contents" lists** at the top of a file → DELETE. Starlight
  auto-generates an on-page ToC in the right sidebar; a duplicate is noise.
- **"Next Chapter" / "Previous" / "Continue to…" footer links** → DELETE. The site
  auto-paginates within the course.
- **Raw relative cross-references** ("see Chapter 8", "→ `part5-integrations.md`",
  `../README.md`) → rewrite to slopnotes routes (§7). A prose "see Chapter 9" should
  become a real link to that chapter's route, e.g.
  `[Chapter 9](/erpnext/09-permissions-security/)`.
- **Machine-specific absolute paths** (a real `/home/<user>/…`) → genericize
  (`~/frappe-bench`, `cd frappe-bench`). Frappe paths like
  `apps/scoopjoy/scoopjoy/...` are PROJECT paths — keep them, they're correct.
- **Repetition across chapters**: the source re-pastes setup boilerplate (bench
  install, `docker compose up`) in several chapters. In a non-setup chapter, a
  one-line reminder + a link to the setup chapter beats re-pasting 30 lines. Trim
  giant boilerplate dumps to the point being made.
- **Technical accuracy**: never invent or alter a fact, API name, or version.

Net effect: each page stands alone, reads as a polished lesson/recipe, and shows
no trace of "this used to be a chunked Markdown file."

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

- `title`: the page's H1 — **DROP the source's leading `# Chapter NN: …` or
  `## Recipe X.Y: …` line** (frontmatter `title` renders the H1; a second one
  duplicates it). Use the clean name (e.g. "DocTypes — Data Modeling", NOT
  "Chapter 4: DocTypes — Data Modeling in Frappe"; "Self-Referencing Tree DocType",
  NOT "Recipe 1.1: …"). Keep `##`/`###` subheadings inside.
- `description`: a fresh, concrete one-liner.
- `sidebar.order`: the number you're given.

Imports (only the ones you actually use) go immediately after the frontmatter:

```mdx
import Mermaid from "~/components/Mermaid.astro";
import { Tabs, TabItem, Steps, Card, CardGrid, LinkCard, Badge, FileTree, Aside } from "@astrojs/starlight/components";
```

---

## 4. MDX SAFETY (build-breaking — do not skip)

MDX parses `{` and `<` specially. Plain Markdown that was fine in `.md` will break
the build in `.mdx`. **This source is full of Python dicts, f-strings, JS objects,
and Jinja templates — `{…}` in prose is the #1 risk here.** Fix every one of these
in PROSE (text OUTSIDE fenced code blocks):

- **Curly braces** `{ … }` in prose → wrap in backticks. A dict literal
  `{"item_code": "SJ-001"}`, an f-string `f"{outlet.name}"`, a JS object
  `{ doctype: "Sales Invoice" }`, a Jinja expression `{{ doc.customer }}` or
  `{% if %}`, a format string `{0}` — ALL must be backticked when mentioned inline.
  A bare `{{ doc.total }}` in a sentence WILL crash the build (and may compile but
  crash only at render — see below).
- **Angle brackets** `<…>` in prose → wrap in backticks. Placeholders like
  `<your-site>`, `<site-name>`, `<app-name>`, generic types `list[dict]` (fine, no
  angle), but `Optional<T>`-style, HTML tags shown inline `<button>`, `<your-domain>`
  — backtick them. A bare `<site-name>` reads as an unclosed JSX tag and breaks.
- **The render-time trap:** a bare `{...}` can pass a single-file MDX compile and
  still **crash at render** with `X is not defined` (MDX treats `{foo}` as a JS
  expression). This bit us before with `{ jvmToolchain(21) }` in a FileTree comment.
  So: backtick braces even inside `<FileTree>` comments and component text. When in
  doubt, backtick.
- Inside **fenced code blocks** (```python, ```js, ```bash, ```json, ```html)
  nothing needs escaping — code is literal. PREFER putting tricky syntax in code
  spans/blocks rather than bare prose.
- **`<details><summary>`**: works in MDX but the form is STRICT. Use EXACTLY this
  shape — NO blank lines inside, `</details>` glued to the end of the answer:
  ```
  <details><summary>Question text?</summary>
  Answer on one contiguous line (no blank lines), ending with the close tag.</details>
  ```
  Prefer `:::note[…]` asides over `<details>` unless it's genuinely a collapsible Q&A.
- Component tags must be balanced; no stray `<` that looks like a tag.
- **Never** end the file with stray tool/XML output (e.g. a literal `</…>` tag). The
  file ends with your last line of MDX content and a single trailing newline.

After porting, scan EVERY line of prose for `{`, `}`, and `<`.

---

## 5. The signature move: correct code highlighting + file titles

This course is **single-stack** (Frappe = Python backend + JavaScript client
scripts + JSON DocType definitions + bash/bench + SQL + YAML/Docker). There is NO
three-language comparison to tab. The signature quality move here is **clean,
correctly-highlighted, file-titled code blocks**. For every fenced code block:

1. **Set the right language.** Use the source's intent. Safe languages (use these):
   `python`, `javascript`, `json`, `bash`, `sql`, `yaml`, `dockerfile`, `nginx`,
   `ini`, `toml`, `html`, `xml`, `diff`, `text`. For **Jinja / print-format
   templates** use ```html (it's HTML with `{{ }}` — `html` highlights it safely).
   If a language isn't in this list (e.g. `promql`, `hocon`), use ```text — never
   leave an unsupported lang tag, it breaks the build.
2. **Add a `title` when the code is a file.** The source marks files with a first
   comment line like `# File: scoopjoy/scoopjoy/doctype/sj_outlet/sj_outlet.py` or
   `// File: …` or `# hooks.py` or `# path/to/file`. Lift that path into the fence:
   ````
   ```python title="scoopjoy/scoopjoy/doctype/sj_outlet/sj_outlet.py"
   import frappe
   ...
   ```
   ````
   You may drop the now-redundant `# File:` first line from the body, OR keep it —
   prefer lifting it to `title` and removing it. A bench/shell block that's a
   sequence of commands needs no title.
3. **Highlight the lines the prose calls out** with `{3-5}` / `{3,7}` markers, e.g.
   ` ```python {4-6} title="…" `. Use sparingly — only where the text discusses
   specific lines.
4. **Trim giant pastes** to the illustrative core. If the source dumps a 120-line
   controller but only 30 lines matter, show the 30 with a `# … (rest unchanged)`
   elision. Faithfully reproduce real logic; don't rewrite it.

**Node.js ⇄ Frappe pairs (optional Tabs):** occasionally the source shows the same
thing the "Node.js/Express way" and the "Frappe/Python way" as two consecutive
labeled code blocks. ONLY in that genuine paired case, use a synced Tabs block so a
reader can flip the whole page between perspectives:

```mdx
<Tabs syncKey="stack">
  <TabItem label="Node.js">

  ```javascript
  app.get("/orders/:id", async (req, res) => { /* … */ });
  ```

  </TabItem>
  <TabItem label="Frappe (Python)">

  ```python
  @frappe.whitelist()
  def get_order(name): ...
  ```

  </TabItem>
</Tabs>
```

Rules: `syncKey="stack"`, exact labels `Node.js` / `Frappe (Python)`, blank lines
around the fences inside each `<TabItem>`. Do NOT tab a lone Python block, and do
NOT invent a Node.js counterpart that the source didn't write. Most code is a
single Python/JS/bash block with a title — that's the norm; Tabs are the exception.

---

## 6. ASCII art → the RIGHT component

The source uses fenced ```text``` / ``` blocks for diagrams. Classify each:

### 6a. Directory / file trees → `<FileTree>` (NOT Mermaid)
Any `├──`/`└──`/indented path listing of an app or bench layout:

```mdx
<FileTree>
- apps/scoopjoy/
  - scoopjoy/
    - hooks.py app config + event bindings
    - doctype/
      - sj_outlet/ the Outlet DocType
  - setup.py
</FileTree>
```

Mark a focused entry with `**bold**`; trailing text after a name becomes a comment.
Trailing `/` = directory; `…` = truncation. Convert any inline `# comment`
annotations in the source tree into that trailing comment text. **Backtick any
`{…}` that appears in a comment** (§4). Frappe app layouts appear constantly —
convert every one.

### 6b. Flow / architecture / pipeline / sequence / state diagrams → `<Mermaid>`
Boxes-and-arrows, request lifecycles, data flow, producer→queue→worker pipelines,
document state machines (Draft→Submitted→Cancelled), approval escalations,
fan-out/fan-in:

```mdx
<Mermaid title="Request lifecycle" height={420} code={`
flowchart LR
  B["Browser"] -->|"POST /api/resource/Sales Order"| F["Frappe (Werkzeug)"]
  F --> R["Redis cache"]
  F --> DB["MariaDB"]
  F -->|"realtime"| S["Socket.IO"]
`} />
```

- Pick the type: boxes+arrows/zones → `flowchart LR`/`TB` (use `subgraph` for
  groupings); messages between actors over time → `sequenceDiagram`; document
  lifecycle/status → `stateDiagram-v2`.
- Quote node text with special chars: `A["bench (Werkzeug)"]`. Edge labels:
  `A -->|"gRPC"| B`.
- `title` short; `height={360}` small, `height={520}` tall. The `code={` … `}` is a
  JS template literal — **do not** put a literal backtick or `${` inside it.

The source's Chapter 1 has an explicit "Architecture Diagram (Text-Based)" and a
"Request Lifecycle" numbered list — both become Mermaid. Workflow/state-machine
recipes become `stateDiagram-v2`. Pipeline recipes become `flowchart`.

### 6c. Annotation / call-out ASCII → keep as a ```text``` block
Some ASCII isn't a tree or a flow — it's a labeled annotation (arrows pointing at
parts of a token, an aligned table-ish callout). Keep that as a literal ```text```
block. Don't force it into Mermaid/FileTree.

No ASCII tree or flow should survive as raw ```text```. Only genuine annotation art
stays fenced.

---

## 7. Link rewriting

Rewrite EVERY internal cross-reference to its absolute slopnotes route (drop
`../`/`./`). Anchors carry over (lowercase, spaces→`-`). External `https://…` links
stay unchanged. The course root is `/erpnext/`.

### Guide chapter slug map (Chapter N → route)
```
Ch1  Architecture Overview            → /erpnext/01-architecture/
Ch2  Development Environment Setup     → /erpnext/02-dev-environment/
Ch3  The Bench CLI                     → /erpnext/03-bench-cli/
Ch4  DocTypes — Data Modeling          → /erpnext/04-doctypes/
Ch5  Python Controllers & Server Logic → /erpnext/05-controllers/
Ch6  Hook System & App Lifecycle       → /erpnext/06-hooks-lifecycle/
Ch7  Client-Side Framework (JS)        → /erpnext/07-client-side-js/
Ch8  REST API, RPC & Real-Time         → /erpnext/08-rest-api-realtime/
Ch9  Permissions, Roles & Security     → /erpnext/09-permissions-security/
Ch10 Accounting & Finance              → /erpnext/10-accounting/
Ch11 Stock & Inventory Management      → /erpnext/11-stock-inventory/
Ch12 Selling — Sales, CRM & POS        → /erpnext/12-selling-crm-pos/
Ch13 Buying — Purchasing & Procurement → /erpnext/13-buying-procurement/
Ch14 Manufacturing                     → /erpnext/14-manufacturing/
Ch15 HR & Payroll                      → /erpnext/15-hr-payroll/
Ch16 Creating a Custom Frappe App      → /erpnext/16-custom-app/
Ch17 Custom DocTypes, Fields & Forms   → /erpnext/17-custom-doctypes-forms/
Ch18 Server Scripts & Scheduled Jobs   → /erpnext/18-server-scripts-jobs/
Ch19 Client Scripts & Custom Pages     → /erpnext/19-client-scripts-pages/
Ch20 Print Formats, Reports, Dashboards→ /erpnext/20-print-reports-dashboards/
Ch21 Workflows, Notifications, Automation → /erpnext/21-workflows-automation/
Ch22 Payment Gateway Integration       → /erpnext/22-payment-gateways/
Ch23 Website & E-Commerce              → /erpnext/23-website-ecommerce/
Ch24 External APIs & Webhooks          → /erpnext/24-external-apis-webhooks/
Ch25 Third-Party Service Connectors    → /erpnext/25-third-party-connectors/
Ch26 Docker-Based Dev & Deployment     → /erpnext/26-docker/
Ch27 Production Deployment             → /erpnext/27-production-deployment/
Ch28 Scaling with Kubernetes           → /erpnext/28-kubernetes/
Ch29 Backup, Recovery & Monitoring     → /erpnext/29-backup-monitoring/
Ch30 Performance Optimization          → /erpnext/30-performance/
Ch31 Multi-Company & Multi-Tenant      → /erpnext/31-multi-company/
Ch32 Data Migration & Bulk Operations  → /erpnext/32-data-migration/
Ch33 Testing Strategies                → /erpnext/33-testing/
Ch34 CI/CD Pipeline                    → /erpnext/34-cicd/
Ch35 Case Study                        → /erpnext/35-case-study/
```
Overview / "the guide" → `/erpnext/overview/`. Cookbook landing → `/erpnext/cookbook/`.

### Cookbook recipe slug map (`erpnext/cookbook/<section>/<recipe>`)
Sections: `doctype-orm`, `controllers`, `client-side`, `api-integration`,
`queries-performance`, `workflows-devops`, `testing-security`.
```
1.1 self-referencing-tree   1.2 multi-level-child-tables  1.3 virtual-doctype
1.4 dynamic-link-polymorphic 1.5 advanced-naming          1.6 orm-power-patterns
1.7 fixtures-data-migration  1.8 computed-virtual-fields
2.1 validation-chain        2.2 document-lifecycle        2.3 background-jobs
2.4 scheduled-tasks         2.5 whitelisted-api-methods   2.6 extend-doctype-class
2.7 database-transactions   2.8 email-communication
3.1 multi-step-wizard       3.2 realtime-dashboard        3.3 dynamic-form-manipulation
3.4 child-table-operations  3.5 custom-list-view          3.6 custom-desk-page
3.7 form-script-communication 3.8 frappe-ui-components
4.1 mobile-rest-api         4.2 webhook-sender-retry      4.3 incoming-webhook-idempotency
4.4 custom-upi-gateway      4.5 circuit-breaker-client    4.6 file-upload-pipeline
4.7 oauth2-connected-app    4.8 nodejs-express-middleware
5.1 query-builder           5.2 script-report-scorecard   5.3 query-reports-sql
5.4 redis-caching           5.5 n-plus-1-elimination      5.6 database-indexing
5.7 materialized-view       5.8 bulk-data-operations
6.1 approval-workflow-escalation 6.2 document-state-machine 6.3 notification-engine
6.4 scheduled-job-orchestration  6.5 auto-repeat-recurring  6.6 assignment-rules
6.7 cicd-pipeline           6.8 health-check-monitoring
7.1 unit-testing            7.2 integration-testing       7.3 api-endpoint-testing
7.4 permission-testing-matrix 7.5 security-hardening       7.6 load-testing-locust
7.7 backup-recovery-scripts 7.8 docker-production-build
```
e.g. recipe 5.4 → `/erpnext/cookbook/queries-performance/redis-caching/`.

---

## 8. CHAPTER pages — authoring spec (Guide → lesson)

You are porting one Guide chapter to `erpnext/NN-name.mdx`.

1. **Frontmatter**: clean title (no "Chapter NN:"), fresh description, the `order`
   you're given.
2. **Delete the hand-written ToC and the "Next Chapter" footer** (§2).
3. **Code blocks** (§5): every block gets the right language; lift `# File:` paths
   into `title=`; highlight discussed lines; trim mega-pastes. This is the bulk of
   the quality work.
4. **ASCII → components** (§6): trees → FileTree, flows/lifecycles/state → Mermaid,
   annotations stay text.
5. **Asides / Steps / tables** (§10): "Pro tip"/"Warning"/"Note" → asides; install &
   setup sequences → `<Steps>`; comparison tables stay GFM tables.
6. **Cross-references** → real route links (§7).
7. **Keep the ScoopJoy examples and the Node.js analogies.** Lead each section with
   a short plain sentence on why it matters before the code.
8. If the chapter ends with a "Key Takeaways"/"Summary"/"Quick Reference" block,
   KEEP it (useful). Drop only navigation footers.

There are no per-chapter "Practice" cards (the Cookbook is reached from the course
overview and the cookbook landing, not per-chapter) — unless told otherwise.

---

## 9. RECIPE pages — authoring spec (Cookbook → recipe)

You are porting one Cookbook recipe to `erpnext/cookbook/<section>/<recipe>.mdx`.
Recipes follow a fixed source format: **Problem / Solution / Why this works /
Common mistake**. Map it to a clean, code-first page:

1. **Frontmatter**: `title` = the recipe name (no "Recipe X.Y:"), concrete
   `description`, the `order` you're given (the recipe's index within its section,
   e.g. 4 for 5.4).
2. **A back-link card at the very top** so the recipe is anchored to the cookbook:
   ```mdx
   <LinkCard title="← Frappe Cookbook" href="/erpnext/cookbook/" />
   ```
3. **Problem**: a tight 1–2 sentence framing (a short paragraph, or a
   `:::note[Problem]` aside). Keep the ScoopJoy scenario.
4. **Solution**: the centerpiece — the complete, runnable code, faithfully
   reproduced. Apply §5 fully: correct language, `title=` from every `# File:`
   marker, line highlights for the parts you walk through. If the recipe spans
   several files (DocType JSON + controller + client JS), show each as its own
   titled block in source order, each preceded by one sentence on its role. Add a
   `<FileTree>` if the recipe creates several files. Walk through the interesting
   parts in prose between blocks. Do not dump unrelated boilerplate.
5. **Why this works**: the source's explanation → a short paragraph or
   `:::note[Why this works]` aside.
6. **Common mistake**: the source's pitfall → `:::caution[Common mistake]` aside.
7. Multi-step procedures (Step 1/Step 2/…) → keep their `###` subheadings (they make
   good on-page ToC entries); wrap a genuinely sequential run/install list in
   `<Steps>`.

Keep it example-first and faithful: this is real, runnable Frappe code — preserve
its logic; you may trim imports/boilerplate with a `# …` elision.

---

## 10. Native component usage & readability (bar: "best as possible, enjoyable")

- **Admonitions (asides):**
  - warnings / "don't" / "never" / gotchas / "Common mistake" → `:::caution[…]`
  - neutral asides / "note that" / "Why this works" → `:::note`
  - tips / best-practice / "Pro tip" → `:::tip[Pro tip]`
  - real danger / data-loss / "this will drop data" → `:::danger`
  Keep a custom label in brackets when useful: `:::tip[Pro tip]`,
  `:::caution[Common mistake]`.
- **Steps:** ordered do-this-then-that procedures (install flows, bench setup, deploy
  steps) → wrap the ordered list in `<Steps>…</Steps>`.
- **Tabs (non-language):** "pick one of N" alternatives → `<Tabs>`. Use
  `syncKey="setup"` for "Native bench vs Docker", `syncKey="db"` for "MariaDB vs
  Postgres", etc. Reserve `syncKey="stack"` for the Node.js ⇄ Frappe (Python) code
  pairing only (§5).
- **LinkCard / CardGrid:** navigation, the recipe back-link, and any landing-page
  grids.
- **Badge:** small inline status labels only (e.g. `v16`, `Deprecated`); don't overuse.
- **GFM tables:** keep as Markdown tables — they render great. Concept/comparison
  matrices must stay tables, never become code or Tabs.
- Don't over-decorate: components are for comparisons, diagrams, callouts,
  procedures, file trees, and navigation — not every paragraph.

Canonical live examples already in the repo to match style (READ at least one
before porting):
- `src/content/docs/go-guide/orientation.mdx` — Mermaid, tables, asides, voice.
- `src/content/docs/erpnext/overview.mdx` — this course's landing page (tone/scope).
- `src/content/docs/erpnext/01-architecture.mdx` — the pilot CHAPTER (match it).
- `src/content/docs/erpnext/cookbook/doctype-orm/self-referencing-tree.mdx` — the
  pilot RECIPE (match its shape exactly).

---

## 11. Quality checklist (verify before returning)

- [ ] Frontmatter present; source `# Chapter NN:` / `## Recipe X.Y:` line removed; clean title; good description.
- [ ] Hand-written ToC deleted; "Next/Prev chapter" footers dropped; machine paths genericized; ScoopJoy + Node.js analogies kept.
- [ ] Every code block has the right (safe) language; `# File:` paths lifted to `title=`; discussed lines highlighted; mega-pastes trimmed faithfully.
- [ ] Every ASCII tree → `<FileTree>`; every flow/lifecycle/state diagram → `<Mermaid>`; only annotation art left as ```text```.
- [ ] Node.js ⇄ Frappe code pairs (if any) → `<Tabs syncKey="stack">` with exact labels Node.js / Frappe (Python) and blank lines around fences. No invented counterparts.
- [ ] Asides mapped (`:::note`/`:::tip[Pro tip]`/`:::caution[Common mistake]`/`:::danger`); procedures → `<Steps>`; tables kept.
- [ ] EVERY prose `{…}` (dict, f-string, JS object, Jinja `{{ }}`/`{% %}`) and `<…>` placeholder/tag is backtick-wrapped (MDX-safe, render-safe).
- [ ] All internal links rewritten to `/erpnext/...` routes (§7).
- [ ] (Recipe) Back-link card at top; Problem/Solution/Why/Common-mistake mapped.
- [ ] Only-used components imported; imports right after frontmatter.
- [ ] No stray tool/XML output anywhere; file ends with content + a single newline.
- [ ] Technical content faithful; nothing invented.

## 12. Return format

Write the `.mdx` file to the target path. Then return a concise report:
- Target path written.
- Counts: code blocks titled, FileTrees, Mermaid diagrams (with types), asides, Tabs.
- Cleanup applied (ToC removed, footers dropped, paths genericized, repetition trimmed).
- Anything you were unsure about (facts preserved verbatim, links you couldn't map,
  MDX edge-cases) so the reviewer can check.

## 13. Hard constraints (do NOT violate)

- Write ONLY your single target `.mdx` file. Do NOT create, move, rename, or delete
  any other file. Do NOT touch `sidebar.json`, `menu.en.json`, or sibling pages.
- Do NOT run `npm`, `astro`, or any build. If you want to sanity-check MDX, compile
  ONLY your one file with `@mdx-js/mdx` — but a full build is forbidden (it disrupts
  parallel porters).
- Do NOT edit files outside `src/content/docs/erpnext/`.
