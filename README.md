# TypeScript Mastery

A complete, production-grade learning repository covering TypeScript from first principles to expert-level patterns — with real-world applications in Ecommerce, Auth, REST APIs, CMS, SaaS, and Marketplace domains.

---

## Goals

- Build a deep, working understanding of every TypeScript concept
- See every concept side-by-side with its JavaScript equivalent
- Learn through real-world examples, not contrived toy code
- Practice with exercises that mirror what you'd write on the job
- Prepare for senior/staff-level TypeScript interviews

---

## Prerequisites

| Skill | Level Required |
|---|---|
| JavaScript (ES2020+) | Comfortable |
| HTML/CSS | Basic |
| Node.js | Basic |
| Terminal | Basic |
| Git | Basic |

---

## Setup

```bash
# Install dependencies
npm install

# Type-check all files (no emit)
npm run typecheck

# Run a specific TypeScript file
npx tsx 01-type-annotations/examples/01-basic-annotations.ts

# Watch mode for type checking
npm run typecheck:watch

# Run tests
npm test
```

---

## Learning Roadmap

### Phase A — Beginner (Topics 01–05)
> Goal: Replace JavaScript mental model with TypeScript mental model

| # | Topic | Key Concept |
|---|---|---|
| 01 | Type Annotations | Adding types to variables, params, return values |
| 02 | Everyday Types | string, number, boolean, any, unknown, never, void |
| 03 | Functions | Typed functions, overloads, callbacks |
| 04 | Objects & Interfaces | Structuring data with types and interfaces |
| 05 | Union Types & Narrowing | Handling multiple types safely |

### Phase B — Intermediate (Topics 06–12)
> Goal: Write idiomatic, reusable TypeScript

| # | Topic | Key Concept |
|---|---|---|
| 06 | Generics | Type-safe reusability |
| 07 | Classes | OOP with full type safety |
| 08 | Modules | ES module system with TypeScript |
| 09 | Enums | Named constant sets |
| 10 | Utility Types | Built-in type transformers |
| 11 | Mapped Types | Transform types programmatically |
| 12 | Conditional Types | Types that depend on other types |

### Phase C — Advanced (Topics 13–18)
> Goal: Master the TypeScript type system

| # | Topic | Key Concept |
|---|---|---|
| 13 | Template Literal Types | String-based type manipulation |
| 14 | Decorators | Metadata and class augmentation |
| 15 | Declaration Files | Writing `.d.ts` for libraries |
| 16 | Advanced Type Patterns | Recursive types, variadic tuples, branded types |
| 17 | Error Handling | Type-safe errors, Result types |
| 18 | Async Patterns | Promise types, concurrent patterns |

### Phase D — Expert / Real-World (Topics 19–25)
> Goal: Apply TypeScript in production-grade systems

| # | Topic | Key Concept |
|---|---|---|
| 19 | Design Patterns | SOLID, GoF patterns in TypeScript |
| 20 | Ecommerce Project | Product catalog, cart, checkout, payments |
| 21 | Auth System | JWT, sessions, OAuth, RBAC |
| 22 | REST API | Express/Fastify fully typed |
| 23 | CMS System | Content models, blocks, rendering pipeline |
| 24 | SaaS Platform | Multi-tenancy, subscriptions, billing |
| 25 | Marketplace | Listings, reviews, transactions, search |

---

## Topic Folder Structure

Every topic follows the same layout:

```
NN-topic-name/
├── README.md                    ← Concept explanation, syntax, best practices
├── examples/
│   ├── 01-*.ts                  ← Focused, single-concept examples
│   ├── 02-*.ts
│   └── ...
├── javascript-equivalent/
│   ├── 01-*.js                  ← Side-by-side JS comparison for every TS example
│   └── ...
├── practice/
│   ├── 01-*.ts                  ← Exercises (stubs with instructions in comments)
│   └── ...
└── solutions/
    ├── 01-*.ts                  ← Fully worked solutions
    └── ...
```

### What each README.md covers

1. **What it is** — one-paragraph plain-English explanation
2. **Why it exists** — the problem it solves over plain JavaScript
3. **Syntax** — annotated code blocks showing every valid syntax form
4. **Real-world usage** — how it appears in actual codebases
5. **Best practices** — what senior engineers actually do
6. **Common mistakes** — bugs and misconceptions to avoid
7. **JS vs TS comparison** — concrete before/after
8. **Interview questions** — common interview questions with model answers

---

## Topic List

### 01 — Type Annotations
Explicit type declarations on variables, function parameters, and return values. The entry point to TypeScript.

### 02 — Everyday Types
The type vocabulary you'll use 90% of the time: primitives, `any`, `unknown`, `never`, `void`, arrays, tuples.

### 03 — Functions
Typed function expressions, arrow functions, optional/default parameters, rest parameters, overloads.

