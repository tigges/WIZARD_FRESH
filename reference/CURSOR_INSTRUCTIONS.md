# Document Import Wizard — Cursor Build Instructions

## Overview

Convert `src/doc_import_wizard_complete.html` into a production React + TypeScript application. The HTML prototype is the single source of truth for all layout, interaction, and design decisions. Do not deviate from it unless explicitly noted below.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Styling | Tailwind CSS (use only core utilities) |
| State | Zustand |
| Drag & drop | @dnd-kit/core |
| Canvas / pan-zoom | react-zoom-pan-pinch |
| Diagram SVG | Hand-rendered SVG (as in prototype) |
| File handling | react-dropzone |
| Build | Vite |

---

## Project Structure

```
wizard/
├── src/
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── WizardShell.tsx          # Modal overlay + header stepper
│   │   │   ├── WizardFooter.tsx         # Back / Continue / Run Import / Open in Editor
│   │   │   ├── steps/
│   │   │   │   ├── Step1Upload.tsx      # File drop + file list
│   │   │   │   ├── Step2PageMap.tsx     # Page-by-page map (left: structure, right: interpretation)
│   │   │   │   ├── Step3Settings.tsx    # Model selector + output toggles
│   │   │   │   ├── Step4Review.tsx      # Cluster bar + process list
│   │   │   │   ├── Step5Preview.tsx     # Canvas diagram viewer
│   │   │   │   └── Step6Complete.tsx    # Import summary + export selector
│   │   ├── shared/
│   │   │   ├── PillsBar.tsx             # Shared filter pills (steps 2,3,4,5)
│   │   │   ├── SectionTitle.tsx         # Consistent section header + subtitle
│   │   │   ├── ClusterBox.tsx           # Draggable cluster card
│   │   │   ├── ProcessRow.tsx           # Expandable process row
│   │   │   ├── StepRow.tsx              # Step/sub-process row inside process
│   │   │   ├── TileCard.tsx             # Page map interpretation tile
│   │   │   └── DiagramCanvas.tsx        # SVG canvas with zoom/pan/minimap
│   ├── store/
│   │   ├── wizardStore.ts               # Step state, navigation
│   │   ├── clusterStore.ts              # Cluster order, active filter
│   │   ├── processStore.ts              # Process list, expanded state, edits
│   │   └── canvasStore.ts               # Zoom, pan, active cluster for preview
│   ├── data/
│   │   ├── clusters.ts                  # 8 cluster definitions (colour, themes, count)
│   │   ├── processes.ts                 # Process + step definitions
│   │   ├── diagrams.ts                  # SVG node/edge data per cluster
│   │   └── pageMapPages.ts             # 4 sample page map entries
│   ├── types/
│   │   └── index.ts                     # Cluster, Process, Step, Node, Edge, PageMapPage
│   ├── App.tsx
│   └── main.tsx
├── public/
├── CURSOR_INSTRUCTIONS.md
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Design System

Extract these directly from the prototype CSS variables — do not change the values:

```ts
// src/styles/tokens.ts
export const tokens = {
  bg:      '#ffffff',
  bg2:     '#fafafa',
  bg3:     '#f4f5f7',
  bd:      '#e5e5e5',
  bd2:     '#d0d0d0',
  bd3:     '#bbbbbb',
  t1:      '#1a1a1a',
  t2:      '#555555',
  t3:      '#888888',
  t4:      '#bbbbbb',
  stepBg:  '#EBF2FF',
  stepSt:  '#3B7DE8',
  stepTx:  '#1A3A7A',
  deciBg:  '#FFFDE7',
  deciSt:  '#C9960A',
  deciTx:  '#7A5200',
  shadow:  '0 12px 48px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.08)',
}
```

---

## Data Types

```ts
// src/types/index.ts

export interface ThemeTag {
  label: string
  bg: string
  bc: string
  tc: string
}

export interface Cluster {
  id: string
  name: string        // may contain \n for line break
  color: string       // hex — left border + alpha badge bg
  tc: string          // light bg
  bc: string          // border
  themes: ThemeTag[]
  count: number
}

export interface ProcessStep {
  id: string          // e.g. '1.1'
  icon: 'action' | 'decision'
  label: string
  type: string        // from typeOpts dropdown
  conn: string        // connection label e.g. '→ KYC Verification'
}

export interface Process {
  id: number
  label: string
  type: string
  cluster: string     // cluster id
  conn: string
  steps: ProcessStep[]
}

export interface DiagramNode {
  id: string
  x: number
  y: number
  type?: 'start' | 'end'
  w?: number
  h?: number
  label?: string
  sub?: string
}

export interface DiagramEdge {
  f: string           // from node id
  t: string           // to node id
  lbl?: string
}

export interface Diagram {
  w: number
  h: number
  nodes: DiagramNode[]
  edges: DiagramEdge[]
}

export interface PageMapTile {
  tl: string          // type label e.g. 'Category header'
  tc: string          // bg colour
  tb: string          // border colour
  tt: string          // text colour
  ti: string          // title
  td: string          // description
  cf: number          // confidence 0–100
}

