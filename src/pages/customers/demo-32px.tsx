import React, { useState, useEffect } from 'react';
import PixelCatLoader32 from './components/PixelCatLoader32';

const Demo32px: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 自动停止加载以便对比
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const toggleLoading = () => {
        setLoading(!loading);
    };

    return (
     
    );
};

export default Demo32px;