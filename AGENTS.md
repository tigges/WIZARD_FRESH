## Cursor Cloud specific instructions

This is a Vite + React + TypeScript project in `/workspace/wizard/`.

- **Package manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Type-check**: `pnpm tsc -b` (uses `tsconfig.app.json` with `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters`)
- **Lint**: `pnpm lint` (ESLint 9 flat config)
- **Dev server**: `pnpm dev` (Vite)
- **Build**: `pnpm build` (tsc + vite build)
- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- All colors use inline styles, not Tailwind color classes (Tailwind is installed but only used for non-color utilities)
