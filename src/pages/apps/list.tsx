import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
import { Search, Filter, Plus } from 'lucide-react';
import { fetchApps } from '../../api/apps';
import type { AppFilters } from '../../types/app';
import { useDebounce } from '../../hooks/useDebounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { AppCard } from './components/app-card';
import { NewAppCard } from './components/new-app-card';
import { Empty } from './components/empty';
import { Footer } from './components/footer';

const ITEMS_PER_PAGE = 12;

export const List: React.FC = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [myApps, setMyApps] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 500);

    const filters: AppFilters = {
        search: debouncedSearch,
        myApps,
    };

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return ['apps', pageIndex + 1, filters];
    };

    const { data, size, setSize, isLoading, mutate } = useSWRInfinite(
        getKey,
        ([_key, page, pageFilters]) => fetchApps(page as number, ITEMS_PER_PAGE, pageFilters as AppFilters),
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        }
    );

    const apps = data ? data.flatMap(page => page.data) : [];
    const hasMore = data ? data[data.length - 1]?.hasMore : false;
    const isEmpty = !isLoading && apps.length === 0;

    const observerTarget = useInfiniteScroll({
        onLoadMore: () => setSize(size + 1),
        hasMore,
        isLoading,
    });

    const handleCreateBlank = () => {
        navigate('/workflow/new');
    };

    const handleCreateFromTemplate = () => {
        // TODO: Open template selector modal
        console.log('Create from template');
    };

    const handleImportDSL = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const dsl = JSON.parse(event.target?.result as string);
                        console.log('Imported DSL:', dsl);
                        // TODO: Process DSL import
                    } catch (err) {
                        console.error('Invalid DSL file:', err);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const dsl = JSON.parse(event.target?.result as string);
                    console.log('Dropped DSL:', dsl);
                    // TODO: Process DSL import
                } catch (err) {
                    console.error('Invalid DSL file:', err);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div
            className="relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <h1 className="text-sm font-medium text-gray-900">Apps</h1>
                <span className="text-xs text-gray-400">{apps.length} AVAILABLE</span>
            </div>

            {/* Apps Grid */}
            {isEmpty ? (
                <Empty isLoading={false} />
            ) : (
                <>
                    <div className="flex flex-wrap gap-6">
                        {/* New App Card */}
                        <NewAppCard
                            onCreateBlank={handleCreateBlank}
                            onCreateFromTemplate={handleCreateFromTemplate}
                            onImportDSL={handleImportDSL}
                        />

                        {/* App Cards */}
                        {apps.map(app => (
                            <AppCard key={app.id} app={app} onUpdate={() => mutate()} />
                        ))}
                    </div>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="mt-6 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Infinite scroll trigger */}
                    <div ref={observerTarget} className="h-4 mt-6" />
                </>
            )}

            {/* Drag & Drop Overlay */}
            {isDragging && (
                <div className="fixed inset-0 bg-primary-500/10 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-12 border-4 border-dashed border-primary-500">
                        <div className="text-center">
                            <Plus className="w-16 h-16 mx-auto mb-4 text-primary-600" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Drop DSL File Here
                            </h3>
                            <p className="text-gray-600">
                                Release to import your workflow
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
