import React, { useState } from 'react';
import FullscreenModal from './FullscreenModal';

interface ChartWithFullscreenProps {
    chartUrl: string;
    title: string;
    height?: string;
    className?: string;
    additionalInfo?: React.ReactNode;
}

const ChartWithFullscreen: React.FC<ChartWithFullscreenProps> = ({
    chartUrl,
    title,
    height = "100%",
    className = "",
    additionalInfo
}) => {
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    const openFullscreen = () => {
        setIsFullscreenOpen(true);
    };

    const closeFullscreen = () => {
        setIsFullscreenOpen(false);
    };

    return (
        <>
            {/* Chart Container with Fullscreen Button */}
            <div className={`relative group ${className}`} style={{ height, minHeight: height === "100%" ? "300px" : undefined }}>
                {/* Chart iframe */}
                <iframe
                    src={chartUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title={title}
                    className="rounded"
                    style={{ minHeight: "300px" }}
                />
                
                {/* Fullscreen Button - appears on hover */}
                <button
                    onClick={openFullscreen}
                    className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    title="Ver en pantalla completa"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>
            </div>

            {/* Fullscreen Modal */}
            <FullscreenModal
                isOpen={isFullscreenOpen}
                onClose={closeFullscreen}
                title={title}
                chartUrl={chartUrl}
            >
                {additionalInfo}
            </FullscreenModal>
        </>
    );
};

export default ChartWithFullscreen;
