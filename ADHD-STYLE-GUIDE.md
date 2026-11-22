# ADHD-Friendly Technical Writing Style Guide

Apply these rules to every MDX file you rewrite. The goal: a reader with ADHD can scan, grasp, and act. Keep all technical accuracy. Cut the fluff.

---

## 1. Lead with the action or the answer

First meaningful line after frontmatter = what to do or what this is. Not "In this chapter we will explore..."

**Bad:** "In this module, we'll explore how coroutines work and why they matter."
**Good:** "Coroutines are suspendable functions that run on thread pools. Start one with `launch { }`."

## 2. Short paragraphs. 1-3 sentences max.

Wall of text = brain skips it. Break every paragraph over 3 sentences.

## 3. Use headers aggressively

Every 5-10 lines, a new `##` or `###`. Headers are skim anchors. Make them concrete: "Buffer channels to producer count" not "Channel sizing".

## 4. Code first, explanation second

Show the code. Then one sentence on why. Not five paragraphs before the code.

## 5. Tables over prose for comparisons

If you're listing options, versions, or mappings, use a table. ADHD brains scan tables faster than paragraphs.

## 6. Bullet lists max 5 visible items

Group related bullets. If more than 5, use sub-headers or fold into a table. Never a 12-item bullet wall.

## 7. Cut AI-slop phrases

Delete these on sight:
- "In this chapter/module/page, we will..."
- "It's important to note that..."
- "Let's dive into..."
- "Now that we understand X, let's look at Y"
- "As you can see..."
- "Essentially..." / "Basically..." / "Fundamentally..."
- "It's worth noting that..."
- "Keep in mind that..."
- "Remember that..."
- "At its core..."
- "In the world of..."
- "Whether you're a beginner or an expert..."
- "Delve" / "tapestry" / "landscape" / "ecosystem" (unless literal)
- "Unlock the power of..."
- "Game-changer" / "revolutionary"
- "First things first"
- "With that said" / "With that in mind"
- "Moving on" / "Let's move on"
- "Now let's" / "Let's now"
- "So what does this mean?"
- "The bottom line"
- "At the end of the day"
- Any rhetorical question

## 8. No throat-clearing intro paragraphs

Don't summarize what the page is about in a preamble paragraph. The `description` in frontmatter already does that. Jump straight into content.

**Bad:** "You've spent four modules building the parts. FastAPI is where they snap together. It is the default modern Python backend framework in 2026..."
**Good:** "FastAPI wires your type hints, Pydantic models, and async code into a web framework. A function signature like `def create(body: TaskCreate) -> Task` is simultaneously the parser, validator, and OpenAPI schema."

## 9. Active voice, imperative mood

**Bad:** "The channel can be created with `make`."
**Good:** "Create a channel with `make(chan int)`."

## 10. One concept per section

Don't cram three ideas into one `##`. If a section covers more than one distinct concept, split it.

## 11. Callouts: use sparingly, make them count

`:::note`, `:::tip`, `:::caution` — max 2-3 per file. Each must carry information the main text doesn't. Don't use callouts for filler.

## 12. Cross-language comparisons: table format

When comparing TS/Go/Python/Kotlin, use a compact table, not three code blocks with prose between them.

## 13. "Next" section at end: one link, one sentence

**Bad:** A paragraph recapping everything then a link.
**Good:** `<LinkCard title="Next: Errors" href="/..." description="Typed failures vs defects." />`

## 14. Frontmatter description: one sentence, concrete

**Bad:** "Master Kotlin coroutines by mapping them to Go goroutines and TypeScript async/await, with structured concurrency, channels, and fan-out patterns."
**Good:** "Coroutines = suspendable functions on thread pools. Start with `launch`, cancel with scopes, fan out with `async`."

## 15. Remove redundant restatements

If the header says it, the first sentence doesn't need to repeat it. If a code comment says it, the prose doesn't need to.

## 16. Keep all technical details

No loss of: type signatures, exact commands, file paths, version numbers, error messages, config keys, API names. Cut only the verbal padding around them.

## 17. Mermaid diagrams: keep them, add a one-line caption

Diagrams are ADHD-friendly (visual). Keep them. Add one sentence before or after: what to notice in the diagram.

## 18. Steps: use `<Steps>` component for procedures

Numbered procedures use `<Steps>` from starlight. Each step = one action. No "and then" twice in one step.

## 19. File length target

Aim for 30-50% of current length. If a file is 900 lines, target 300-450. If 200 lines, target 80-120. Cut harder on intro/conclusion sections.

## 20. Preserve all imports, components, frontmatter structure

Don't touch the YAML frontmatter structure (title, description, sidebar). Keep all `import` statements at top. Keep Mermaid, Tabs, Steps, LinkCard, CardGrid components working.