export interface PageMapBlock {
  t: string
  l: string           // label
  i: string           // icon char
  n: number           // count
  a: boolean          // active/detected
  bg: string
  ic: string
}

export interface PageMapPage {
  blocks: PageMapBlock[]
  tiles: PageMapTile[]
  kw: string[]
}
```

---

## Step-by-step Component Specs

### WizardShell

- Fixed-width modal: `max-width: 860px`, centred, `border-radius: 16px`
- Semi-transparent backdrop: `rgba(0,0,0,0.38)`
- Box shadow from tokens
- Header: 6-step stepper (dots: idle / active / done) + htitle + hsub
- Dot states: idle = `#f0f0f0`, active = `#1a1a1a` + ring, done = `#1a1a1a` + ✓
- Step labels truncate with `text-overflow: ellipsis`
- Pills bar renders on steps 2, 3, 4, 5 — hidden on 1 and 6

### Step1Upload — "Files"

- Section title: **Files** · "Select document to import"
- `react-dropzone` drop zone: dashed border, hover darkens border + bg
- File list below: each row has coloured type badge (PDF/DOC), filename, meta, checkbox circle
- Only one file selectable at a time
- Selected file shows filled black checkbox with white tick SVG

### Step2PageMap — "Page map"

- Pills bar at top
- Page navigator: ← / input / of 142 / →
- Two-column grid: 148px left (Page structure) | flex right (Import interpretation)
- Left: list of block type rows — icon chip + label + count, highlighted if active
- Right: stacked TileCard components — each has coloured header (type badge + title) + body (description + confidence bar)
- Confidence bar animates width on mount (CSS transition)
- Footer: Keywords label + kw tags

### Step3Settings — "Settings"

- Pills bar at top
- Import model: row of clickable model option buttons (Raw, Wizard, Gemini [default], Claude, + Add New)
  - Selected state: black bg + white text
  - Add New: dashed border
- Output type: `<select>` full width
- Toggles: label + sub + right-aligned toggle switch for 5 options

### Step4Review — "Review & edit structure"

- Pills bar at top (all types)
- **Clusters** section: horizontal scroll of ClusterBox cards
  - Each: A–H alpha badge, drag handle (⠿), cluster name (may be 2 lines), process count, theme pills
  - Left border = cluster colour
  - Drag to reorder using @dnd-kit/core — update order in clusterStore
  - Click to filter process list (toggle — click again to clear)
  - Active: inner shadow `0 0 0 1.5px #1a1a1a`
  - Dimmed: `opacity: 0.25`
- Meta pills row: Processes / Sub-processes / Steps / Connections / Facts / Unassigned (red if >0)
- **Processes** section title: "Processes" · "Click row number to expand steps"
- ProcessRow: 5-col grid `22px 14px 1fr 82px 16px`
  - Numbered circle (cluster colour bg) — click to expand/collapse
  - Type icon SVG (rect outline, stroke = cluster colour)
  - Label (editable on click — `contentEditable`) + connection sub-label
  - Type `<select>` (coloured border/bg = cluster ramp)
  - × remove button (red on hover)
- Expanded: StepRow list indented 12px — same structure, smaller
- Step icons: action = filled rect (cluster colour, 70% opacity), decision = diamond (cluster colour)

### Step5Preview — "Preview"

- Pills bar at top
- **Clusters** section title + cluster filter tag row (coloured pills, click to switch diagram)
- **Processes / Steps flow map** section title + hint
- DiagramCanvas:
  - Toolbar: Select (V) | Hand (H) | separator | zoom− | zoom% (click to reset) | zoom+ | fit | separator | cluster name + count badge | hint text right-aligned
  - Viewport: 400px height, bg `#edf0f9`
  - `react-zoom-pan-pinch` for transform — expose `scale`, `panX`, `panY`
  - SVG rendered inside transform wrapper
  - Keyboard: V = select tool, H = hand tool
  - Scroll wheel = zoom
  - Corner zoom buttons (+/−)
  - Minimap: 108×68px, bottom-right, shows scaled clone of SVG + viewport rect overlay
  - Legend bar below canvas: Start (green) | Action/step (blue box) | Decision (yellow diamond) | End (red)
  - "Read only — edit in step 4" note right-aligned in legend
- DiagramCanvas renders SVG from `diagrams.ts` data:
  - Start node: green circle r=14, "Start" white text
  - End node: red circle r=14, "End" white text
  - Action node: blue rect rx=7, `#EBF2FF` fill, `#3B7DE8` stroke 1.5px
  - Decision node: yellow diamond (polygon), `#FFFDE7` fill, `#C9960A` stroke 1.5px
  - Edges: grey path `#b0b0b0` stroke 1.2px, arrowhead marker, L-bend routing when Δy > 10px
  - Edge labels: 8.5px, `#666`

### Step6Complete — "Import complete"

- Two-column layout (50/50), min-height 320px
- Left: green check circle + "Import complete" title, summary rows (key/value), validation block
  - Validation dots: green = ok, amber = warning
- Right: "Export to" title + subtitle, format list
  - Each format: icon badge + name + description + radio circle
  - Selected: black icon bg, black border on row
  - Formats: Mermaid, Process-Map-V1, BPMN XML, JSON, CSV, PDF

