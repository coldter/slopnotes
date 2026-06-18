# Vim Motion course + interactive playground — design

Date: 2026-06-18
Status: approved (build)

## Goal

Add a new course "Vim Motion" to the slopnotes Starlight site, starting with a
lesson on **selection & yanking** (the verb→noun mental model: operator + text
object, with visual mode as the fallback). Embed a faithful, interactive Vim
**playground** so readers practice yanking in-page. Must look native to the
site, feel as close to real Vim/Zed as possible, have no visual glitches
("no box / no weird behavior"), and be extensible to future lessons.

## Constraints (from the codebase)

- **Astro Starlight** (Astro 6, Starlight 0.38), Tailwind v4, deployed to
  Cloudflare Workers. npm + package-lock.
- **No JS UI framework** is installed. `client:*` directives do NOT work.
  Interactivity = an `.astro` component shipping a vanilla-TS `<script>` that
  re-inits on `astro:page-load` (site uses view transitions via astro-vtbot).
  Reference pattern: `src/components/Mermaid.astro`.
- Courses live at `src/content/docs/<slug>/`; each course is a top-level group
  in `src/config/sidebar.json`. The `/courses` catalog auto-derives from the
  sidebar; the overview page's `description` is the blurb.
- Component aliases: `~` and `@` → `./src`.
- Design tokens: dark `#0d0d0d` bg (default), green accent `#22C55E`
  (light: `#16A34A`), emerald→green→lime gradient, Inter font, hairline borders
  (`--sl-color-hairline`), 10–14px radii, **no shadows**. Style with
  `--sl-color-*` vars + `color-mix()`, scoped `<style>` in the `.astro` file.
- Voice (`.port/REVIEW-BRIEF.md`): calm, concrete, second-person, problem-first,
  mid-level reader, example-driven, scannable. Gloss jargon in half a sentence.
  Use `<Steps>`, `:::note/:::tip/:::caution`, tables, `<Mermaid>` where useful.

## Dependencies (installed)

`codemirror`, `@codemirror/state`, `@codemirror/view`, `@codemirror/commands`,
`@codemirror/language`, `@codemirror/lang-javascript`, `@replit/codemirror-vim`.
These are imported only inside the component's client `<script>` → bundled for
the browser by Vite. No SSR/Workers impact (same as `mermaid`).

## Verified `@replit/codemirror-vim` (v6.3.0) API

- `import { vim, Vim, getCM } from "@replit/codemirror-vim"`
- `vim({ status: true }): Extension` — must come **first** in the extensions
  array so its keymap wins. `status:true` renders the official command/mode
  status bar panel (`.cm-vim-panel`, message `.cm-vim-message`) — handles `:`,
  `/`, and the `--INSERT--`/`--VISUAL--` mode line natively.
- `getCM(view): CodeMirror | null` — the cm5-compat adapter.
- `cm.on("vim-mode-change", e => …)` / `cm.off(...)`:
  `e.mode` ∈ `normal|insert|visual|replace`; `e.subMode` ∈ `""|linewise|blockwise`.
- Registers: `Vim.getRegisterController().getRegister('"')` →
  `.toString()` (contents), `.linewise` (bool), `.blockwise` (bool).
- Block cursor classes: `.cm-fat-cursor`, `.cm-cursor`, layer `.cm-vimCursorLayer`.

## Component: `src/components/VimPlayground.astro`

Mirror `Mermaid.astro`'s shape: `interface Props`, static markup, scoped
`<style>` (only `--sl-color-*` + `color-mix`), one client `<script>`.

### Public prop API (this is the contract content authors use)

```ts
interface Challenge {
  id: string;
  prompt: string;              // plain text; backtick spans rendered as <code>
  hint?: string;
  solution?: string;           // e.g. 'yiw' — revealable keystrokes
  success: {
    register?: string;         // default '"'
    equals?: string;           // exact register contents
    matches?: string;          // regex source (alternative to equals)
    linewise?: boolean;        // require linewise yank
    bufferUnchanged?: boolean; // default true → ensures yank, not delete
    buffer?: { equals: string };// for future delete/change lessons (bufferUnchanged ignored if set)
    mode?: string;             // optional expected mode
  };
}
interface Props {
  code: string;                // initial buffer (preserve exact whitespace)
  lang?: "js" | "ts" | "text"; // default "js"
  height?: number;             // default 280
  title?: string;              // header label, default "Vim playground"
  caption?: string;            // small caption under the widget
  challenges?: Challenge[];
}
```

Props that the client script needs are serialized into a
`<script type="application/json" class="vim-pg-config">` inside the root (Astro
props are not visible to client `<script>`; this is the SSR→client bridge).
Initial code lives in that JSON to preserve whitespace exactly.

