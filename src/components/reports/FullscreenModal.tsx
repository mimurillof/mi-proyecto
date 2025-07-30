import React, { useEffect } from 'react';

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    chartUrl: string;
    children?: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    chartUrl,
    children 
}) => {
    // Cerrar con tecla Escape
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevenir scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative w-full h-full max-w-7xl max-h-screen m-4 bg-white rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <div className="flex items-center gap-2">
                        {/* Botón de actualizar */}
                        <button
                            onClick={() => window.location.reload()}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            title="Actualizar gráfico"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        
                        {/* Botón de cerrar */}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            title="Cerrar (Esc)"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Chart Content */}
                <div className="flex-1 p-4 overflow-hidden">
                    <div className="w-full h-full bg-white rounded border">
                        <iframe
                            src={chartUrl}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            title={title}
                            className="rounded"
                            style={{ minHeight: '600px' }}
                        />
                    </div>
                </div>
                
                {/* Footer with additional info */}
                {children && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                        {children}
                    </div>
                )}
                
                {/* Instructions */}
                <div className="px-4 pb-4 text-xs text-gray-500 text-center">
                    Presiona <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Esc</kbd> para cerrar o haz clic fuera del gráfico
                </div>
            </div>
        </div>
    );
};

export default FullscreenModal;
