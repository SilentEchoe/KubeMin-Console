import type { App, AppListResponse, AppFilters, Component, Workflow } from '../types/app';

const API_BASE_URL = 'http://localhost:8000/api/v1';

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