### 04 — Objects & Interfaces
Structuring objects with `type` and `interface`. Extending, merging, and picking between them.

### 05 — Union Types & Narrowing
Combining types with `|`, then safely narrowing them with `typeof`, `instanceof`, `in`, and discriminated unions.

### 06 — Generics
Writing functions, classes, and interfaces that work across types. Constraints, defaults, and variance.

### 07 — Classes
Full OOP with `public`/`private`/`protected`/`readonly`, abstract classes, implementing interfaces, parameter properties.

### 08 — Modules
`import`/`export` in TypeScript, module resolution, re-exports, ambient modules, `/// <reference>`.

### 09 — Enums
Numeric enums, string enums, `const enum`, heterogeneous enums, and when to prefer union types instead.

### 10 — Utility Types
`Partial`, `Required`, `Readonly`, `Record`, `Pick`, `Omit`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `InstanceType`, and more.

### 11 — Mapped Types
Creating new types by iterating over keys. Key remapping with `as`, adding/removing modifiers.

### 12 — Conditional Types
`T extends U ? X : Y`. The `infer` keyword. Distributive conditional types. Recursive conditional types.

### 13 — Template Literal Types
Constructing string types from unions. Pattern matching on string types. Building typed event systems.

### 14 — Decorators
Stage 3 decorators for classes, methods, fields, and accessors. Use cases: logging, validation, dependency injection.

### 15 — Declaration Files
Writing `.d.ts` files to type untyped JavaScript libraries. Ambient modules. Publishing types with packages.

### 16 — Advanced Type Patterns
Recursive types, variadic tuple types, branded/opaque types, `satisfies` operator, `infer` deep dives.

### 17 — Error Handling
`Result<T, E>` pattern, discriminated union errors, typed `try/catch`, `never` for exhaustiveness.

### 18 — Async Patterns
`Promise<T>`, `async`/`await`, `Promise.all/race/allSettled/any`, async generators, cancellation.

### 19 — Design Patterns
SOLID principles in TypeScript. GoF patterns (Factory, Builder, Observer, Strategy, etc.) with full type safety.

### 20 — Ecommerce Project
End-to-end type system: products, variants, inventory, cart, checkout, orders, payments, shipping.

### 21 — Auth System
User registration/login, JWT generation/validation, session management, OAuth2 flows, RBAC.

### 22 — REST API
Fully typed Express/Fastify API: request/response types, middleware, validation with Zod, OpenAPI generation.

### 23 — CMS System
Content types, rich text blocks, page builder, media types, localization, publishing workflow.

### 24 — SaaS Platform
Tenant isolation, subscription plans, feature flags, usage metering, billing webhooks, team management.

### 25 — Marketplace
Listings, search/filter types, buyer/seller profiles, reviews, transactions, escrow, dispute resolution.

---

## Tools & Configuration

| Tool | Purpose |
|---|---|
| TypeScript 5+ | Compiler and type checker |
| `tsx` | Run `.ts` files directly (no compile step) |
| `vitest` | Testing framework |
| ESLint + `@typescript-eslint` | Linting |
| Prettier | Formatting |

---

## Configuration Files

| File | Purpose |
|---|---|
| `tsconfig.base.json` | Strict base config — extended by all topics |
| `tsconfig.json` | Root config for whole-repo type-checking |
| `package.json` | Scripts and dependencies |

---

## Progress Tracker

Track your progress by checking off topics as you complete them:

- [ ] 01 — Type Annotations
- [ ] 02 — Everyday Types
- [ ] 03 — Functions
- [ ] 04 — Objects & Interfaces
- [ ] 05 — Union Types & Narrowing
- [ ] 06 — Generics
- [ ] 07 — Classes
- [ ] 08 — Modules
- [ ] 09 — Enums
- [ ] 10 — Utility Types
- [ ] 11 — Mapped Types
- [ ] 12 — Conditional Types
- [ ] 13 — Template Literal Types
- [ ] 14 — Decorators
- [ ] 15 — Declaration Files
- [ ] 16 — Advanced Type Patterns
- [ ] 17 — Error Handling
- [ ] 18 — Async Patterns
- [ ] 19 — Design Patterns
- [ ] 20 — Ecommerce Project
- [ ] 21 — Auth System
- [ ] 22 — REST API
- [ ] 23 — CMS System
- [ ] 24 — SaaS Platform
- [ ] 25 — Marketplace

---

## How to Use This Repo

1. **Work linearly** through topics 01–18 if you're building fundamentals
2. **Jump to Phase D** (topics 19–25) if you want real-world context first
3. **Read the README** in each topic folder before opening any `.ts` file
4. **Run the examples** with `npx tsx <file>`
5. **Attempt the practice** exercises before looking at solutions
6. **Compare with JS equivalents** to understand what TypeScript adds

---

## License

MIT
