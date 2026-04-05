import type { DiagramNode } from '../types';
import type { CanonicalBuildInput, CanonicalClusterFlow, CanonicalEdge, CanonicalModel, CanonicalNode, CanonicalNodeType, CanonicalSummary } from './types';
import { formatClusterName, makeStableId } from './utils';

const START_END_SIZE = 28;
const DECISION_DEFAULT_WIDTH = 52;
const DECISION_DEFAULT_HEIGHT = 48;
const ACTION_DEFAULT_WIDTH = 100;
const ACTION_DEFAULT_HEIGHT = 52;

function nodeTypeFromDiagramNode(node: DiagramNode): CanonicalNodeType {
  if (node.type === 'start') {
    return 'start';
  }
  if (node.type === 'end') {
    return 'end';
  }
  if (typeof node.w === 'number') {
    return 'action';
  }
  return 'decision';
}

function getNodeSize(node: DiagramNode, nodeType: CanonicalNodeType): { width: number; height: number } {
  if (nodeType === 'start' || nodeType === 'end') {
    return { width: START_END_SIZE, height: START_END_SIZE };
  }
  if (nodeType === 'decision') {
    return {
      width: DECISION_DEFAULT_WIDTH,
      height: DECISION_DEFAULT_HEIGHT,
    };
  }
  return {
    width: typeof node.w === 'number' ? node.w : ACTION_DEFAULT_WIDTH,
    height: typeof node.h === 'number' ? node.h : ACTION_DEFAULT_HEIGHT,
  };
}

function buildSummary(input: CanonicalBuildInput, clusterFlows: CanonicalClusterFlow[]): CanonicalSummary {
  const processCount = input.processes.length;
  const stepCount = input.processes.reduce((sum, process) => sum + process.steps.length, 0);
  const subProcessCount = input.processes.filter((process) => process.type === 'subprocess').length;
  const themeCount = input.clusters.reduce((sum, cluster) => sum + cluster.themes.length, 0);
  const factsPoliciesCount = input.processes.reduce((sum, process) => {
    const processFact = process.type === 'fact' ? 1 : 0;
    const stepFacts = process.steps.filter((step) => step.type === 'fact').length;
    return sum + processFact + stepFacts;
  }, 0);
  const unassignedCount = input.processes.filter((process) => process.cluster.trim().length === 0).length;
  const connectionCount = clusterFlows.reduce((sum, flow) => sum + flow.edges.length, 0);

  return {
    clusters: input.clusters.length,
    themes: themeCount,
    processes: processCount,
    subProcesses: subProcessCount,
    steps: stepCount,
    connections: connectionCount,
    factsPolicies: factsPoliciesCount,
    unassigned: unassignedCount,
  };
}

export function buildCanonicalModel(input: CanonicalBuildInput): CanonicalModel {
  const clusterFlows: CanonicalClusterFlow[] = input.clusters
    .map((cluster): CanonicalClusterFlow | null => {
      const diagram = input.diagrams[cluster.id];
      if (!diagram) {
        return null;
      }

      const nodes: CanonicalNode[] = diagram.nodes.map((node) => {
        const nodeType = nodeTypeFromDiagramNode(node);
        const size = getNodeSize(node, nodeType);

        return {
          id: makeStableId(cluster.id, node.id),
          sourceId: node.id,
          clusterId: cluster.id,
          type: nodeType,
          label: node.label ?? (nodeType === 'start' ? 'Start' : nodeType === 'end' ? 'End' : 'Step'),
          description: node.sub ?? '',
          x: node.x,
          y: node.y,
          width: size.width,
          height: size.height,
        };
      });

      const edges: CanonicalEdge[] = diagram.edges.map((edge, index) => ({
        id: makeStableId(cluster.id, `edge_${index + 1}`),
        clusterId: cluster.id,
        sourceId: makeStableId(cluster.id, edge.f),
        targetId: makeStableId(cluster.id, edge.t),
        label: edge.lbl ?? '',
      }));

      return {
        id: cluster.id,
        name: formatClusterName(cluster.name),
        color: cluster.color,
        tc: cluster.tc,
        bc: cluster.bc,
        width: diagram.w,
        height: diagram.h,
        nodes,
        edges,
      };
    })
    .filter((value): value is CanonicalClusterFlow => value !== null);

  const generatedAt = new Date().toISOString();
  const summary = buildSummary(input, clusterFlows);

  return {
    id: makeStableId('wizard_fresh', generatedAt),
    title: input.title,
    documentName: input.documentName,
    generatedAt,
    clusters: clusterFlows,
    processes: input.processes,
    summary,
  };
}
