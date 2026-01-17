import type { Component } from '../types/app';
import type { FlowNode, FlowNodeData, Traits, TraitStorage, TraitEnv, TraitProbe, TraitContainer, TraitRbac, TraitRbacRule, TraitResource, TraitIngressSpec, TraitIngressRoute, TraitIngressTLSConfig, ConfigDataItem, SecretDataItem } from '../types/flow';

// Node layout configuration
const NODE_WIDTH = 240;
const NODE_HEIGHT = 100;
const HORIZONTAL_GAP = 80;
const VERTICAL_GAP = 120;
const START_X = 100;
const START_Y = 100;

// Component type to label mapping
const TYPE_LABELS: Record<string, string> = {
  config: 'Config/Secret',
  secret: 'Config/Secret',
  store: 'Store',
  webservice: 'Web Service',
};

/**
 * Map API component type to FlowNode componentType
 * config and secret both map to 'config-secret'
 */
function mapComponentType(type: string): FlowNodeData['componentType'] {
  if (type === 'config' || type === 'secret') {
    return 'config-secret';
  }
  return type as FlowNodeData['componentType'];
}

/**
 * Convert API Component to FlowNode format
 */
function convertComponentToNode(component: Component, position: { x: number; y: number }): FlowNode {
  const mappedType = mapComponentType(component.type);

  const nodeData: FlowNodeData = {
    label: TYPE_LABELS[component.type] || component.type,
    name: component.name,
    componentType: mappedType,
    originalType: component.type,  // Preserve original type for data handling
    namespace: component.namespace,
    replicas: component.replicas,
    image: component.image || component.properties?.image || '',
    description: '',
    enabled: true,
  };

  // Convert properties.env to environmentVariables (for store/webservice types)
  if (component.properties?.env) {
    nodeData.environmentVariables = Object.entries(component.properties.env).map(([key, value]) => ({
      key,
      value,
      type: 'String' as const,
      isSecret: false,
    }));
  }

  // Convert properties.ports (for store/webservice types)
  if (component.properties?.ports) {
    nodeData.ports = component.properties.ports.map(p => `${p.port}`);
  }

  // Convert properties.command (for job/webservice/store types)
  if (component.properties?.command) {
    nodeData.cmd = component.properties.command;
  }

  // Convert properties.conf to configData (for config type)
  // Config type uses conf field: { "master.cnf": "content...", "slave.cnf": "content..." }
  if (component.type === 'config' && component.properties?.conf) {
    nodeData.configData = Object.entries(component.properties.conf).map(([key, value], index): ConfigDataItem => ({
      id: `config-${index}`,
      key,      // filename like "master.cnf"
      value,    // file content
    }));
  }

  // Convert properties.secret to secretData (for secret type)
  // Secret type uses secret field: { "MYSQL_ROOT_PASSWORD": "base64value" }
  if (component.type === 'secret' && component.properties?.secret) {
    nodeData.secretData = Object.entries(component.properties.secret).map(([key, value], index): SecretDataItem => ({
      id: `secret-${index}`,
      key,      // secret key like "MYSQL_ROOT_PASSWORD"
      value,    // base64 encoded value
    }));
  }

  // Convert traits (mainly for store/webservice types)
  if (component.traits && Object.keys(component.traits).length > 0) {
    nodeData.traits = convertTraits(component.traits);

    // Extract probes to individual fields for UI display
    if (component.traits.probes) {
      const livenessProbe = component.traits.probes.find(p => p.type === 'liveness');
      const readinessProbe = component.traits.probes.find(p => p.type === 'readiness');

      if (livenessProbe) {
        nodeData.livenessEnabled = true;
        nodeData.livenessInitialDelay = livenessProbe.initialDelaySeconds;
        nodeData.livenessPeriod = livenessProbe.periodSeconds;
        nodeData.livenessTimeout = livenessProbe.timeoutSeconds;
        if (livenessProbe.exec?.command) {
          // Convert command array to string for display
          nodeData.livenessExecCommand = livenessProbe.exec.command.join(' ');
        }
      }

      if (readinessProbe) {
        nodeData.readinessEnabled = true;
        nodeData.readinessInitialDelay = readinessProbe.initialDelaySeconds;
        nodeData.readinessPeriod = readinessProbe.periodSeconds;
        nodeData.readinessTimeout = readinessProbe.timeoutSeconds;
        if (readinessProbe.exec?.command) {
          // Convert command array to string for display
          nodeData.readinessExecCommand = readinessProbe.exec.command.join(' ');
        }
      }
    }
  }

  return {
    id: `node-${component.id}`,
    type: 'custom',
    position,
    data: nodeData,
  };
}

/**
 * Convert API traits format to FlowNode traits format
 */
