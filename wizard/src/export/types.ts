import type { Cluster, Diagram, Process } from '../types';
import type { ExportFormat } from '../types';

export type CanonicalNodeType = 'start' | 'action' | 'decision' | 'end';

export interface CanonicalNode {
  id: string;
  sourceId: string;
  clusterId: string;
  type: CanonicalNodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanonicalEdge {
  id: string;
  clusterId: string;
  sourceId: string;
  targetId: string;
  label: string;
}

export interface CanonicalClusterFlow {
  id: string;
  name: string;
  color: string;
  tc: string;
  bc: string;
  width: number;
  height: number;
  nodes: CanonicalNode[];
  edges: CanonicalEdge[];
}

export interface CanonicalSummary {
  clusters: number;
  themes: number;
  processes: number;
  subProcesses: number;
  steps: number;
  connections: number;
  factsPolicies: number;
  unassigned: number;
}

export interface CanonicalModel {
  id: string;
  title: string;
  documentName: string;
  generatedAt: string;
  clusters: CanonicalClusterFlow[];
  processes: Process[];
  summary: CanonicalSummary;
}

export interface CanonicalBuildInput {
  title: string;
  documentName: string;
  clusters: Cluster[];
  diagrams: Record<string, Diagram>;
  processes: Process[];
}

export interface ExportArtifact {
  format: ExportFormat;
  filename: string;
  mimeType: string;
  content: string | Blob;
}
