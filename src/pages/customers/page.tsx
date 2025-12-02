import React from 'react';
import { List } from './list';

const CustomersPage: React.FC = () => {
    return (
        <div className="flex h-screen w-full bg-white overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-white p-8">
                <List />
            </div>
        </div>
    );
};

export default CustomersPage;