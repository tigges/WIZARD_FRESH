import type { CanonicalModel } from './types';
import { renderClusterSvg } from './svgRenderer';
import { xmlEscape } from './utils';

const safeJson = (value: unknown): string =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');

export function exportHtml(model: CanonicalModel): string {
  const firstClusterId = model.clusters[0]?.id ?? '';
  const svgByCluster = model.clusters.reduce<Record<string, string>>((accumulator, cluster) => {
    accumulator[cluster.id] = renderClusterSvg(cluster);
    return accumulator;
  }, {});

  const html = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `  <title>${xmlEscape(model.title)} - Export</title>`,
    '  <style>',
    '    :root { color-scheme: light; }',
    '    * { box-sizing: border-box; }',
    '    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #f4f5f7; color: #1a1a1a; }',
    '    .shell { max-width: 1160px; margin: 0 auto; padding: 20px; }',
    '    .card { background: #ffffff; border: 1px solid #e5e5e5; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); }',
    '    .header { padding: 16px 18px; border-bottom: 1px solid #eeeeee; }',
    '    h1 { margin: 0; font-size: 20px; line-height: 1.2; }',
    '    .meta { margin-top: 6px; font-size: 12px; color: #666666; }',
    '    .toolbar { display: flex; gap: 6px; flex-wrap: wrap; padding: 14px 16px; border-bottom: 1px solid #eeeeee; }',
    '    .clusterBtn { border: 1px solid #d0d0d0; background: #ffffff; border-radius: 999px; padding: 5px 11px; font-size: 12px; cursor: pointer; color: #444; }',
    '    .clusterBtn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }',
    '    .viewerWrap { overflow: auto; padding: 16px; background: #edf0f9; border-radius: 0 0 12px 12px; }',
    '    .viewer { min-height: 320px; display: flex; align-items: flex-start; justify-content: flex-start; }',
    '    .viewer svg { border: 1px solid #d8dcea; background: #fff; border-radius: 8px; }',
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="shell">',
    '    <div class="card">',
    '      <div class="header">',
    `        <h1>${xmlEscape(model.title)}</h1>`,
    `        <div class="meta">Document: ${xmlEscape(model.documentName)} · Generated: ${xmlEscape(model.generatedAt)}</div>`,
    '      </div>',
    '      <div class="toolbar" id="toolbar"></div>',
    '      <div class="viewerWrap">',
    '        <div class="viewer" id="viewer"></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <script>',
    `    const clusters = ${safeJson(model.clusters.map((cluster) => ({ id: cluster.id, name: cluster.name })))};`,
    `    const svgByCluster = ${safeJson(svgByCluster)};`,
    `    let activeCluster = ${JSON.stringify(firstClusterId)};`,
    '    const toolbar = document.getElementById("toolbar");',
    '    const viewer = document.getElementById("viewer");',
    '    function render() {',
    '      viewer.innerHTML = svgByCluster[activeCluster] || "";',
    '      toolbar.querySelectorAll("button").forEach((button) => {',
    '        button.classList.toggle("active", button.dataset.clusterId === activeCluster);',
    '      });',
    '    }',
    '    clusters.forEach((cluster) => {',
    '      const button = document.createElement("button");',
    '      button.type = "button";',
    '      button.className = "clusterBtn";',
    '      button.dataset.clusterId = cluster.id;',
    '      button.textContent = cluster.name;',
    '      button.addEventListener("click", () => {',
    '        activeCluster = cluster.id;',
    '        render();',
    '      });',
    '      toolbar.appendChild(button);',
    '    });',
    '    render();',
    '  </script>',
    '</body>',
    '</html>',
    '',
  ].join('\n');

  return html;
}
