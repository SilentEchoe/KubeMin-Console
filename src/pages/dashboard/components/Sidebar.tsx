import React from 'react';
import {
    Search,
    LayoutGrid,
    FileText,
    Calendar,
    Users,
    BarChart2,
    Building2,
    Layout,
    Disc,
    Zap,
    Briefcase,
    UserPlus
} from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <div className="w-64 h-full bg-[#F9FAFB] border-r border-gray-200 flex flex-col p-4">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                    <div className="w-3 h-3 bg-white rounded-full -ml-1" />
                </div>
                <span className="font-semibold text-gray-900">Acme Inc</span>
                <div className="ml-auto border border-gray-200 rounded p-0.5">
                    <Layout className="w-3 h-3 text-gray-500" />
                </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1 mb-8">
                <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                    </div>
                    <span className="text-xs text-gray-400 border border-gray-200 rounded px-1 group-hover:border-gray-300">/</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Assigned to me</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span>Drafts</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Users className="w-4 h-4" />
                    <span>Customers</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <BarChart2 className="w-4 h-4" />
                    <span>Leads Report</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                    <Building2 className="w-4 h-4" />
                    <span>Companies</span>
                </div>
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-900 bg-gray-100 rounded-md cursor-pointer font-medium">
                    <Layout className="w-4 h-4" />
                    <span>Widget</span>
                </div>
            </div>

            {/* Favorites */}
            <div className="mb-8">
                <div className="text-xs font-medium text-gray-400 px-2 mb-2">FAVORITES</div>
                <div className="space-y-1">
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-black" />
                            <span>Apple</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">COMPANY</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>Google</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">COMPANY</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span>ClickUp</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">COMPANY</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>Rico</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">INVESTOR</span>
                    </div>
                    <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span>Mehdi</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">DESIGNER</span>
                    </div>
                </div>
            </div>

            {/* Searches */}
            <div>
                <div className="text-xs font-medium text-gray-400 px-2 mb-2">SEARCHES</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="p-0.5 bg-orange-100 rounded">
                            <Disc className="w-3 h-3 text-orange-600" />
                        </div>
                        <span>Customer Success</span>
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="p-0.5 bg-green-100 rounded">
                            <Zap className="w-3 h-3 text-green-600" />
                        </div>
                        <span>Outsourcing</span>
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="p-0.5 bg-pink-100 rounded">
                            <Briefcase className="w-3 h-3 text-pink-600" />
                        </div>
                        <span>Fundraising</span>
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                        <div className="p-0.5 bg-blue-100 rounded">
                            <UserPlus className="w-3 h-3 text-blue-600" />
                        </div>
                        <span>Recruiting</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
