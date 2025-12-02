import React, { useState, useEffect } from 'react';
import PixelCatLoader from './components/PixelCatLoader';

const TestLoader: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading for 5 seconds then stop
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleTestAgain = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Pixel Cat Loader Test</h1>

            {loading ? (
                <PixelCatLoader />
            ) : (
                <div className="text-center">
                    <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-lg text-gray-700 mb-4">Loading complete! 🎉</p>
                    <p className="text-gray-500 mb-6">The pixel cat animation worked perfectly!</p>
                    <button
                        onClick={handleTestAgain}
                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Test Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default TestLoader;