---

## State Management (Zustand)

```ts
// wizardStore.ts
interface WizardState {
  currentStep: number        // 1–6
  goTo: (step: number) => void
  next: () => void
  back: () => void
}

// clusterStore.ts
interface ClusterState {
  clusters: Cluster[]
  activeCluster: string | 'all'
  reorder: (fromIdx: number, toIdx: number) => void
  setActive: (id: string) => void
}

// processStore.ts
interface ProcessState {
  processes: Process[]
  expanded: Record<number, boolean>
  toggle: (id: number) => void
  remove: (id: number) => void
  updateLabel: (id: number, label: string) => void
  updateType: (id: number, type: string) => void
  updateStepType: (processId: number, stepId: string, type: string) => void
}

// canvasStore.ts
interface CanvasState {
  activeCluster: string
  tool: 'select' | 'hand'
  setCluster: (id: string) => void
  setTool: (t: 'select' | 'hand') => void
}
```

---

## Key Interactions to Preserve

| Interaction | Component | Notes |
|---|---|---|
| File selection | Step1Upload | Single select, checkbox fills on select |
| Page navigation | Step2PageMap | ← / → / direct input, clamps to 1–142 |
| Confidence bar animation | TileCard | CSS transition on mount, delay 60ms |
| Model toggle | Step3Settings | Mutually exclusive, Gemini default |
| Cluster drag-reorder | ClusterBox | @dnd-kit, updates alpha labels A–H |
| Cluster click-filter | ClusterBox | Toggle, dims all others, filters process list |
| Process expand/collapse | ProcessRow | Click numbered circle only |
| Label inline edit | ProcessRow | contentEditable on label click, blur to confirm, Enter to confirm |
| Type select | ProcessRow / StepRow | Coloured to match cluster ramp |
| Row remove | ProcessRow / StepRow | × button, red on hover |
| Cluster filter → diagram | Step5Preview | Resets zoom/pan on switch |
| Keyboard shortcuts | DiagramCanvas | V = select, H = hand |
| Scroll zoom | DiagramCanvas | Wheel event on viewport |
| Minimap sync | DiagramCanvas | Updates on every transform change |
| Export format select | Step6Complete | Mutually exclusive radio |

---

## Footer Logic

| Step | Left | Centre | Right |
|---|---|---|---|
| 1 | ← Back (hidden) | Step 1 of 6 | Continue → |
| 2 | ← Back | Step 2 of 6 | Continue → |
| 3 | ← Back | Step 3 of 6 | Continue → |
| 4 | ← Back | Step 4 of 6 | Continue → |
| 5 | ← Back | Step 5 of 6 | Run import → |
| 6 | ← Back | Step 6 of 6 | Open in editor → |

No "Skip to generate" button anywhere.

---

## Colours — Cluster Ramp Reference

| Cluster | `color` | `tc` (bg) | `bc` (border) |
|---|---|---|---|
| Core Concepts & Account Mgmt | `#5F5E5A` | `#f1efe8` | `#D3D1C7` |
| Withdrawals & Cashier | `#BA7517` | `#FAEEDA` | `#EF9F27` |
| Payments & Deposits | `#3B6D11` | `#EAF3DE` | `#97C459` |
| Verification & Risk | `#993C1D` | `#FAECE7` | `#F0997B` |
| Account Status & Safety | `#993556` | `#FBEAF0` | `#ED93B1` |
| Bonuses & Gamification | `#534AB7` | `#EEEDFE` | `#AFA9EC` |
| Sports Betting | `#0F6E56` | `#E1F5EE` | `#5DCAA5` |
| User Data & Support | `#185FA5` | `#E6F1FB` | `#85B7EB` |

---

## Build Order (recommended)

1. Scaffold Vite + React + TS + Tailwind
2. Create all types in `src/types/index.ts`
3. Populate all data files in `src/data/`
4. Create Zustand stores
5. Build `WizardShell` + `WizardFooter` with navigation wired
6. Build `PillsBar` and `SectionTitle` shared components
7. Build Step1 → Step6 in order, referencing prototype HTML for exact layout
8. Build `DiagramCanvas` last (most complex) — use `react-zoom-pan-pinch` for transform, hand-code SVG render from `diagrams.ts`
9. Wire @dnd-kit for cluster reorder in Step4
10. Add keyboard shortcuts (V/H) via `useEffect` on Step5 mount/unmount

---

## Notes for Cursor

- The prototype HTML file (`src/doc_import_wizard_complete.html`) is the visual reference. Open it in a browser alongside Cursor to compare pixel-by-pixel.
- All colours are hardcoded hex — do not use Tailwind colour names for cluster/pill colours, use inline styles.
- The minimap is a lightweight SVG clone approach — copy the diagram SVG innerHTML into the minimap div and scale it. Do not use a canvas element.
- The wizard renders as a modal overlay — it should sit above whatever the host app renders behind it.
- TypeScript strict mode on. No `any` types.
- All `contentEditable` fields should strip HTML on blur (use `innerText`, not `innerHTML`).
