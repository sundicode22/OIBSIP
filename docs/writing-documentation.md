# How to write project documentation

This guide explains how professional teams document software, using this repository's docs as the worked example. Read it when you add a feature and wonder "what do I need to write down, and where?"

---

## 1. Know who you are writing for

Every document has a reader with a question. Before writing, name both:

| Reader | Their question | Document in this repo |
| ------ | -------------- | --------------------- |
| Someone who just found the repo | "What is this, and is it any good?" | `README.md` |
| A new developer (or you, in 6 months) | "How do I run it?" | `getting-started.md` |
| Someone changing the code | "Where does my change go? Why is it built like this?" | `architecture.md`, `data-model.md` |
| A frontend dev or API consumer | "What exactly does this endpoint take and return?" | `api-reference.md` |
| A reviewer, examiner or maintainer | "What was asked, what's done, what's broken?" | `requirements.md`, `known-issues.md` |

If you cannot name the reader, you are probably writing a diary, not documentation. The old `backend/README.md` ("This is November 4 start of the backend…") was a diary: useful to you on that day, but it answers nobody's question. Diary-style notes belong in commit messages or a changelog.

---

## 2. Use the four kinds of documentation

A widely used model, [Diátaxis](https://diataxis.fr/), says there are four kinds of documentation and that mixing them in one document makes each one worse:

| Kind | Purpose | Reads like | Here |
| ---- | ------- | ---------- | ---- |
| **Tutorial** | Learning by doing | "Follow these steps and you'll have X" | `getting-started.md` |
| **How-to guide** | Solving a specific task | "To create an admin, do…" | "Create your first admin" section, troubleshooting table |
| **Reference** | Looking up facts | Tables, exact fields, no opinions | `api-reference.md`, `data-model.md`, `dependencies.md` |
| **Explanation** | Understanding why | Diagrams, trade-offs, reasoning | `architecture.md` |

A common mistake is a README that is part tutorial, part API reference and part design essay, 800 lines long. Keep the README short and **link out** to the right document instead.

---

## 3. The README is the front door

A good root README answers, in this order:

1. **What is it?** One or two sentences, plus an honest status line.
2. **What is it built with?** A short tech-stack table.
3. **How do I run it?** The shortest working set of commands.
4. **Where is everything else?** Links to the detailed docs.
5. **Status and license.**

Things that do not belong in a README: every endpoint, every package, long explanations. Those go in `docs/` and are linked.

**Badges, emojis and marketing copy** ("Engineered with precision for full-stack excellence", which the frontend README used to end with) look impressive but tell the reader nothing. Prefer plain statements of fact. The same README also promised "optimistic caching with automatic rollbacks", which the code never did; a reader who trusted it would have been misled. Both have since been corrected.

---

## 4. Rules that make docs trustworthy

**Be accurate before being complete.** A wrong doc is worse than a missing one, because people act on it. Every claim in these docs was checked against the code. When you're not sure, read the code or run it.

**Be honest about status.** "Work in progress, frontend for ordering not built" is more useful than a checklist with every box ticked. `known-issues.md` exists so problems are written down rather than hidden. Reviewers trust a project more when its limits are stated.

**Write in plain, complete sentences.** "Stock is decremented when the order is created, before payment" beats "stock dec on create (pre-pay)". Spell out terms the first time (JWT, CORS, ORM).

**Show, don't just tell.** Give a real example request and response, not only a description. Copy-pasteable commands beat prose instructions.

**Use tables for facts, prose for reasons.** Tables are great for "variable → default → purpose". They are bad at explaining *why*; put the why in a sentence above or below the table.

**Use diagrams for flows and relationships.** This repo uses [Mermaid](https://mermaid.js.org/), which GitHub renders directly from text inside a ```` ```mermaid ```` block. Because the diagram is text, it is versioned and reviewed like code. Good uses: system overview, request sequence, state machine, entity-relationship diagram.

**Date living documents.** `requirements.md` and `known-issues.md` have a "Last reviewed" date so readers know how fresh they are.

---

## 5. Docs as code

Professional teams treat documentation like source code:

- **It lives in the repository**, next to the code it describes, as Markdown. Not in a Google Doc that drifts out of date.
- **It changes in the same commit or pull request as the code.** If you add an endpoint, the same PR updates `api-reference.md`. A reviewer should reject a PR that changes behaviour without updating the docs.
- **It is reviewed.** Read your doc diff the way you read a code diff.

A simple checklist to run before every commit:

- [ ] Added or changed an endpoint? → `api-reference.md`
- [ ] Changed `schema.prisma`? → `data-model.md`
- [ ] Added a package? → `dependencies.md` (what and why)
- [ ] Added an environment variable? → `.env.example` **and** `getting-started.md`
- [ ] Changed how to run or build? → `getting-started.md`, README quick start
- [ ] Finished a requirement? → `requirements.md`
- [ ] Fixed or found a problem? → `known-issues.md`

---

## 6. The `.env.example` file

Never commit real secrets (`.env` is git-ignored for this reason). Instead, commit a `.env.example` that lists **every** variable the app reads, with safe placeholder values and a one-line comment each. A new developer copies it to `.env` and fills it in.

Before this documentation pass, the backend's `.env.template` was empty, so the only way to learn the required variables was to read `configs/constants.ts`. That is exactly the kind of gap documentation should close.

---

## 7. Code comments vs. documentation

They answer different questions:

- **Documentation** explains how to use something and how the pieces fit together.
- **Comments** explain *why* a specific piece of code is the way it is, when the code itself cannot show it.

Good comment (states a constraint the code can't show):

```ts
// Razorpay expects the amount in paise (1 INR = 100 paise)
const amountInPaise = Math.round(params.amount * 100);
```

Unhelpful comment (repeats the code):

```ts
// Delete the pizza
await prisma.pizza.delete({ where: { id } });
```

---

## 8. Other documents real projects add over time

You don't need these yet, but you will see them in mature repositories:

| File | Purpose |
| ---- | ------- |
| `CHANGELOG.md` | Human-readable list of changes per release. See [Keep a Changelog](https://keepachangelog.com/). |
| `CONTRIBUTING.md` | How to set up, branch, commit and open a PR. |
| `LICENSE` | Legal terms for reuse. Without one, nobody may legally reuse the code. [choosealicense.com](https://choosealicense.com/) helps pick one. |
| `docs/adr/0001-*.md` | **Architecture Decision Records**: one short file per significant decision ("Use Prisma instead of Mongoose") with context, decision and consequences. They answer "why did we do it this way?" years later. |
| OpenAPI spec (`openapi.yaml`) | A machine-readable API reference that tools like Swagger UI turn into interactive docs, and that can generate client code. A natural next step after `api-reference.md`. |

### Commit messages are documentation too

This repo already uses a [Conventional Commits](https://www.conventionalcommits.org/)-style prefix (`feat:`, `chore:`). Keep it consistent, and write a subject that says what changed:

```text
feat(orders): restore ingredient stock when an order is cancelled
fix(auth): stop returning the reset token in the API response
docs: document admin endpoints in api-reference
```

---

## 9. Templates

### New endpoint (for `api-reference.md`)

````markdown
### `METHOD /path` (Access)

One sentence on what it does.

| Field | Type | Rules |
| ----- | ---- | ----- |
| `name` | string | required, at least 2 characters |

```json
{ "example": "request" }
```

**200** – what is returned.
**4xx** – when and why it fails.
````

### New known issue

```markdown
| Severity | What is wrong, in one sentence | `file/or/function` | How to fix it |
```
