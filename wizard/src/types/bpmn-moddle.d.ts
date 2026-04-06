declare module 'bpmn-moddle' {
  interface ModdleElement {
    $type?: string;
    [key: string]: unknown;
  }

  export class BpmnModdle {
    create<T extends ModdleElement = ModdleElement>(
      type: string,
      attrs?: Record<string, unknown>,
    ): T;

    toXML(
      element: object,
      options?: { format?: boolean },
    ): Promise<{ xml: string }>;

    fromXML(xml: string): Promise<{
      rootElement: object;
      warnings?: unknown[];
    }>;
  }
}
