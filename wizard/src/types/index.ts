export interface ThemeTag {
  label: string;
  bg: string;
  bc: string;
  tc: string;
}

export interface Cluster {
  id: string;
  name: string;
  color: string;
  tc: string;
  bc: string;
  themes: ThemeTag[];
  count: number;
}

export interface ProcessStep {
  id: string;
  icon: 'action' | 'decision';
  label: string;
  type: string;
  conn: string;
}

export interface Process {
  id: number;
  label: string;
  type: string;
  cluster: string;
  conn: string;
  steps: ProcessStep[];
}

export interface DiagramNode {
  id: string;
  x: number;
  y: number;
  type?: 'start' | 'end';
  w?: number;
  h?: number;
  label?: string;
  sub?: string;
}

export interface DiagramEdge {
  f: string;
  t: string;
  lbl?: string;
}

export interface Diagram {
  w: number;
  h: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface PageMapTile {
  tl: string;
  tc: string;
  tb: string;
  tt: string;
  ti: string;
  td: string;
  cf: number;
}

export interface PageMapBlock {
  t: string;
  l: string;
  i: string;
  n: number;
  a: boolean;
  bg: string;
  ic: string;
}

export interface PageMapPage {
  blocks: PageMapBlock[];
  tiles: PageMapTile[];
  kw: string[];
}

export interface PillDef {
  t: string;
  count: number;
  label: string;
  bg: string;
  bc: string;
  tc: string;
}

export interface FileMeta {
  name: string;
  pages: number;
  size: string;
  type: 'PDF' | 'DOC' | 'TXT' | 'HTML';
  typeBg: string;
  typeColor: string;
}

export type InputMode = 'file' | 'paste' | 'sample';

export type ExportFormat = 'mermaid' | 'processmap' | 'bpmn' | 'workflow' | 'html' | 'json' | 'csv' | 'pdf';
