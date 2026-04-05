import type { CanonicalModel } from './types';
import { makeStableId } from './utils';

interface ProcessMapNode {
  id: string;
  type: 'journeyNode';
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    nodeType: 'start' | 'action' | 'decision' | 'end' | 'subprocess';
    color: string;
    subMapId?: string;
    sourceStepId?: string;
  };
}

interface ProcessMapEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'smoothstep';
  animated: true;
  style: { stroke: string; strokeWidth: number };
  labelStyle?: { fontSize: number; fontWeight: number };
}

interface ProcessMap {
  id: string;
  name: string;
  description: string;
  parentMapId: string | null;
  parentNodeId: string | null;
  nodes: ProcessMapNode[];
  edges: ProcessMapEdge[];
}

interface ProcessMapProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  rootMapId: string;
  maps: Record<string, ProcessMap>;
}

const NODE_COLOR_BY_TYPE: Record<CanonicalModel['clusters'][number]['nodes'][number]['type'], string> = {
  start: '#22c55e',
  action: '#3b82f6',
  decision: '#eab308',
  end: '#ef4444',
};

function toProcessMapNode(node: CanonicalModel['clusters'][number]['nodes'][number]): ProcessMapNode {
  return {
    id: node.id,
    type: 'journeyNode',
    position: { x: node.x, y: node.y },
    data: {
      label: node.label,
      description: node.description,
      nodeType: node.type,
      color: NODE_COLOR_BY_TYPE[node.type],
      sourceStepId: node.sourceId,
    },
  };
}

function toProcessMapEdge(edge: CanonicalModel['clusters'][number]['edges'][number]): ProcessMapEdge {
  return {
    id: edge.id,
    source: edge.sourceId,
    target: edge.targetId,
    label: edge.label || undefined,
    type: 'smoothstep',
    animated: true,
    style: {
      stroke: '#94a3b8',
      strokeWidth: 2,
    },
    ...(edge.label ? { labelStyle: { fontSize: 11, fontWeight: 600 } } : {}),
  };
}

export function exportProcessMap(model: CanonicalModel): string {
  const rootMapId = makeStableId(model.id, 'root_map');
  const rootNodes: ProcessMapNode[] = model.clusters.map((cluster, index) => {
    const subMapId = makeStableId(model.id, cluster.id, 'map');
    return {
      id: makeStableId('root', cluster.id),
      type: 'journeyNode',
      position: { x: index * 300, y: 0 },
      data: {
        label: cluster.name,
        description: `${cluster.nodes.length} nodes, ${cluster.edges.length} connections`,
        nodeType: 'subprocess',
        color: '#64748b',
        subMapId,
      },
    };
  });

  const maps: Record<string, ProcessMap> = {
    [rootMapId]: {
      id: rootMapId,
      name: 'Overview',
      description: `${model.title} cluster overview`,
      parentMapId: null,
      parentNodeId: null,
      nodes: rootNodes,
      edges: [],
    },
  };

  for (const cluster of model.clusters) {
    const mapId = makeStableId(model.id, cluster.id, 'map');
    maps[mapId] = {
      id: mapId,
      name: cluster.name,
      description: `${cluster.name} process flow`,
      parentMapId: rootMapId,
      parentNodeId: makeStableId('root', cluster.id),
      nodes: cluster.nodes.map(toProcessMapNode),
      edges: cluster.edges.map(toProcessMapEdge),
    };
  }

  const project: ProcessMapProject = {
    id: model.id,
    name: model.title,
    description: `Generated from ${model.documentName}`,
    createdAt: model.generatedAt,
    updatedAt: model.generatedAt,
    rootMapId,
    maps,
  };

  return `${JSON.stringify(project, null, 2)}\n`;
}