### Behavior

- Build a **curated** extension set (NOT `basicSetup`) to avoid visual boxes:
  `vim({status:true})` first, then `lineNumbers()`, `highlightSpecialChars()`,
  `history()`, `drawSelection()`, `dropCursor()`, language + a github-dark-style
  `HighlightStyle`, our theme compartment, and `EditorView.lineWrapping`.
  **Exclude** `highlightActiveLine`, `highlightActiveLineGutter`, `foldGutter`,
  autocompletion — these create the "weird box" look.
- **HUD** (header bar above editor): title on the left; a `reg "` chip on the
  right showing live unnamed-register contents (truncated, monospace) — updates
  via an `EditorView.updateListener` reading `getRegister('"').toString()`.
  Add a small `LW` badge when the register is linewise.
- The **official vim status bar** (`status:true`) shows the mode line and `:`/`/`
  command line; style `.cm-vim-panel`/`.cm-vim-message` to match (mono, dim,
  hairline top border). This is the canonical Vim mode display — keep it.
- **Reset** button (outline-gradient style) restores the initial buffer +
  clears challenge state.
- **Challenges** rendered below as a checklist. After each edit/keystroke,
  evaluate each unsolved challenge against `success` using the register
  contents (+ buffer-unchanged / buffer-equals checks). On pass: mark ✓, add a
  restrained green wash + a brief glow. Each challenge has a "Hint" toggle and,
  if `solution` given, a "Show keys" reveal.
- **Keystroke echo** (best-effort, must never throw): capture keydown on the
  editor, show the recent keys in the status area, auto-clear on idle / mode
  change. Degrade silently if anything is off.
- **Focus**: kill the default outline (`.cm-editor.cm-focused{outline:none}`);
  show a green hairline on the wrapper via `:focus-within`.
- **Cursor**: block cursor in normal/visual (style `.cm-fat-cursor .cm-cursor`),
  thin bar in insert — the package handles this; we only theme it.
- **Theme**: dark + light CM themes in a `Compartment`; a `MutationObserver` on
  `document.documentElement[data-theme]` reconfigures it (mirrors Mermaid).
- **Lifecycle**: init on `astro:page-load` AND a `readyState`/`DOMContentLoaded`
  fallback; guard against double-init (mark the root); destroy a stale
  `EditorView` if its root is replaced. No layout shift: fixed height, internal
  scroll.
- **Touch**: if `pointer: coarse`, show a gentle "Vim practice needs a physical
  keyboard — best on desktop" note; do not block.
- Accessibility: respect `prefers-reduced-motion` (skip the solved glow).

## Content

### `src/content/docs/vim-motion/overview.mdx`
- frontmatter: `title`, `description` (catalog blurb), `sidebar: { order: 0 }`.
- Problem-first hook; "Who this is for" `:::note`; the verb→noun mental model in
  one paragraph; a `<CardGrid>`/`<LinkCard>` roadmap (Lesson 1 live; later
  lessons listed as upcoming); a small first taste of the playground optional.

### `src/content/docs/vim-motion/01-selection-yanking.mdx`
- frontmatter: `title`, `description`, `sidebar: { order: 1 }`.
- Voice + structure: hook ("you select-then-copy; Vim is the opposite") →
  the mental shift (verb → noun) → text-object table (`yiw`,`yaw`,`yi"`,`yi(`,
  `yit`,`yy`,`3yy`,`y$`,`yt;`) → `:::tip` on Zed `use_system_clipboard`
  (`"never"|"on_yank"|"always"`, recommend `on_yank`) and `"+y` → the embedded
  `<VimPlayground>` with 4–6 challenges (yiw, yi", yi(, yy, v}y, 3yy) → when to
  fall back to visual mode → recap. Use `<Steps>` for the practice drill.

### `src/config/sidebar.json`
- Add a top-level group `"Vim Motion"` with items: Overview
  (`vim-motion/overview`) and "Selection & Yanking"
  (`vim-motion/01-selection-yanking`).

## Extensibility

- New lessons = new MDX file + a sidebar item. Adding a playground = one
  `<VimPlayground>` with a `challenges` array (declarative data, no code).
- The `success` schema already supports delete/change lessons via
  `buffer.equals` and `bufferUnchanged:false`, and other registers via
  `register`. Future motion/operator lessons need no component changes.

## Verification

- `npm run build` (astro build) must pass; `npm run check` (astro check) clean.
- Manual reasoning + code review of the component for the "no weird box"
  requirements (curated extensions, killed outline, block cursor, no layout
  shift). Browser smoke test recommended to the user post-merge.

## Out of scope (now)

Later lessons beyond Lesson 1 (only outlined). No new fonts/colors. No framework
integration.
