import { useMemo, useState } from 'react';
import { buildAllArtifacts, buildSingleExportArtifact, createDefaultExportModel } from '../../../export';
import { downloadArtifact } from '../../../export/utils';
import { useClusterStore } from '../../../store/clusterStore';
import { useProcessStore } from '../../../store/processStore';
import { useWizardStore } from '../../../store/wizardStore';
import type { ExportFormat } from '../../../types';

const FORMATS: Array<{ id: ExportFormat; icon: string; name: string; desc: string }> = [
  { id: 'mermaid', icon: 'Mm', name: 'Mermaid', desc: 'Live text + preview' },
  { id: 'processmap', icon: 'PM', name: 'Process-Map-V1', desc: 'Semantic process model' },
  { id: 'bpmn', icon: 'Bx', name: 'BPMN XML', desc: 'Standard process notation' },
  { id: 'workflow', icon: 'Wf', name: 'Workflow Designer', desc: 'Visual flow editor' },
  { id: 'html', icon: 'Ht', name: 'HTML', desc: 'Interactive standalone map' },
  { id: 'json', icon: 'JS', name: 'JSON', desc: 'Canonical export model' },
  { id: 'csv', icon: 'Cv', name: 'CSV', desc: 'Flat process table' },
  { id: 'pdf', icon: 'Pd', name: 'PDF', desc: 'Printable diagram pages' },
];

