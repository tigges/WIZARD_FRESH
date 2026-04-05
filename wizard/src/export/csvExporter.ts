import type { CanonicalModel } from './types';
import { csvEscape } from './utils';

export function exportCsv(model: CanonicalModel): string {
  const header = [
    'cluster_id',
    'cluster_name',
    'node_id',
    'node_type',
    'label',
    'description',
    'x',
    'y',
    'width',
    'height',
    'outgoing_count',
    'incoming_count',
  ];

  const rows: string[] = [header.join(',')];

  for (const cluster of model.clusters) {
    for (const node of cluster.nodes) {
      const outgoingCount = cluster.edges.filter((edge) => edge.sourceId === node.id).length;
      const incomingCount = cluster.edges.filter((edge) => edge.targetId === node.id).length;
      const row = [
        cluster.id,
        cluster.name,
        node.id,
        node.type,
        node.label,
        node.description,
        node.x,
        node.y,
        node.width,
        node.height,
        outgoingCount,
        incomingCount,
      ];
      rows.push(row.map((cell) => csvEscape(cell)).join(','));
    }
  }

  return `${rows.join('\n')}\n`;
}