function convertTraits(apiTraits: Component['traits']): Traits {
  const traits: Traits = {};

  // Convert storage
  if (apiTraits.storage) {
    traits.storage = apiTraits.storage.map((s): TraitStorage => ({
      type: s.type,
      name: s.name,
      mountPath: s.mountPath,
      subPath: s.subPath,
      size: s.size,
      sourceName: s.sourceName,
    }));
  }

  // Convert envs
  if (apiTraits.envs) {
    traits.envs = apiTraits.envs.map((e): TraitEnv => ({
      name: e.name,
      valueFrom: e.valueFrom ? {
        secret: e.valueFrom.secret,
        field: e.valueFrom.field ? { fieldPath: e.valueFrom.field } : undefined,
      } : undefined,
    }));
  }

  // Convert probes
  if (apiTraits.probes) {
    traits.probes = apiTraits.probes.map((p): TraitProbe => ({
      type: p.type,
      initialDelaySeconds: p.initialDelaySeconds,
      periodSeconds: p.periodSeconds,
      timeoutSeconds: p.timeoutSeconds,
      exec: p.exec,
    }));
  }

  // Convert init containers
  if (apiTraits.init) {
    traits.init = apiTraits.init.map((initContainer): TraitContainer => ({
      name: initContainer.name,
      image: initContainer.properties?.image,
      command: initContainer.properties?.command || undefined,
      properties: {
        image: initContainer.properties?.image,
        command: initContainer.properties?.command || undefined,
        env: initContainer.properties?.env || undefined,
      },
      traits: initContainer.traits ? {
        storage: initContainer.traits.storage?.map((s): TraitStorage => ({
          type: s.type,
          name: s.name,
          mountPath: s.mountPath,
          subPath: s.subPath,
          size: s.size,
          sourceName: s.sourceName,
        })),
        envs: initContainer.traits.envs?.map((e): TraitEnv => ({
          name: e.name,
          valueFrom: e.valueFrom ? {
            secret: e.valueFrom.secret,
            field: e.valueFrom.field ? { fieldPath: e.valueFrom.field } : undefined,
          } : undefined,
        })),
      } : undefined,
    }));
  }

  // Convert sidecar containers
  if (apiTraits.sidecar) {
    traits.sidecar = apiTraits.sidecar.map((sidecar): TraitContainer => ({
      name: sidecar.name,
      image: sidecar.image,
      command: sidecar.command,
      traits: sidecar.traits ? {
        storage: sidecar.traits.storage?.map((s): TraitStorage => ({
          type: s.type,
          name: s.name,
          mountPath: s.mountPath,
          subPath: s.subPath,
          size: s.size,
          sourceName: s.sourceName,
        })),
        envs: sidecar.traits.envs?.map((e): TraitEnv => ({
          name: e.name,
          valueFrom: e.valueFrom ? {
            secret: e.valueFrom.secret,
            field: e.valueFrom.field ? { fieldPath: e.valueFrom.field } : undefined,
          } : undefined,
        })),
      } : undefined,
    }));
  }

  // Convert rbac
  if (apiTraits.rbac) {
    traits.rbac = apiTraits.rbac.map((r): TraitRbac => ({
      serviceAccount: r.serviceAccount,
      roleName: r.roleName,
      bindingName: r.bindingName,
      rules: r.rules.map((rule): TraitRbacRule => ({
        apiGroups: rule.apiGroups,
        resources: rule.resources,
        verbs: rule.verbs,
      })),
      roleLabels: r.roleLabels,
    }));
  }

  // Convert resource
  if (apiTraits.resource) {
    traits.resource = {
      cpu: apiTraits.resource.cpu,
      memory: apiTraits.resource.memory,
      gpu: apiTraits.resource.gpu,
    } as TraitResource;
  }

  // Convert ingress
  if (apiTraits.ingress) {
    traits.ingress = apiTraits.ingress.map((ing): TraitIngressSpec => ({
      name: ing.name,
      namespace: ing.namespace,
      hosts: ing.hosts,
      label: ing.label || {},
      annotations: ing.annotations,
      ingressClassName: ing.ingressClassName,
      defaultPathType: ing.defaultPathType,
      tls: ing.tls?.map((t): TraitIngressTLSConfig => ({
        secretName: t.secretName,
        hosts: t.hosts,
      })),
      routes: ing.routes.map((r): TraitIngressRoute => ({
        path: r.path,
        pathType: r.pathType,
        host: r.host,
        backend: {
          serviceName: r.backend.serviceName,
          servicePort: r.backend.servicePort,
          weight: r.backend.weight,
          headers: r.backend.headers,
        },
        rewrite: r.rewrite
          ? ({
            type: r.rewrite.type,
            match: r.rewrite.match,
            replacement: r.rewrite.replacement,
          })
          : undefined,
      })),
    }));
  }

  return traits;
}

/**
 * Check if component type is config/secret
 */
function isConfigSecretType(type: string): boolean {
  return type === 'config' || type === 'secret';
}

/**
 * Calculate node positions based on component type
 * Layout strategy:
 * - config/secret types (Config/Secret nodes) on top row
 * - store/webservice types on bottom row
 */
function calculatePositions(components: Component[]): Map<number, { x: number; y: number }> {
  const positions = new Map<number, { x: number; y: number }>();

  // Group components by type
  const configSecretComponents = components.filter(c => isConfigSecretType(c.type));
  const storeServiceComponents = components.filter(c => !isConfigSecretType(c.type));

  // Position config/secret components on top row
  configSecretComponents.forEach((component, index) => {
    positions.set(component.id, {
      x: START_X + index * (NODE_WIDTH + HORIZONTAL_GAP),
      y: START_Y,
    });
  });

  // Position store/webservice components on bottom row
  storeServiceComponents.forEach((component, index) => {
    positions.set(component.id, {
      x: START_X + index * (NODE_WIDTH + HORIZONTAL_GAP),
      y: START_Y + NODE_HEIGHT + VERTICAL_GAP,
    });
  });

  return positions;
}

/**
 * Convert array of API Components to FlowNodes
 */
export function componentsToNodes(components: Component[]): FlowNode[] {
  if (!components || components.length === 0) {
    return [];
  }

  const positions = calculatePositions(components);

  return components.map(component => {
    const position = positions.get(component.id) || { x: START_X, y: START_Y };
    return convertComponentToNode(component, position);
  });
}

export default componentsToNodes;
