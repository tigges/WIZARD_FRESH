export function makeStableId(...parts: string[]): string {
  return parts
    .join('_')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function formatClusterName(name: string): string {
  return name.replace(/\n/g, ' ').trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

export function sanitizeLabel(value: string): string {
  return value.replace(/"/g, "'").replace(/\n+/g, ' ').trim();
}

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function pointsForEdge(
  source: { x: number; y: number; width: number; height: number },
  target: { x: number; y: number; width: number; height: number },
): Array<{ x: number; y: number }> {
  const sourceX = source.x + source.width;
  const sourceY = source.y + source.height / 2;
  const targetX = target.x;
  const targetY = target.y + target.height / 2;

  if (Math.abs(sourceY - targetY) < 10) {
    return [
      { x: sourceX, y: sourceY },
      { x: targetX, y: targetY },
    ];
  }

  const midpointX = (sourceX + targetX) / 2;
  return [
    { x: sourceX, y: sourceY },
    { x: midpointX, y: sourceY },
    { x: midpointX, y: targetY },
    { x: targetX, y: targetY },
  ];
}

export function downloadArtifact(
  filename: string,
  mimeType: string,
  content: string | Blob,
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export function csvEscape(value: string | number): string {
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