export function Step6Complete() {
  const [selected, setSelected] = useState<ExportFormat>('mermaid');
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState('');
  const clusters = useClusterStore((store) => store.clusters);
  const processes = useProcessStore((store) => store.processes);
  const sourceFile = useWizardStore((store) => store.sourceFile);
  const documentName = sourceFile?.name ?? 'CS_Training_Manual_v3.pdf';

  const exportOverrides = useMemo(
    () => ({
      title: 'WIZARD_FRESH Export',
      documentName,
      clusters,
      processes,
    }),
    [documentName, clusters, processes],
  );

  const model = useMemo(() => createDefaultExportModel(exportOverrides), [exportOverrides]);
  const validationRows = useMemo(() => {
    const disconnectedNodes = model.clusters.reduce((sum, cluster) => {
      const incomingCount = new Map<string, number>();
      const outgoingCount = new Map<string, number>();
      for (const node of cluster.nodes) {
        incomingCount.set(node.id, 0);
        outgoingCount.set(node.id, 0);
      }
      for (const edge of cluster.edges) {
        outgoingCount.set(edge.sourceId, (outgoingCount.get(edge.sourceId) ?? 0) + 1);
        incomingCount.set(edge.targetId, (incomingCount.get(edge.targetId) ?? 0) + 1);
      }
      return (
        sum +
        cluster.nodes.filter((node) => (incomingCount.get(node.id) ?? 0) === 0 && (outgoingCount.get(node.id) ?? 0) === 0).length
      );
    }, 0);
    const invalidDecisions = model.clusters.reduce(
      (sum, cluster) =>
        sum + cluster.nodes.filter((node) => node.type === 'decision' && cluster.edges.filter((edge) => edge.sourceId === node.id).length < 2).length,
      0,
    );
    const optionalDescriptionsMissing = model.clusters.reduce(
      (sum, cluster) => sum + cluster.nodes.filter((node) => node.type === 'action' && node.description.trim().length === 0).length,
      0,
    );
    return [
      {
        color: disconnectedNodes === 0 ? '#22c55e' : '#f59e0b',
        text: disconnectedNodes === 0 ? 'No disconnected nodes' : `${disconnectedNodes} disconnected nodes`,
        tc: disconnectedNodes === 0 ? '#166534' : '#92400e',
      },
      {
        color: invalidDecisions === 0 ? '#22c55e' : '#f59e0b',
        text: invalidDecisions === 0 ? 'All decisions have >=2 exits' : `${invalidDecisions} decisions missing exits`,
        tc: invalidDecisions === 0 ? '#166534' : '#92400e',
      },
      {
        color: optionalDescriptionsMissing === 0 ? '#22c55e' : '#f59e0b',
        text:
          optionalDescriptionsMissing === 0
            ? 'All optional descriptions present'
            : `${optionalDescriptionsMissing} optional descriptions missing`,
        tc: optionalDescriptionsMissing === 0 ? '#166534' : '#92400e',
      },
    ];
  }, [model]);

  const summaryRows = [
    { k: 'Document', v: documentName, style: { fontSize: 9, fontWeight: 400, color: '#555' } },
    { k: 'Clusters', v: String(model.summary.clusters) },
    { k: 'Themes', v: String(model.summary.themes) },
    { k: 'Processes', v: String(model.summary.processes) },
    { k: 'Sub-processes', v: String(model.summary.subProcesses) },
    { k: 'Steps', v: String(model.summary.steps) },
    { k: 'Connections', v: String(model.summary.connections) },
    { k: 'Facts / policies', v: String(model.summary.factsPolicies) },
    { k: 'Unassigned', v: String(model.summary.unassigned), style: model.summary.unassigned > 0 ? { color: '#ef4444' } : undefined },
  ];

  const onDownloadSelected = async () => {
    setIsExporting(true);
    setStatus('Building export file...');
    try {
      const artifact = await buildSingleExportArtifact(selected, exportOverrides);
      downloadArtifact(artifact.filename, artifact.mimeType, artifact.content);
      setStatus(`Downloaded ${artifact.filename}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setStatus(message);
    } finally {
      setIsExporting(false);
    }
  };

  const onDownloadAll = async () => {
    setIsExporting(true);
    setStatus('Building all export files...');
    try {
      const artifacts = await buildAllArtifacts(exportOverrides);
      for (const artifact of artifacts) {
        downloadArtifact(artifact.filename, artifact.mimeType, artifact.content);
      }
      setStatus(`Downloaded ${artifacts.length} files`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setStatus(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 320 }}>
      <div style={{ padding: '1.1rem 1.4rem', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', marginBottom: '.65rem', display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          Import complete
        </div>
        {summaryRows.map((row) => (
          <div key={row.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ fontSize: 10, color: '#888' }}>{row.k}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a', ...row.style }}>{row.v}</span>
          </div>
        ))}
        <div style={{ marginTop: '.7rem', paddingTop: '.6rem', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#bbb', marginBottom: 5 }}>Validation</div>
          {validationRows.map((validation) => (
            <div key={validation.text} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 0', fontSize: 9 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: validation.color }} />
              <span style={{ color: validation.tc }}>{validation.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1.1rem 1.4rem' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>Export to</div>
        <div style={{ fontSize: 9, color: '#bbb', marginBottom: '.7rem' }}>Select format then download</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {FORMATS.map((format) => {
            const isSelected = selected === format.id;
            return (
              <div
                key={format.id}
                onClick={() => setSelected(format.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? '#1a1a1a' : '#e5e5e5'}`,
                  cursor: 'pointer',
                  transition: 'all .15s',
                  userSelect: 'none',
                  background: isSelected ? '#fafafa' : '#fff',
                }}
              >
                <div style={{ width: 20, height: 20, borderRadius: 4, fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: isSelected ? '#1a1a1a' : '#f0f0f0', color: isSelected ? '#fff' : '#555', transition: 'all .15s' }}>{format.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 500, color: '#1a1a1a' }}>{format.name}</div>
                  <div style={{ fontSize: 8, color: '#bbb' }}>{format.desc}</div>
                </div>
                <div style={{ width: 13, height: 13, borderRadius: '50%', border: `1px solid ${isSelected ? '#1a1a1a' : '#d0d0d0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? '#1a1a1a' : '#fff', flexShrink: 0, marginLeft: 'auto', transition: 'all .15s' }}>
                  {isSelected && <svg width="8" height="6" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          <button
            type="button"
            onClick={onDownloadSelected}
            disabled={isExporting}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #1a1a1a',
              background: '#1a1a1a',
              color: '#fff',
              fontSize: 10,
              fontWeight: 600,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            {isExporting ? 'Exporting…' : 'Download selected'}
          </button>
          <button
            type="button"
            onClick={onDownloadAll}
            disabled={isExporting}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #bbb',
              background: '#fff',
              color: '#555',
              fontSize: 10,
              fontWeight: 600,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            Download all
          </button>
        </div>
        <div style={{ minHeight: 14, marginTop: 6, fontSize: 9, color: status.toLowerCase().includes('downloaded') ? '#166534' : '#888' }}>{status}</div>
      </div>
    </div>
  );
}
