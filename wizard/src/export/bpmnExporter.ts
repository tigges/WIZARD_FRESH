import { BpmnModdle } from 'bpmn-moddle';
import type { CanonicalClusterFlow, CanonicalModel } from './types';
import { defaultEdgeWaypoints } from './svgRenderer';
import { makeStableId } from './utils';

type ModdleElement = {
  id?: string;
  $type?: string;
  [key: string]: unknown;
};

type FlowNodeElement = ModdleElement & {
  incoming?: ModdleElement[];
  outgoing?: ModdleElement[];
};

function nodeToBpmnType(nodeType: CanonicalClusterFlow['nodes'][number]['type']): string {
  if (nodeType === 'start') {
    return 'bpmn:StartEvent';
  }
  if (nodeType === 'end') {
    return 'bpmn:EndEvent';
  }
  if (nodeType === 'decision') {
    return 'bpmn:ExclusiveGateway';
  }
  return 'bpmn:Task';
}

function shapeBounds(
  node: CanonicalClusterFlow['nodes'][number],
): { x: number; y: number; width: number; height: number } {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
}

export async function exportBpmnXml(model: CanonicalModel): Promise<string> {
  const moddle = new BpmnModdle();
  const create = <T extends ModdleElement = ModdleElement>(type: string, attrs?: Record<string, unknown>): T =>
    moddle.create<T>(type, attrs);

  const rootElements: ModdleElement[] = [];
  const diagrams: ModdleElement[] = [];

  for (const cluster of model.clusters) {
    const processId = makeStableId('process', cluster.id);
    const processName = cluster.name;
    const process = create('bpmn:Process', {
      id: processId,
      name: processName,
      isExecutable: false,
      flowElements: [],
    });

    const semanticNodeById = new Map<string, FlowNodeElement>();
    const semanticFlowById = new Map<string, ModdleElement>();

    for (const node of cluster.nodes) {
      const semanticNode = create<FlowNodeElement>(nodeToBpmnType(node.type), {
        id: makeStableId(cluster.id, node.id),
        name: node.label,
      });
      semanticNode.incoming = [];
      semanticNode.outgoing = [];
      semanticNodeById.set(node.id, semanticNode);
    }

    const flows: ModdleElement[] = [];
    for (const edge of cluster.edges) {
      const sourceRef = semanticNodeById.get(edge.sourceId);
      const targetRef = semanticNodeById.get(edge.targetId);
      if (!sourceRef || !targetRef) {
        continue;
      }

      const sequenceFlow = create('bpmn:SequenceFlow', {
        id: makeStableId(cluster.id, edge.id),
        name: edge.label || undefined,
        sourceRef,
        targetRef,
      });

      sourceRef.outgoing?.push(sequenceFlow);
      targetRef.incoming?.push(sequenceFlow);
      flows.push(sequenceFlow);
      semanticFlowById.set(edge.id, sequenceFlow);
    }

    for (const semanticNode of semanticNodeById.values()) {
      if (semanticNode.$type === 'bpmn:ExclusiveGateway' && (semanticNode.outgoing?.length ?? 0) > 0) {
        semanticNode.default = semanticNode.outgoing?.[0];
      }
    }

    process.flowElements = [...semanticNodeById.values(), ...flows];

    const planeElements: ModdleElement[] = [];
    for (const node of cluster.nodes) {
      const semanticNode = semanticNodeById.get(node.id);
      if (!semanticNode) {
        continue;
      }

      const bounds = create('dc:Bounds', shapeBounds(node));
      const shape = create('bpmndi:BPMNShape', {
        id: `${makeStableId(cluster.id, node.id)}_di`,
        bpmnElement: semanticNode,
        bounds,
      });
      if (semanticNode.$type === 'bpmn:ExclusiveGateway') {
        shape.isMarkerVisible = true;
      }
      planeElements.push(shape);
    }

    const sourceNodeById = new Map(cluster.nodes.map((node) => [node.id, node]));
    for (const edge of cluster.edges) {
      const sourceNode = sourceNodeById.get(edge.sourceId);
      const targetNode = sourceNodeById.get(edge.targetId);
      const semanticFlow = semanticFlowById.get(edge.id);
      if (!sourceNode || !targetNode || !semanticFlow) {
        continue;
      }

      const waypoints = defaultEdgeWaypoints(sourceNode, targetNode).map((point) =>
        create('dc:Point', { x: point.x, y: point.y }),
      );
      const edgeElement = create('bpmndi:BPMNEdge', {
        id: `${makeStableId(cluster.id, edge.id)}_di`,
        bpmnElement: semanticFlow,
        waypoint: waypoints,
      });
      planeElements.push(edgeElement);
    }

    const plane = create('bpmndi:BPMNPlane', {
      id: `${processId}_plane`,
      bpmnElement: process,
      planeElement: planeElements,
    });
    const diagram = create('bpmndi:BPMNDiagram', {
      id: `${processId}_diagram`,
      plane,
    });

    rootElements.push(process);
    diagrams.push(diagram);
  }

  const definitions = create('bpmn:Definitions', {
    id: makeStableId(model.id, 'definitions'),
    targetNamespace: 'http://bpmn.io/schema/bpmn',
    exporter: 'WIZARD_FRESH',
    exporterVersion: '1.0.0',
    rootElements,
    diagrams,
  });

  const { xml } = await moddle.toXML(definitions, { format: true });
  return xml;
}
