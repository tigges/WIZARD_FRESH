import type { CanonicalModel } from './types';

export function exportJson(model: CanonicalModel): string {
  return `${JSON.stringify(model, null, 2)}\n`;
}
