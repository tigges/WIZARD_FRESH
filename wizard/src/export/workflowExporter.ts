import type { CanonicalModel } from './types';
import { makeStableId } from './utils';

type WorkflowNodeType = 'terminal' | 'process' | 'decision' | 'data' | 'annotation';
type WorkflowConnectionType = 'sequential' | 'conditional' | 'parallel' | 'fallback';

interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  actor: '' | 'customer' | 'agent' | 'system' | 'manager' | 'external';
  x: number;
  y: number;
  status: 'live' | 'draft';
  aht: string;
  volume: string;
  sla: string;
  system: string;
  notes: string;
}

interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  label: string;
  type: WorkflowConnectionType;
}

interface WorkflowDesignerExport {
  title: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}

function toWorkflowNodeType(type: CanonicalModel['clusters'][number]['nodes'][number]['type']): WorkflowNodeType {
  switch (type) {
    case 'decision':
      return 'decision';
    case 'start':
    case 'end':
      return 'terminal';
    default:
      return 'process';
  }
}

function toConnectionType(
  sourceType: CanonicalModel['clusters'][number]['nodes'][number]['type'] | undefined,
  label: string,
): WorkflowConnectionType {
  if (sourceType === 'decision') {
    return 'conditional';
  }
  if (label.trim().length > 0) {
    return 'conditional';
  }
  return 'sequential';
}

export function exportWorkflowDesigner(model: CanonicalModel): string {
  const nodeTypeById = new Map<string, CanonicalModel['clusters'][number]['nodes'][number]['type']>();
  const workflowNodes: WorkflowNode[] = [];
  const workflowConnections: WorkflowConnection[] = [];

  for (const cluster of model.clusters) {
    for (const node of cluster.nodes) {
      nodeTypeById.set(node.id, node.type);
      workflowNodes.push({
        id: node.id,
        type: toWorkflowNodeType(node.type),
        label: node.label,
        actor: '',
        x: node.x + 48,
        y: node.y + 48,
        status: 'live',
        aht: '',
        volume: '',
        sla: '',
        system: '',
        notes: node.description,
      });
    }

    for (const edge of cluster.edges) {
      workflowConnections.push({
        id: makeStableId('conn', edge.id),
        from: edge.sourceId,
        to: edge.targetId,
        label: edge.label,
        type: toConnectionType(nodeTypeById.get(edge.sourceId), edge.label),
      });
    }
  }

  const payload: WorkflowDesignerExport = {
    title: model.title,
    nodes: workflowNodes,
    connections: workflowConnections,
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}
