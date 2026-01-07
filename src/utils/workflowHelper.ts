import type { FlowNode, FlowEdge } from '../types/flow';
import type { WorkflowStepCreateRequest } from '../api/apps';

/**
 * Convert nodes and edges to workflow steps structure
 */
export const nodesAndEdgesToWorkflow = (
    nodes: FlowNode[],
    edges: FlowEdge[]
): WorkflowStepCreateRequest[] => {
    // Map node id to name
    const idToName = new Map<string, string>();
    nodes.forEach(node => {
        if (node.data.name) {
            idToName.set(node.id, node.data.name);
        }
    });

    // Build graph for topological sort / leveling
    const inDegree = new Map<string, number>();
    const adjacency = new Map<string, string[]>();

    nodes.forEach(node => {
        inDegree.set(node.id, 0);
        adjacency.set(node.id, []);
    });

    edges.forEach(edge => {
        const targetIn = inDegree.get(edge.target) || 0;
        inDegree.set(edge.target, targetIn + 1);

        const neighbors = adjacency.get(edge.source) || [];
        neighbors.push(edge.target);
        adjacency.set(edge.source, neighbors);
    });

    // Calculate levels (longest path from root)
    // Initialize queue with nodes having in-degree 0
    let queue: string[] = [];
    nodes.forEach(node => {
        if ((inDegree.get(node.id) || 0) === 0) {
            queue.push(node.id);
        }
    });

    // Re-calculate levels based on dependencies
    const nodeLevels = new Map<string, number>();
    nodes.forEach(n => nodeLevels.set(n.id, 0));

    // We can propagate levels. Limit iterations to prevent infinite loops in cycles.
    let changed = true;
    let iterations = 0;
    const maxIterations = nodes.length + 5;

    while (changed && iterations < maxIterations) {
        changed = false;
        edges.forEach(edge => {
            const sourceLevel = nodeLevels.get(edge.source) || 0;
            const targetLevel = nodeLevels.get(edge.target) || 0;

            if (sourceLevel + 1 > targetLevel) {
                nodeLevels.set(edge.target, sourceLevel + 1);
                changed = true;
            }
        });
        iterations++;
    }

    // Group by level
    const levelGroups = new Map<number, string[]>();
    let maxLevel = 0;

    nodeLevels.forEach((level, id) => {
        const group = levelGroups.get(level) || [];
        group.push(id);
        levelGroups.set(level, group);
        if (level > maxLevel) maxLevel = level;
    });

    // Construct steps
    const steps: WorkflowStepCreateRequest[] = [];

    // If no nodes, return empty
    if (nodes.length === 0) return [];

    // Iterate levels 0 to maxLevel
    for (let i = 0; i <= maxLevel; i++) {
        const nodeIds = levelGroups.get(i);
        if (nodeIds && nodeIds.length > 0) {
            steps.push({
                name: `step-${i + 1}`,
                mode: 'DAG', // Default to DAG to allow parallel execution within step if backend supports
                components: nodeIds.map(id => idToName.get(id)).filter(Boolean) as string[],
            });
        }
    }

    return steps;
};
