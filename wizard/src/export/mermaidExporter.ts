import type { CanonicalModel } from './types';
import { sanitizeLabel } from './utils';

function nodeDeclaration(node: CanonicalModel['clusters'][number]['nodes'][number]): string {
  const label = sanitizeLabel(node.label || node.description || node.id);
  switch (node.type) {
    case 'start':
      return `${node.id}((\"${label}\")):::startNode`;
    case 'end':
      return `${node.id}((\"${label}\")):::endNode`;
    case 'decision':
      return `${node.id}{\"${label}\"}:::decisionNode`;
    default:
      return `${node.id}[\"${label}\"]:::actionNode`;
  }
}

export function exportMermaid(model: CanonicalModel): string {
  const lines: string[] = [
    'flowchart LR',
    'classDef startNode fill:#22c55e,stroke:#15803d,color:#ffffff,stroke-width:1.5px;',
    'classDef endNode fill:#ef4444,stroke:#b91c1c,color:#ffffff,stroke-width:1.5px;',
    'classDef actionNode fill:#EBF2FF,stroke:#3B7DE8,color:#1A3A7A,stroke-width:1.5px;',
    'classDef decisionNode fill:#FFFDE7,stroke:#C9960A,color:#7A5200,stroke-width:1.5px;',
  ];

  for (const cluster of model.clusters) {
    lines.push(`subgraph ${cluster.id}[${sanitizeLabel(cluster.name)}]`);
    for (const node of cluster.nodes) {
      lines.push(`  ${nodeDeclaration(node)}`);
    }
    lines.push('end');
  }

  for (const cluster of model.clusters) {
    for (const edge of cluster.edges) {
      if (edge.label) {
        lines.push(`${edge.sourceId} -->|${sanitizeLabel(edge.label)}| ${edge.targetId}`);
      } else {
        lines.push(`${edge.sourceId} --> ${edge.targetId}`);
      }
    }
  }

  return `${lines.join('\n')}\n`;
}
