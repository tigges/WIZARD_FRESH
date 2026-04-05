# AGENTS.md

## Project overview

**WIZARD_FRESH** — Document Import Wizard. A multi-step wizard UI that reads training documentation, extracts user journey / process map information (via built-in or external LLM APIs), and exports to diagram creation tools (Mermaid, BPMN XML, JSON, CSV, PDF, Process-Map-V1, Workflow-designer, HTML).

## Key reference files

| File | Purpose |
|------|---------|
| `reference/doc_import_wizard_complete.html` | Self-contained HTML prototype — single source of truth for layout, interactions, and design |
| `reference/CURSOR_INSTRUCTIONS.md` | Detailed build spec: stack, project structure, component specs, data types, state management, colour tokens |
| `reference/.cursorrules` | Cursor-specific coding rules and conventions |
| `reference/package.json.reference` | Original dependency list |
| `reference/BPMN_EXPORT_RESEARCH.md` | Comprehensive bpmn-io/BPMN 2.0 export target research |

## Cursor Cloud specific instructions

### Working directory
All commands run from `/workspace/wizard/`.

### Commands
- **Dev server**: `pnpm dev` → `http://localhost:5173/WIZARD_FRESH/`
- **Build**: `pnpm build` → `wizard/dist/`
- **Type-check**: `npx tsc -b --noEmit`
- **Lint**: `pnpm lint` (ESLint 9 flat config)

### Coding rules
- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- All colors use inline styles, not Tailwind color classes
- TypeScript strict mode — no `any`, no `@ts-ignore`
- Components should be small and focused — split if >150 lines

### Export targets

| Target | Format | Primary entry point |
|--------|--------|-------------------|
| Mermaid | `.mmd` text | Text generation |
| BPMN XML | `.bpmn` XML | `bpmn-moddle` standalone |
| Process-Map-V1 | JSON | `importProject(json)` |
| Workflow-designer | JSON | `loadFlowObject(json)` |
| HTML | `.html` | Template engine |
| JSON / CSV / PDF | various | Direct serialization |

### Notes
- Sample import PDFs are `.gitignore`d — keep proprietary training docs local only.
- The HTML prototype (`reference/doc_import_wizard_complete.html`) can be opened directly in a browser for visual reference.
- GitHub Pages deploys automatically via `.github/workflows/deploy.yml`.
