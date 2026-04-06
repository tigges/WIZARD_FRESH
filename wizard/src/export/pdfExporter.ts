import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { CanonicalModel } from './types';

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const MARGIN = 36;

export async function exportPdf(model: CanonicalModel): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  for (const cluster of model.clusters) {
    const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

    page.drawText(model.title, {
      x: MARGIN,
      y: PAGE_HEIGHT - MARGIN - 4,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(cluster.name, {
      x: MARGIN,
      y: PAGE_HEIGHT - MARGIN - 22,
      size: 10,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });

    const drawingTop = PAGE_HEIGHT - MARGIN - 40;
    const drawingHeight = PAGE_HEIGHT - MARGIN * 2 - 56;
    const scale = Math.min((PAGE_WIDTH - MARGIN * 2) / cluster.width, drawingHeight / cluster.height);

    const nodeById = new Map(cluster.nodes.map((node) => [node.id, node]));

    for (const edge of cluster.edges) {
      const source = nodeById.get(edge.sourceId);
      const target = nodeById.get(edge.targetId);
      if (!source || !target) {
        continue;
      }
      const sourceX = MARGIN + (source.x + source.width) * scale;
      const sourceY = drawingTop - (source.y + source.height / 2) * scale;
      const targetX = MARGIN + target.x * scale;
      const targetY = drawingTop - (target.y + target.height / 2) * scale;

      page.drawLine({
        start: { x: sourceX, y: sourceY },
        end: { x: targetX, y: targetY },
        thickness: 1,
        color: rgb(0.68, 0.68, 0.68),
      });
    }

    for (const node of cluster.nodes) {
      const x = MARGIN + node.x * scale;
      const y = drawingTop - (node.y + node.height) * scale;
      const width = node.width * scale;
      const height = node.height * scale;

      if (node.type === 'start') {
        page.drawCircle({
          x: x + width / 2,
          y: y + height / 2,
          size: width / 2,
          color: rgb(0.13, 0.77, 0.37),
        });
      } else if (node.type === 'end') {
        page.drawCircle({
          x: x + width / 2,
          y: y + height / 2,
          size: width / 2,
          color: rgb(0.94, 0.27, 0.27),
        });
      } else if (node.type === 'decision') {
        const cx = x + width / 2;
        const cy = y + height / 2;
        page.drawSvgPath(`M ${cx} ${y + height} L ${x + width} ${cy} L ${cx} ${y} L ${x} ${cy} Z`, {
          color: rgb(1, 0.99, 0.91),
          borderColor: rgb(0.79, 0.59, 0.04),
          borderWidth: 1,
        });
      } else {
        page.drawRectangle({
          x,
          y,
          width,
          height,
          borderWidth: 1,
          borderColor: rgb(0.23, 0.49, 0.91),
          color: rgb(0.92, 0.95, 1),
        });
      }

      const text = node.label.slice(0, 32);
      page.drawText(text, {
        x: x + 4,
        y: y + height / 2 - 3,
        size: Math.max(6, Math.min(9, width / 12)),
        font,
        color: node.type === 'start' || node.type === 'end' ? rgb(1, 1, 1) : rgb(0.1, 0.2, 0.45),
      });
    }
  }

  const bytes = await pdf.save();
  const normalizedBytes = new Uint8Array(bytes);
  return new Blob([normalizedBytes.buffer], { type: 'application/pdf' });
}
