import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    UserPlus,
    ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} h-full bg-[#F9FAFB] border-r border-gray-200 flex flex-col p-4 transition-all duration-300`}>
            {/* Brand */}
            <div className={`flex items-center gap-2 mb-6 ${isCollapsed ? 'justify-center px-0' : 'px-2'}`}>
                <div
                    className="w-6 h-6 bg-black rounded-md flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div className="w-3 h-3 bg-white rounded-full opacity-50" />
                    <div className="w-3 h-3 bg-white rounded-full -ml-1" />
                </div>
                {!isCollapsed && <span className="font-semibold text-gray-900 whitespace-nowrap">KubeMin-Cli</span>}
                <div
                    className={`border border-gray-200 rounded p-0.5 cursor-pointer hover:bg-gray-100 ${isCollapsed ? 'absolute -right-3 top-6 bg-white shadow-sm' : 'ml-auto'}`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-gray-500" />
                    ) : (
                        <Layout className="w-3 h-3 text-gray-500" />
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1 mb-8">
                <div className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer group">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <Search className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Search</span>}
                    </div>
                    {!isCollapsed && <span className="text-xs text-gray-400 border border-gray-200 rounded px-1 group-hover:border-gray-300">/</span>}
                </div>
                {[
                    { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
                    { icon: FileText, label: 'Apps', path: '/apps' },
                    { icon: Calendar, label: 'Schedule' },
                    { icon: Users, label: 'Customers' },
                    { icon: BarChart2, label: 'Leads Report' },
                    { icon: Building2, label: 'Companies' },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => item.path && navigate(item.path)}
                    >
                        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                            <item.icon className="w-4 h-4 shrink-0" />
                            {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                        </div>
                    </div>
                ))}
                <div className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-900 bg-gray-100 rounded-md cursor-pointer font-medium">
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                        <Layout className="w-4 h-4 shrink-0" />
                        {!isCollapsed && <span>Widget</span>}
                    </div>
                </div>
            </div>

            {/* Favorites */}
            <div className="mb-8">
                {!isCollapsed && <div className="text-xs font-medium text-gray-400 px-2 mb-2">FAVORITES</div>}
                <div className="space-y-1">
                    {[
                        { color: 'bg-black', label: 'Apple', type: 'COMPANY' },
                        { color: 'bg-green-500', label: 'Google', type: 'COMPANY' },
                        { color: 'bg-blue-500', label: 'ClickUp', type: 'COMPANY' },
                        { color: 'bg-indigo-500', label: 'Rico', type: 'INVESTOR' },
                        { color: 'bg-orange-500', label: 'Mehdi', type: 'DESIGNER' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                                {!isCollapsed && <span>{item.label}</span>}
                            </div>
                            {!isCollapsed && <span className="text-[10px] text-gray-400 font-medium">{item.type}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Searches */}
            <div>
                {!isCollapsed && <div className="text-xs font-medium text-gray-400 px-2 mb-2">SEARCHES</div>}
                <div className="space-y-1">
                    {[
                        { icon: Disc, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Customer Success' },
                        { icon: Zap, color: 'text-green-600', bg: 'bg-green-100', label: 'Outsourcing' },
                        { icon: Briefcase, color: 'text-pink-600', bg: 'bg-pink-100', label: 'Fundraising' },
                        { icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Recruiting' },
                    ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer">
                            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                                <div className={`p-0.5 ${item.bg} rounded shrink-0`}>
                                    <item.icon className={`w-3 h-3 ${item.color}`} />
                                </div>
                                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
