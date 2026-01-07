import type { App, AppListResponse, AppFilters, Component, Workflow } from '../types/app';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const fetchApps = async (
    page: number = 1,
    limit: number = 12,
    filters?: AppFilters
): Promise<AppListResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        let apps: App[] = data.applications || [];

        // Apply filters
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            apps = apps.filter(
                app =>
                    app.name.toLowerCase().includes(searchLower) ||
                    app.alias.toLowerCase().includes(searchLower) ||
                    app.description.toLowerCase().includes(searchLower)
            );
        }

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedApps = apps.slice(start, end);

        return {
            data: paginatedApps,
            total: apps.length,
            page,
            limit,
            hasMore: end < apps.length,
        };
    } catch (error) {
        console.error('Error fetching apps:', error);
        // Return empty result on error
        return {
            data: [],
            total: 0,
            page,
            limit,
            hasMore: false,
        };
    }
};

export const fetchTemplates = async (): Promise<App[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/templates`);
        if (!response.ok) {
            throw new Error('Failed to fetch templates');
        }
        const data = await response.json();
        return data.applications || [];
    } catch (error) {
        console.error('Error fetching templates:', error);
        return [];
    }
};

export const fetchAppComponents = async (appId: string): Promise<Component[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}/components`);
        if (!response.ok) {
            throw new Error('Failed to fetch app components');
        }
        const data = await response.json();
        return data.components || [];
    } catch (error) {
        console.error('Error fetching app components:', error);
        return [];
    }
};

export const fetchApp = async (id: string): Promise<App> => {
    try {
        // Since backend doesn't support single app fetch, we fetch all and filter
        const response = await fetch(`${API_BASE_URL}/applications`);
        if (!response.ok) {
            throw new Error('Failed to fetch applications');
        }
        const data = await response.json();
        const app = (data.applications || []).find((a: App) => a.id === id);

        if (!app) {
            throw new Error('Application not found');
        }

        return app;
    } catch (error) {
        console.error('Error fetching app:', error);
        throw error;
    }
};

export interface CreateAppRequest {
    name: string;
    namespace: string;
    version: string;
    description: string;
    alias?: string;
    project?: string;
    icon?: string;
    tmp_enable?: boolean;
    component: ComponentCreateRequest[];
    workflow: WorkflowStepCreateRequest[];
}

export interface ComponentCreateRequest {
    name: string;
    type: 'config' | 'secret' | 'store' | 'webservice';
    image?: string;
    replicas: number;
    properties?: {
        ports?: { port: number; expose: boolean }[];
        env?: Record<string, string>;
        conf?: Record<string, string>;
        secret?: Record<string, string>;
    };
    traits?: {
        storage?: {
            name: string;
            type: string;
            mountPath: string;
            tmpCreate?: boolean;
            size?: string;
        }[];
        envFrom?: {
            type: string;
            sourceName: string;
        }[];
    };
}

export interface WorkflowStepCreateRequest {
    name: string;
    mode: 'StepByStep' | 'DAG';
    components: string[];
}

export interface CreateAppResponse {
    id: string;
    name: string;
    alias: string;
    project: string;
    description: string;
    createTime: string;
    updateTime: string;
    icon: string;
    workflow_id: string;
}

export const createApp = async (data: CreateAppRequest): Promise<CreateAppResponse> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create application');
    }

    return response.json();
};

export const deleteApp = async (id: string): Promise<void> => {
    // TODO: Implement delete API call
    console.log('Delete app:', id);
    throw new Error('Delete not implemented');
};

export const duplicateApp = async (id: string): Promise<App> => {
    // TODO: Implement duplicate API call
    console.log('Duplicate app:', id);
    throw new Error('Duplicate not implemented');
};

export const exportApp = async (id: string): Promise<Blob> => {
    // TODO: Implement export API call
    console.log('Export app:', id);
    throw new Error('Export not implemented');
};

export const fetchWorkflows = async (appId: string): Promise<Workflow[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}/workflows`);
        if (!response.ok) {
            throw new Error('Failed to fetch workflows');
        }
        const data = await response.json();
        return data.workflows || [];
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return [];
    }
};

// Execute workflow and get task ID
export interface ExecuteWorkflowResponse {
    taskId: string;
}

export const executeWorkflow = async (appId: string, workflowId: string): Promise<ExecuteWorkflowResponse> => {
    const response = await fetch(`${API_BASE_URL}/applications/${appId}/workflow/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workflowId }),
    });
    if (!response.ok) {
        throw new Error('Failed to execute workflow');
    }
    return response.json();
};

