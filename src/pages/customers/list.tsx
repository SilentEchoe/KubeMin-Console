import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Upload, Play } from 'lucide-react';
import useSWRInfinite from 'swr/infinite';
import { fetchCustomers } from '../../api/customers';
import type { CustomerFilters } from '../../types/customer';
import { useDebounce } from '../../hooks/useDebounce';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { CustomerCard } from './components/CustomerCard';
import { Empty } from './components/Empty';
import PixelCatLoader32 from './components/PixelCatLoader32';

const ITEMS_PER_PAGE = 12;

export const List: React.FC = () => {
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showTestLoader, setShowTestLoader] = useState(false);

    const debouncedSearch = useDebounce(searchInput, 500);

    const filters: CustomerFilters = {
        search: debouncedSearch,
        status: statusFilter.length > 0 ? statusFilter : undefined,
    };

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.hasMore) return null;
        return ['customers', pageIndex + 1, filters];
    };

    const { data, size, setSize, isLoading } = useSWRInfinite(
        getKey,
        ([_key, page, pageFilters]) => fetchCustomers(page as number, ITEMS_PER_PAGE, pageFilters as CustomerFilters),
        {
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        }
    );

    const customers = data ? data.flatMap(page => page.data) : [];
    const hasMore = data ? data[data.length - 1]?.hasMore : false;
    const isEmpty = !isLoading && customers.length === 0;
    const totalCount = data ? data[0]?.total : 0;

    const observerTarget = useInfiniteScroll({
        onLoadMore: () => setSize(size + 1),
        hasMore,
        isLoading,
    });

    const handleCreateCustomer = () => {
        // TODO: Implement customer creation modal
        console.log('Create new customer');
    };

    const handleImportCustomers = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.xlsx';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                console.log('Import customers from:', file.name);
                // TODO: Implement customer import
            }
        };
        input.click();
    };

    const handleExportCustomers = () => {
        console.log('Export customers');
        // TODO: Implement customer export
    };

    const handleTestLoadingAnimation = () => {
        setShowTestLoader(true);
        // Hide the loader after 5 seconds
        setTimeout(() => {
            setShowTestLoader(false);
        }, 5000);
    };

    const handleEditCustomer = (customer: any) => {
        console.log('Edit customer:', customer.id);
        // TODO: Implement customer edit modal
    };

    const handleDeleteCustomer = (customer: any) => {
        console.log('Delete customer:', customer.id);
        // TODO: Implement customer deletion
    };

    const toggleStatusFilter = (status: string) => {
        setStatusFilter(prev =>
            prev.includes(status)
                ? prev.filter(s => s !== status)
                : [...prev, status]
        );
    };

    return (
        <div className="relative">


            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <h1 className="text-sm font-medium text-gray-900">Customers</h1>
                <span className="text-xs text-gray-400">{totalCount} TOTAL</span>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, or company..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>

                <button
                    onClick={handleExportCustomers}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export
                </button>

                <button
                    onClick={handleImportCustomers}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    Import
                </button>

                <button
                    onClick={handleCreateCustomer}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Customer
                </button>
            </div>

            {/* Status Filters */}
            {showFilters && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h3>
                    <div className="flex gap-3">
                        {['active', 'inactive', 'pending'].map(status => (
                            <button
                                key={status}
                                onClick={() => toggleStatusFilter(status)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${statusFilter.includes(status)
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Test Loading Animation */}
            {showTestLoader && (
                <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
                    <div className="text-center">
                        <PixelCatLoader32 />
                        <button
                            onClick={() => setShowTestLoader(false)}
                            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Skip Animation
                        </button>
                    </div>
                </div>
            )}

            {/* Customers Grid */}
            {!showTestLoader && (
                <>
                    {isEmpty ? (
                        <Empty isLoading={isLoading} onCreateCustomer={handleCreateCustomer} />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {customers.map(customer => (
                                    <CustomerCard
                                        key={customer.id}
                                        customer={customer}
                                        onEdit={handleEditCustomer}
                                        onDelete={handleDeleteCustomer}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator - Compact 32px pixel sleeping cat */}
                            {isLoading && (
                                <div className="mt-6 flex justify-center">
                                    <PixelCatLoader32 />
                                </div>
                            )}

                            {/* Infinite scroll trigger */}
                            <div ref={observerTarget} className="h-4 mt-6" />
                        </>
                    )}
                </>
            )}
        </div>
    );
};