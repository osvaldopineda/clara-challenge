# Clara — Multi-Step Insurance Quote Calculator

> **Clara Onboarding Team · Frontend Challenge**  
> A production-grade, multi-step insurance quote calculator built in React + TypeScript.

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Available Scripts](#available-scripts)
3. [Architecture & Decisions](#architecture--decisions)
4. [Business Logic & Testing Strategy](#business-logic--testing-strategy)
5. [Folder Structure](#folder-structure)
6. [Phase Roadmap](#phase-roadmap)

---

## Setup Instructions

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | `>= 18.x` |
| npm | `>= 9.x` |
| Git | `>= 2.x` |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/osvaldopineda/clara-challenge.git
cd clara-challenge

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**.

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint:fix

# Format with Prettier
npm run format

# Format check (CI-safe)
npm run format:check
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Compile TypeScript + bundle for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all `.ts` / `.tsx` files |
| `npm run lint:fix` | Run ESLint and auto-fix fixable issues |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing files (for CI) |
| `npm test` | Run Vitest unit tests once (CI mode) |
| `npm run test:watch` | Run Vitest in interactive watch mode |
| `npm run test:coverage` | Run tests and generate v8 coverage report |

---

## Architecture & Decisions

### ⚡ Vite — Build Tool

**Why Vite over Create React App (CRA)?**

CRA uses Webpack under the hood, which bundles *everything* before the browser can load a single module. Vite instead leverages **native ES Modules** during development: the browser requests individual files as needed, and Vite only transforms what is actually asked for. This results in:

- **Sub-second cold starts** regardless of project size.
- **True Hot Module Replacement (HMR)** that updates only the changed module without re-compiling the entire bundle.
- First-class TypeScript support with configurable `tsconfig.app.json` for application code and `tsconfig.node.json` for the Vite config file itself.

CRA is effectively unmaintained as of 2023. Vite is the community's accepted successor with an active ecosystem and support from the Vite/Rollup projects.

---

### 🎨 Material UI (MUI v6)

**Why MUI over plain CSS or Tailwind?**

The challenge calls for a professional, accessible form-heavy interface with consistent visual language. MUI provides:

- A **complete accessible component library** — inputs, steppers, buttons, dialogs — that come WCAG-compliant out of the box.
- The **`sx` prop and `theme`** system allow deep customisation without fighting the framework. The entire design token set (colors, typography, spacing, breakpoints) lives in one `theme.ts` file.
- **Emotion** (the CSS-in-JS engine powering MUI) performs server-side rendering, critical CSS extraction, and zero-runtime style injection automatically.

For a multi-step insurance flow, MUI's `Stepper` component is a perfect semantic fit.

---

### 📋 React Hook Form + Yup

**Why RHF + Yup over Formik or controlled state?**

Multi-step forms with large field counts are where *uncontrolled* form management shines.

| Concern | React Hook Form + Yup |
|---------|----------------------|
| **Re-renders** | Components do **not** re-render on every keystroke — inputs register themselves via refs. |
| **Validation** | Yup schemas are *schema-first*: a single `object().shape({})` declaration drives both runtime validation and TypeScript inference via `yup.InferType`. |
| **Multi-step persistence** | `useForm` + `context` allow step-level validation while accumulating data across steps without remounting. |
| **Resolver bridge** | `@hookform/resolvers/yup` adapts Yup schemas into RHF's resolver API with one line of code. |

Compared to Formik, RHF has zero-dependency overhead and benchmarks 10–20x fewer re-renders on complex forms.

---

### 🔀 React Router DOM v6

Used for declarative, nested routing between wizard steps. Each step is a distinct URL (`/quote/personal`, `/quote/coverage`, `/quote/summary`) enabling:

- **Browser history integration** — back/forward navigation works naturally.
- **Deep-linkable steps** for QA testing.
- URL-driven step validation guards will be added in Phase 3.

---

### 🆔 uuid

Deterministic ID generation for dynamic form fields, quote sessions, and list-rendering keys. Using `uuid v4` (random) avoids collisions in client-generated sessions without a backend round-trip.

---

## Folder Structure

```
src/
├── assets/
│   └── icons/              # SVG icons and static assets
│
├── components/
│   ├── common/             # Reusable, domain-agnostic UI atoms
│   │   └── index.ts        # Barrel export
│   ├── forms/              # Step-specific form components (StepPersonalInfo, etc.)
│   │   └── index.ts
│   └── layout/             # App shell: AppLayout, Navbar, Stepper wrapper
│       └── index.ts
│
├── context/
│   └── index.ts            # Global React context providers (QuoteContext)
│
├── hooks/
│   └── index.ts            # Custom hooks (useQuoteForm, useStepNavigation)
│
├── pages/
│   └── index.ts            # Route-level page components
│
├── services/
│   └── index.ts            # API calls and external data fetching
│
├── types/
│   ├── quote.types.ts      # Domain interfaces and enums
│   └── index.ts            # Barrel export
│
└── utils/
    └── index.ts            # Pure utility functions (formatCurrency, calculatePremium)
```

> **Barrel exports** (`index.ts`) in every directory enable clean, deep-import-free paths:  
> `import { Button } from '@/components/common'` instead of `../../components/common/Button/Button`.

---

## Business Logic & Testing Strategy

### Why Extract Pure Functions Before Touching React?

The premium calculation is the **core deliverable** of this application. By implementing it as a pure, stateless function *outside of any React component*, we achieve:

| Principle | Rationale |
|-----------|----------|
| **Separation of concerns** | The formula has zero dependency on React, MUI, or any UI library. It can be moved to a backend, a shared package, or a Web Worker without modification. |
| **Testability** | A pure function `f(input) → output` requires no DOM, no render cycle, and no mocking. Tests run in milliseconds. |
| **Determinism** | Given the same input, the function always returns the same output — no side effects, no shared state. |
| **Discoverability** | Business stakeholders can review `premiumCalculator.ts` in isolation. The math is not buried in a form `onSubmit` handler. |

### The Formula

Extracted directly from the Clara ONB Frontend Challenge PDF:

```
monthlyPremium = basePremium × ageMultiplier × conditionsMultiplier × tobaccoMultiplier × spouseMultiplier
```

#### Base Premiums

| Tier | Base Monthly Premium |
|------|---------------------|
| Basic | $50 |
| Standard | $100 |
| Premium | $200 |

#### Multipliers

| Factor | Condition | Multiplier |
|--------|-----------|------------|
| Age | `age > 65` | `× 1.5` |
| Pre-existing conditions | Any condition selected | `× 1.3` |
| Tobacco use | Uses any tobacco product | `× 1.2` |
| Spouse coverage | Spouse included | `× 1.4` |
| *(no condition)* | Not applicable | `× 1.0` |

#### Canonical Reference Example (from PDF)

> A **70-year-old** selecting **Standard coverage**, with a **pre-existing condition**, who **smokes**, and wants **spouse coverage**:
>
> `$100 × 1.5 × 1.3 × 1.2 × 1.4 = **$327.60 / month**`

### Testing Strategy

The test suite in `src/utils/premiumCalculator.test.ts` (31 tests) covers:

1. **PDF canonical example** — strict `toBe(327.60)` equality (not `toBeCloseTo`)
2. **Base premium isolation** — each tier with all multipliers at 1.0
3. **Single-multiplier isolation** — each factor tested independently
4. **Combined multipliers** — pairwise and all-four-factors combinations across all tiers
5. **Age boundary conditions** — ages 0, 64, 65 (excluded), 66 (first senior), 100
6. **Floating-point precision** — `Math.round(raw * 100) / 100` prevents drift like `327.5999...`
7. **Result shape contract** — returned object always has all expected keys
8. **Input validation/guards** — `RangeError` on negative age, `TypeError` on unknown tier

```bash
# Run the full suite
npm test

# With coverage (src/utils/ only)
npm run test:coverage
```

---

## Phase Roadmap

| Phase | Title | Status |
|-------|-------|--------|
| **1** | Scaffolding, Tooling & Base Configuration | ✅ Complete |
| **2** | Core Business Logic & Unit Testing | ✅ Complete |
| **3** | MUI Theme & Global Layout | ✅ Complete |
| **4** | Quote Context & React Router Wizard | ✅ Complete |
| **5** | Form Steps with RHF + Yup Validation | 🔜 Planned |
| **6** | Quote Summary, Polish & Final QA | 🔜 Planned |

---

## Theme Configuration

The Clara MUI theme lives in `src/theme/index.ts` and is injected via `ThemeProvider` in `src/main.tsx`.

### Color Palette

| Token | Value | Use |
|-------|-------|-----|
| Primary — Clara Navy | `#1B3A6B` | Header, active step, primary CTAs |
| Primary Light | `#2A5298` | Hover states |
| Secondary — Warm Teal | `#0097A7` | Completed steps, success accents |
| Background Default | `#F5F7FA` | Page surface |
| Background Paper | `#FFFFFF` | Cards, inputs |

### Typography

**Inter** (Google Fonts) is loaded via a `MuiCssBaseline` global `@import`. It was chosen for its exceptional screen legibility at form-field sizes and its neutral, professional character — widely used in fintech products.

### Key Component Overrides

| Component | Override |
|-----------|----------|
| `MuiButton` | `borderRadius: 8`, lift animation on hover, `textTransform: none` |
| `MuiOutlinedInput` | White background, navy border on focus |
| `MuiStepIcon` | Active = navy with glow, Completed = teal |
| `MuiPaper` | `elevation: 0`, replaced with `border: 1px solid #E2E8F0` |

---

## Context & Routing Architecture

### Global State (QuoteContext)

`src/context/QuoteContext.tsx` manages the complete wizard state using `useReducer`, giving predictable state transitions without Redux overhead.

```
action → reducer → new state → useEffect → localStorage
                            ↘ re-render
```

**State shape:**

| Slice | Stored in localStorage? | Notes |
|-------|------------------------|-------|
| `personalInfo` | ✅ Yes | Hydrated on mount |
| `coverage` | ✅ Yes | Hydrated on mount |
| `premium` | ❌ No | Always recomputed from source data |

**Design decisions:**
- The premium is excluded from storage because it is a **pure derivation** — storing it would risk stale values if the multiplier constants ever change.
- On `RESET`, both state and `localStorage` are cleared atomically.
- The `readFromStorage` / `writeToStorage` helpers are wrapped in `try/catch` to handle private-browsing mode and storage quota errors gracefully.

### localStorage Persistence

Key: `clara_quote_draft`  
Format: `{ personalInfo: {...} | null, coverage: {...} | null }`

The draft is synced on every state change via `useEffect([state])`. If the user refreshes mid-form, their progress is restored automatically.

### React Router Setup

| URL | Component | Notes |
|-----|-----------|-------|
| `/` | — | Redirects to `/quote/personal-info` |
| `/quote/personal-info` | `StepPersonalInfo` | Step 1 |
| `/quote/coverage` | `StepCoverage` | Step 2 (+ conditional health Qs) |
| `/quote/summary` | `StepSummary` | Step 3 |
| `*` (any other) | — | Redirects to Step 1 |

All step routes share the `QuoteLayout` component which renders `AppLayout` with `<Outlet />`. This keeps the header and stepper mounted across step navigations (no remounting).

### FormStepper → useLocation

The stepper derives `activeStep` from `useLocation().pathname` via `STEP_ROUTES.findIndex()`. No prop drilling, no context subscription — the URL is the single source of truth for navigation state.

---

*Built with ❤️ for Clara's Onboarding Team.*