// Task status types
export interface TaskComponentStatus {
    name: string;
    type: string;
    status: 'waiting' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout' | 'reject' | 'prepare';
    startTime?: number;
    endTime?: number;
}

export interface TaskStatusResponse {
    taskId: string;
    status: string;
    workflowId: string;
    workflowName: string;
    appId: string;
    type: string;
    components: TaskComponentStatus[];
}

export const getTaskStatus = async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/workflow/tasks/${taskId}/status`);
    if (!response.ok) {
        throw new Error('Failed to fetch task status');
    }
    return response.json();
};

// Cancel workflow execution
export const cancelWorkflow = async (appId: string, taskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/applications/${appId}/workflow/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
    });
    if (!response.ok) {
        throw new Error('Failed to cancel workflow');
    }
};

// Task history types
export interface TaskHistoryItem {
    id?: string;
    taskId?: string;
    name: string;
    status: 'waiting' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout' | 'reject' | 'prepare';
    startTime?: string | number;
    endTime?: string | number;
    workflowId: string;
    workflowName: string;
}

export interface TaskHistoryResponse {
    tasks: TaskHistoryItem[];
}

// Fetch task history for an application
export const fetchTaskHistory = async (appId: string): Promise<TaskHistoryItem[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/applications/${appId}/workflow/tasks`);
        if (!response.ok) {
            throw new Error('Failed to fetch task history');
        }
        const data: TaskHistoryResponse = await response.json();
        return data.tasks || [];
    } catch (error) {
        console.error('Error fetching task history:', error);
        return [];
    }
};

// Task stages types
export interface TaskStage {
    id: number;
    name: string;
    type: string;
    status: 'waiting' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout' | 'reject' | 'prepare';
    startTime?: number;
    endTime?: number;
    info?: string;
    error?: string;
}

export interface TaskStagesResponse {
    taskId: string;
    status: string;
    workflowId: string;
    workflowName: string;
    appId: string;
    type: string;
    stages: TaskStage[];
}

// Fetch task stages/details
export const fetchTaskStages = async (taskId: string): Promise<TaskStagesResponse | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/workflow/tasks/${taskId}/stages`);
        if (!response.ok) {
            throw new Error('Failed to fetch task stages');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching task stages:', error);
        return null;
    }
};


export interface TryApplicationComponent {
    name: string;
    type: string;
    replicas: number;
    image?: string;
    properties: {
        ports?: { port: number }[] | null;
        env?: Record<string, string> | null;
        conf?: Record<string, string> | null;
        secret?: Record<string, string> | null;
        command?: string[] | null;
        labels?: Record<string, string> | null;
    };
    traits?: unknown;
}

export interface TryApplicationRequest {
    id: string;
    name: string;
    alias: string;
    version: string;
    project: string;
    description: string;
    namespace?: string;
    icon?: string;
    tmp_enable?: boolean;
    component: TryApplicationComponent[];
    workflow?: WorkflowStepCreateRequest[];
}


export interface SaveApplicationRequest extends TryApplicationRequest {
    namespace: string;
}

const readJsonOrText = async (response: Response): Promise<unknown> => {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

export const extractTryErrorMessage = (result: unknown): string | null => {
    if (result == null) return null;
    if (typeof result === 'string') return result.trim() ? result : null;
    if (Array.isArray(result)) {
        const items = result.filter((x) => typeof x === 'string' && x.trim()) as string[];
        return items.length ? items.join('; ') : null;
    }
    if (typeof result === 'object') {
        const record = result as Record<string, unknown>;
        const keys = ['error', 'errors', 'errorMessage', 'errMsg', 'detail', 'details', 'message'];
        for (const key of keys) {
            const value = record[key];
            if (typeof value === 'string' && value.trim()) return value;
            if (Array.isArray(value)) {
                const strings = value.filter((x) => typeof x === 'string' && x.trim()) as string[];
                if (strings.length) return strings.join('; ');
            }
        }
    }
    return null;
};

export const tryApplication = async (data: TryApplicationRequest): Promise<unknown> => {
    const response = await fetch(`${API_BASE_URL}/applications/try`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save application');
    }

    return readJsonOrText(response);
};

export const saveApplication = async (data: SaveApplicationRequest): Promise<unknown> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save application');
    }

    return readJsonOrText(response);
};
