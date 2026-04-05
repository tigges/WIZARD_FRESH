import { clusters as baseClusters } from '../data/clusters';
import { diagrams as baseDiagrams } from '../data/diagrams';
import { processes as baseProcesses } from '../data/processes';
import type { ExportFormat } from '../types';
import type { Cluster, Diagram, Process } from '../types';
import { buildAllExportArtifacts, buildExportArtifact, createCanonicalExportModel } from './pipeline';
import type { CanonicalBuildInput, CanonicalModel, ExportArtifact } from './types';

const DEFAULT_DOCUMENT_NAME = 'CS_Training_Manual_v3.pdf';
const DEFAULT_TITLE = 'Document Import Wizard Export';

export interface ExportContextOverrides {
  title?: string;
  documentName?: string;
  clusters?: Cluster[];
  diagrams?: Record<string, Diagram>;
  processes?: Process[];
}

export function createDefaultExportModel(overrides?: ExportContextOverrides): CanonicalModel {
  const buildInput: CanonicalBuildInput = {
    title: overrides?.title ?? DEFAULT_TITLE,
    documentName: overrides?.documentName ?? DEFAULT_DOCUMENT_NAME,
    clusters: overrides?.clusters ?? baseClusters,
    diagrams: overrides?.diagrams ?? baseDiagrams,
    processes: overrides?.processes ?? baseProcesses,
  };
  return createCanonicalExportModel(buildInput);
}

export type { ExportArtifact, CanonicalModel };

export async function buildSingleExportArtifact(
  format: ExportFormat,
  overrides?: ExportContextOverrides,
): Promise<ExportArtifact> {
  const model = createDefaultExportModel(overrides);
  return buildExportArtifact(model, format);
}

export async function buildAllArtifacts(overrides?: ExportContextOverrides): Promise<ExportArtifact[]> {
  const model = createDefaultExportModel(overrides);
  return buildAllExportArtifacts(model);
}
