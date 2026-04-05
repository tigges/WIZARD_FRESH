import type { ExportFormat } from '../types';
import { exportBpmnXml } from './bpmnExporter';
import { buildCanonicalModel } from './canonical';
import { exportCsv } from './csvExporter';
import { exportHtml } from './htmlExporter';
import { exportJson } from './jsonExporter';
import { exportMermaid } from './mermaidExporter';
import { exportPdf } from './pdfExporter';
import { exportProcessMap } from './processMapExporter';
import type { CanonicalBuildInput, CanonicalModel, ExportArtifact } from './types';
import { removeFileExtension, slugify } from './utils';
import { exportWorkflowDesigner } from './workflowExporter';

const FORMATS: ExportFormat[] = [
  'mermaid',
  'processmap',
  'bpmn',
  'workflow',
  'html',
  'json',
  'csv',
  'pdf',
];

const FILE_EXTENSION_BY_FORMAT: Record<ExportFormat, string> = {
  mermaid: 'mmd',
  processmap: 'json',
  bpmn: 'bpmn',
  workflow: 'json',
  html: 'html',
  json: 'json',
  csv: 'csv',
  pdf: 'pdf',
};

const MIME_TYPE_BY_FORMAT: Record<ExportFormat, string> = {
  mermaid: 'text/plain;charset=utf-8',
  processmap: 'application/json',
  bpmn: 'application/xml',
  workflow: 'application/json',
  html: 'text/html;charset=utf-8',
  json: 'application/json',
  csv: 'text/csv;charset=utf-8',
  pdf: 'application/pdf',
};

function baseNameFromModel(model: CanonicalModel): string {
  const source = removeFileExtension(model.documentName).trim() || model.title.trim() || 'wizard-fresh-export';
  return slugify(source) || 'wizard-fresh-export';
}

function fileNameForFormat(model: CanonicalModel, format: ExportFormat): string {
  const baseName = baseNameFromModel(model);
  return `${baseName}.${FILE_EXTENSION_BY_FORMAT[format]}`;
}

export function getExportFormats(): ExportFormat[] {
  return FORMATS;
}

export function createCanonicalExportModel(input: CanonicalBuildInput): CanonicalModel {
  return buildCanonicalModel(input);
}

export async function buildExportArtifact(
  model: CanonicalModel,
  format: ExportFormat,
): Promise<ExportArtifact> {
  const filename = fileNameForFormat(model, format);
  const mimeType = MIME_TYPE_BY_FORMAT[format];

  switch (format) {
    case 'mermaid':
      return { format, filename, mimeType, content: exportMermaid(model) };
    case 'processmap':
      return { format, filename, mimeType, content: exportProcessMap(model) };
    case 'bpmn':
      return { format, filename, mimeType, content: await exportBpmnXml(model) };
    case 'workflow':
      return { format, filename, mimeType, content: exportWorkflowDesigner(model) };
    case 'html':
      return { format, filename, mimeType, content: exportHtml(model) };
    case 'json':
      return { format, filename, mimeType, content: exportJson(model) };
    case 'csv':
      return { format, filename, mimeType, content: exportCsv(model) };
    case 'pdf':
      return { format, filename, mimeType, content: await exportPdf(model) };
    default: {
      const exhaustiveCheck: never = format;
      throw new Error(`Unsupported format: ${String(exhaustiveCheck)}`);
    }
  }
}

export async function buildAllExportArtifacts(model: CanonicalModel): Promise<ExportArtifact[]> {
  const artifacts: ExportArtifact[] = [];
  for (const format of FORMATS) {
    artifacts.push(await buildExportArtifact(model, format));
  }
  return artifacts;
}
