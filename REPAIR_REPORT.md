# Sidra Repository Repair Report

Scope of this pass: your uploaded `Sydra_Project_1_to_1105.zip` (1037 files at
the time of upload). This report documents exactly what was found and fixed
through static analysis. **No network-based build (`npm install` / `next
build`) could be run in this environment — see "What was not verified" below
before deploying.**

---

## Critical fix: 562 files had the wrong extension (`.ts` instead of `.tsx`)

This is almost certainly the root cause of the repeated, cascading build
errors you were seeing. Each of these 562 files:

- Contained real JSX (`<Badge>`, `<Card>`, etc.) but was saved as `.ts`.
  TypeScript's compiler refuses to parse JSX syntax inside a `.ts` file —
  every one of these would throw a hard parse error on build.
- Also had a stray leftover `x` character as the very first line of the file
  (a copy/paste artifact — almost certainly a fragment of a ` ```tsx ` code
  fence that got stripped incorrectly, leaving just the `x`).

**Fix applied:** stripped the stray leading `x` line, then renamed the file
from `.ts` to `.tsx`. Verified afterward that no import anywhere in the repo
hardcodes a `.ts` extension for these files, so nothing else needed updating.

Full list of the 562 renamed files is in `FILE_MANIFEST.csv` under the
`ts_to_tsx_rename` action.

## Config-zone corruption (7 files)

The repo's small root/config files (`package.json`, `tsconfig.json`,
`.vscode/*`, etc.) matched the same 50 files delivered earlier in our
conversation as `sydra_1_to_50_.docx`. Cross-checking against that
already-verified-clean source found:

| File in repo | Problem | Fix |
|---|---|---|
| `tsconfig.json` | Valid JSON was followed by ~49,000 stray characters — the entire content of files #3–#50 had been accidentally pasted in after it | Replaced with clean, verified content |
| `components.js` | Wrong extension — file was actually JSON | Removed, replaced with `components.json` |
| `lighthouserc.js` | Wrong extension — file was actually JSON | Removed, replaced with `lighthouserc.json` |
| `firebase.js` | Wrong extension + had `.editorconfig` content leaked onto the end | Removed, replaced with clean `firebase.json` |
| `.vscode/settings.js` | Wrong extension | Removed, replaced with `.vscode/settings.json` |
| `.vscode/launch.js` | Wrong extension | Removed, replaced with `.vscode/launch.json` |
| `.vscode/tasks.js` | Wrong extension + had snippet content leaked onto the end | Removed, replaced with `.vscode/tasks.json` |
| `.vscode/extensions.js` | Wrong extension | Removed, replaced with `.vscode/extensions.json` |

## Missing file restored

`.github/CODEOWNERS` did not exist anywhere in the repo — its content had
leaked onto the end of `.github/pull_request_template.md` instead. Both
files have been restored to their correct, separate content.

## YAML syntax bugs (6 files)

Word's autocorrect had converted a handful of closing straight quotes (`"`)
into curly quotes (`"`) inside YAML string values, which breaks the YAML
parser (unterminated string). Fixed in:

- `.github/FUNDING.yml`
- `.github/dependabot.yml`
- `.github/workflows/release.yml`
- `.github/workflows/lighthouse.yml`
- `.github/workflows/firebase-emulator-tests.yml`
- `.github/workflows/firebase-hosting.yml` (separate issue: a `projectId:`
  line was indented one space less than its sibling keys, breaking the YAML
  block mapping — re-indented to match)

**Note:** `resora-bd7c5` appearing throughout `.env`, `constants/firebase.ts`,
`constants/app.ts`, and the GitHub workflow files is **not** a bug — it's
your real, currently-active Firebase project ID from earlier in this
project's history. It was left untouched everywhere.

## Broken imports (17 total, all resolved)

- `components/disputes/DisputeAnalyticsCards.tsx` imported `MetricCard` from
  a `components/dashboard/` folder that never existed. The real `MetricCard`
  component already exists at `components/ui/MetricCard.tsx`. Fixed the
  import path, and updated the five `<MetricCard title="...">` call sites to
  `label="..."` to match that component's actual prop name.
- `components/reviews/ReviewRatingBadge.tsx` and
  `components/dashboard`-adjacent expectations: `ReviewRatingBadge` was
  imported by `ReviewModerationCard.tsx` and `ReviewModerationDialog.tsx`
  (as `<ReviewRatingBadge rating={review.rating} />`) but was never created
  in any of your source documents. Built a real implementation matching the
  exact styling pattern of its sibling `ReviewModerationStatusBadge.tsx`
  (same `Badge` primitive, same conventions).
- `components/reviews/index.ts` and `components/warranty/index.ts` (barrel
  export files) listed several components that were never generated in your
  1105-file source set (e.g. `CreateReviewDialog`, `ReviewCard`,
  `ReviewList`, `WarrantyHeader`, `WarrantyEvidenceGallery`, and others —
  full list in `FILE_MANIFEST.csv`). These weren't imported by anything
  other than the barrel file itself, so both `index.ts` files were
  regenerated to export exactly the components that actually exist on disk.
  **If you intended for those named components to exist as distinct pieces,
  they still need to be written — they were never part of the source
  material.**

## Full validation after all fixes

- All `.json` files parse as valid JSON: **0 failures**
- All `.yml` / `.yaml` files parse as valid YAML: **0 failures**
- Every local `import ... from "@/..."` / `"./..."` / `"../..."` in the repo
  resolves to a real file: **0 broken imports**
- Braces balanced in every `.ts` / `.tsx` file: **0 mismatches**
- `"use client"` is the first statement in every file that declares it:
  confirmed
- `app/error.tsx` and `app/global-error.tsx` both correctly start with
  `"use client"`: confirmed
- All Next.js App Router special files present with correct names:
  `layout.tsx`, `page.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`,
  `not-found.tsx`, `template.tsx`

---

## What was NOT verified (important)

This sandbox has **no internet access**, so the following from the original
repair request could not actually be run, and I'm not claiming they pass:

- `npm install` — package versions in `package.json` were not checked
  against the npm registry, and `package-lock.json` was not regenerated
- `npm run typecheck` (`tsc`) — full TypeScript type-checking across the
  project (as opposed to the structural/syntax checks above) was not run
- `npm run lint`
- `npm run build` (Next.js production build)
- Firebase Functions build/compile

The fixes above eliminate every corruption pattern that *was* checkable
through static analysis (the kind of bug that produces the exact
"module not found" / parse-error cascades you were hitting). But a real
type error inside otherwise-syntactically-valid code, or a missing npm
dependency, would only surface once you actually run `npm install && npm run
build` yourself (locally, in Codespaces, or on Vercel/Netlify).

**Recommended next step:** commit this repaired zip, then run the build
once. If it fails, paste the exact log here the same way you did before —
at this point any remaining errors should be a short, specific list rather
than the sprawling cascade you were seeing, since the two systemic root
causes (562 mis-extensioned files, corrupted config zone) are gone.
