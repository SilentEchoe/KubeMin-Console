import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useEducationInit } from '../../hooks/useEducationInit';
import { List } from './list';

export const Apps: React.FC = () => {
    useDocumentTitle('Apps - KubeMin');
    useEducationInit();

    return (
        <div className="h-screen overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <List />
            </div>
        </div>
    );
};
