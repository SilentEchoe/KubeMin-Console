import React from 'react';
import { FileText, Sparkles, Upload } from 'lucide-react';

interface NewAppCardProps {
    onCreateBlank: () => void;
    onCreateFromTemplate: () => void;
    onImportDSL: () => void;
}

export const NewAppCard: React.FC<NewAppCardProps> = ({
    onCreateBlank,
    onCreateFromTemplate,
    onImportDSL,
}) => {
    return (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl border-2 border-dashed border-primary-300 p-3 w-[290px] h-[160px] flex flex-col">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Create New App
            </h3>

            <div className="flex-1 flex flex-col gap-1.5">
                <button
                    onClick={onCreateBlank}
                    className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-400 transition-all text-left group"
                >

                    <div className="flex-1">
                        <div className="font-medium text-xs text-gray-900">Blank App</div>
                        <div className="text-[10px] text-gray-500">Start from scratch</div>
                    </div>
                </button>

                <button
                    onClick={onCreateFromTemplate}
                    className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-400 transition-all text-left group"
                >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-xs text-gray-900">From Template</div>
                        <div className="text-[10px] text-gray-500">Use a pre-built template</div>
                    </div>
                </button>

                <button
                    onClick={onImportDSL}
                    className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-400 transition-all text-left group"
                >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-xs text-gray-900">Import DSL</div>
                        <div className="text-[10px] text-gray-500">Upload a DSL file</div>
                    </div>
                </button>
            </div>
        </div>
    );
};
