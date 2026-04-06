import type { CanonicalClusterFlow, CanonicalNode } from './types';
import { pointsForEdge, xmlEscape } from './utils';

function nodeCenter(node: CanonicalNode): { x: number; y: number } {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function nodeEdgePoint(node: CanonicalNode, side: 'left' | 'right' | 'top' | 'bottom'): { x: number; y: number } {
  const center = nodeCenter(node);
  if (side === 'left') {
    return { x: node.x, y: center.y };
  }
  if (side === 'right') {
    return { x: node.x + node.width, y: center.y };
  }
  if (side === 'top') {
    return { x: center.x, y: node.y };
  }
  return { x: center.x, y: node.y + node.height };
}

function renderNodeSvg(node: CanonicalNode): string {
  if (node.type === 'start') {
    const center = nodeCenter(node);
    return [
      `<circle cx="${center.x}" cy="${center.y}" r="${node.width / 2}" fill="#22c55e"/>`,
      `<text x="${center.x}" y="${center.y + 4}" text-anchor="middle" font-size="9" fill="#ffffff" font-family="sans-serif" font-weight="700">${xmlEscape(node.label)}</text>`,
    ].join('');
  }

  if (node.type === 'end') {
    const center = nodeCenter(node);
    return [
      `<circle cx="${center.x}" cy="${center.y}" r="${node.width / 2}" fill="#ef4444"/>`,
      `<text x="${center.x}" y="${center.y + 4}" text-anchor="middle" font-size="9" fill="#ffffff" font-family="sans-serif" font-weight="700">${xmlEscape(node.label)}</text>`,
    ].join('');
  }

  if (node.type === 'decision') {
    const center = nodeCenter(node);
    const points = [
      `${center.x},${node.y}`,
      `${node.x + node.width},${center.y}`,
      `${center.x},${node.y + node.height}`,
      `${node.x},${center.y}`,
    ].join(' ');
    const words = node.label.split(' ');
    const textSpans = words
      .map((word, index) => `<tspan x="${center.x}" dy="${index === 0 ? 0 : 11}">${xmlEscape(word)}</tspan>`)
      .join('');
    const subtitle = node.description
      ? `<text x="${center.x}" y="${center.y + 18}" text-anchor="middle" font-size="7.5" fill="#7A5200" font-family="sans-serif" opacity="0.7">${xmlEscape(node.description)}</text>`
      : '';
    return [
      `<polygon points="${points}" fill="#FFFDE7" stroke="#C9960A" stroke-width="1.5"/>`,
      `<text x="${center.x}" y="${center.y - (words.length > 1 ? 6 : 1)}" text-anchor="middle" font-size="8.5" fill="#7A5200" font-family="sans-serif" font-weight="600">${textSpans}</text>`,
      subtitle,
    ].join('');
  }

  const subtitle = node.description
    ? `<text x="${node.x + node.width / 2}" y="${node.y + node.height / 2 + 9}" text-anchor="middle" dominant-baseline="central" font-size="8" fill="#1A3A7A" font-family="sans-serif" opacity="0.65">${xmlEscape(node.description)}</text>`
    : '';
  return [
    `<rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="7" fill="#EBF2FF" stroke="#3B7DE8" stroke-width="1.5"/>`,
    `<text x="${node.x + node.width / 2}" y="${node.y + (node.description ? node.height / 2 - 8 : node.height / 2)}" text-anchor="middle" dominant-baseline="central" font-size="9.5" fill="#1A3A7A" font-family="sans-serif" font-weight="600">${xmlEscape(node.label)}</text>`,
    subtitle,
  ].join('');
}

function renderEdgePath(
  sourceNode: CanonicalNode,
  targetNode: CanonicalNode,
): { path: string; labelX: number; labelY: number } {
  const from = nodeEdgePoint(sourceNode, 'right');
  const to = nodeEdgePoint(targetNode, 'left');

  if (Math.abs(from.y - to.y) < 10) {
    return {
      path: `M${from.x} ${from.y} L${to.x - 2} ${to.y}`,
      labelX: (from.x + to.x) / 2,
      labelY: from.y - 7,
    };
  }

  const midpointX = (from.x + to.x) / 2;
  return {
    path: `M${from.x} ${from.y} L${midpointX} ${from.y} L${midpointX} ${to.y} L${to.x - 2} ${to.y}`,
    labelX: midpointX,
    labelY: (from.y + to.y) / 2 - 5,
  };
}

export function renderClusterSvg(cluster: CanonicalClusterFlow): string {
  const nodeMap = new Map(cluster.nodes.map((node) => [node.id, node]));
  const defs = '<defs><marker id="wizard_arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>';

  const edgeShapes = cluster.edges
    .map((edge) => {
      const sourceNode = nodeMap.get(edge.sourceId);
      const targetNode = nodeMap.get(edge.targetId);
      if (!sourceNode || !targetNode) {
        return '';
      }

      const rendered = renderEdgePath(sourceNode, targetNode);
      const edgeLabel = edge.label
        ? `<text x="${rendered.labelX}" y="${rendered.labelY}" text-anchor="middle" font-size="8.5" fill="#666666" font-family="sans-serif" font-weight="500">${xmlEscape(edge.label)}</text>`
        : '';
      return `<path d="${rendered.path}" fill="none" stroke="#b0b0b0" stroke-width="1.2" marker-end="url(#wizard_arrowhead)"/>${edgeLabel}`;
    })
    .join('');

  const nodeShapes = cluster.nodes.map((node) => renderNodeSvg(node)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${cluster.width}" height="${cluster.height}" viewBox="0 0 ${cluster.width} ${cluster.height}">${defs}${edgeShapes}${nodeShapes}</svg>`;
}

export function defaultEdgeWaypoints(source: CanonicalNode, target: CanonicalNode): Array<{ x: number; y: number }> {
  return pointsForEdge(
    { x: source.x, y: source.y, width: source.width, height: source.height },
    { x: target.x, y: target.y, width: target.width, height: target.height },
  );
}
