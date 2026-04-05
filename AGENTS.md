# AGENTS.md

## Project overview

**WIZARD_FRESH** — Document Import Wizard. A multi-step wizard UI that reads training documentation, extracts user journey / process map information (via built-in or external LLM APIs), and exports to diagram creation tools (Mermaid, BPMN XML, JSON, CSV, PDF, Process-Map-V1).

## Key reference files

| File | Purpose |
|------|---------|
| `reference/doc_import_wizard_complete.html` | Self-contained HTML prototype — single source of truth for layout, interactions, and design |
| `reference/CURSOR_INSTRUCTIONS.md` | Detailed build spec: stack, project structure, component specs, data types, state management, colour tokens |
| `reference/.cursorrules` | Cursor-specific coding rules and conventions |
| `reference/package.json.reference` | Dependency list for the planned React + TypeScript build |
| `files.zip` | Original archive containing the above files |

## Cursor Cloud specific instructions

### Available system tools
- **Git**: 2.43
- **Node.js**: v22 (managed via nvm)
- **npm**: 10.x, **pnpm**: 10.x, **yarn**: 1.x
- **Python**: 3.12

### Project status
The repository is pre-build. The HTML prototype is complete and functional. No React application has been scaffolded yet. When the build begins, follow the stack and structure defined in `reference/CURSOR_INSTRUCTIONS.md`.

### Planned stack (from CURSOR_INSTRUCTIONS.md)
- React 18 + TypeScript + Vite
- Tailwind CSS, Zustand, @dnd-kit, react-zoom-pan-pinch, react-dropzone
- See `reference/package.json.reference` for dependency versions

### Export targets

| Target | Repo | Format | Primary entry point |
|--------|------|--------|-------------------|
| Mermaid | `mermaid-js/mermaid` | `.mmd` text | Text generation (no library needed) |
| BPMN XML | `bpmn-io/bpmn-js` | `.bpmn` XML | `bpmn-moddle` standalone (~100KB) |
| Process-Map-V1 | `tigges/process-map-V1` | JSON (`ProcessMapProject`) | `importProject(json)` |
| Workflow-designer | `tigges/Workflow-designer` | JSON (`{title, nodes, connections}`) | `loadFlowObject(json)` |
| HTML | (self-contained) | `.html` | Template engine generating interactive single-file HTML |
| JSON / CSV / PDF | (built-in) | various | Direct serialization |

### Notes
- The update script (`SetupVmEnvironment`) is currently a no-op. Update it to `pnpm install` once a root `package.json` exists.
- The HTML prototype can be opened directly in a browser for visual reference — no build step needed for `reference/doc_import_wizard_complete.html`.
- Sample import PDFs are `.gitignore`d — keep proprietary training docs local only.
