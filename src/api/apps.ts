import type { App, AppListResponse, AppFilters } from '../types/app';

// Mock data generator
const generateMockApps = (count: number, offset: number): App[] => {
    const tags = [
        { id: '1', name: 'Production', color: '#10b981' },
        { id: '2', name: 'Development', color: '#3b82f6' },
        { id: '3', name: 'Testing', color: '#f59e0b' },
        { id: '4', name: 'AI', color: '#8b5cf6' },
        { id: '5', name: 'Chatbot', color: '#ec4899' },
    ];

    const icons = ['🚀', '💡', '🎯', '⚡', '🔥', '🌟', '🎨', '📊', '🔧', '🎭'];
    const backgrounds = ['#dbeafe', '#fce7f3', '#fef3c7', '#ddd6fe', '#d1fae5', '#fecaca'];

    return Array.from({ length: count }, (_, i) => {
        const index = offset + i;
        return {
            id: `app-${index}`,
            name: `Application ${index}`,
            description: `This is a sample application description for app ${index}. It demonstrates the capabilities of our workflow system with advanced features.`,
            icon: icons[index % icons.length],
            iconBackground: backgrounds[index % backgrounds.length],
            createdBy: index % 3 === 0 ? 'You' : `User ${index % 5}`,
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            updatedAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
            tags: [tags[index % tags.length], tags[(index + 1) % tags.length]],
            isPublic: index % 2 === 0,
        };
    });
};

// Mock database
let mockApps: App[] = generateMockApps(100, 0);

export const fetchApps = async (
    page: number = 1,
    limit: number = 12,
    filters?: AppFilters
): Promise<AppListResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredApps = [...mockApps];

    // Apply filters
    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredApps = filteredApps.filter(
            app =>
                app.name.toLowerCase().includes(searchLower) ||
                app.description.toLowerCase().includes(searchLower)
        );
    }

    if (filters?.tags && filters.tags.length > 0) {
        filteredApps = filteredApps.filter(app =>
            app.tags.some(tag => filters.tags!.includes(tag.id))
        );
    }

    if (filters?.myApps) {
        filteredApps = filteredApps.filter(app => app.createdBy === 'You');
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedApps = filteredApps.slice(start, end);

    return {
        data: paginatedApps,
        total: filteredApps.length,
        page,
        limit,
        hasMore: end < filteredApps.length,
    };
};

export const deleteApp = async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    mockApps = mockApps.filter(app => app.id !== id);
};

export const duplicateApp = async (id: string): Promise<App> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const app = mockApps.find(a => a.id === id);
    if (!app) throw new Error('App not found');

    const newApp: App = {
        ...app,
        id: `app-${Date.now()}`,
        name: `${app.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    mockApps = [newApp, ...mockApps];
    return newApp;
};

export const exportApp = async (id: string): Promise<Blob> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const app = mockApps.find(a => a.id === id);
    if (!app) throw new Error('App not found');

    const dsl = JSON.stringify(app, null, 2);
    return new Blob([dsl], { type: 'application/json' });
};
