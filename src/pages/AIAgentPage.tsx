import React, { useEffect, useRef } from 'react';
import './AIAgentPage.css'; // Importar estilos específicos
import { Helmet } from 'react-helmet'; // Necesitamos instalar esta dependencia

const AIAgentPage: React.FC = () => {
    const mainChatInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleEnterPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        };

        const currentChatInput = mainChatInputRef.current;
        if (currentChatInput) {
            currentChatInput.addEventListener('keypress', handleEnterPress as EventListener);
        }

        const suggestionButtons = document.querySelectorAll<HTMLButtonElement>('section.ai-suggestion-buttons button');
        suggestionButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (mainChatInputRef.current) {
                    mainChatInputRef.current.value = button.textContent?.trim() || '';
                    mainChatInputRef.current.focus();
                }
            });
        });

        return () => {
            if (currentChatInput) {
                currentChatInput.removeEventListener('keypress', handleEnterPress as EventListener);
            }
        };
    }, []);

    function sendMessage() {
        if (mainChatInputRef.current) {
            const message = mainChatInputRef.current.value.trim();
            if (message) {
                console.log('Mensaje enviado:', message);
                mainChatInputRef.current.value = ''; // Limpiar input después de enviar
                alert('Mensaje enviado (simulación): ' + message);
            }
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-white text-gray-800 p-4 sm:p-6 overflow-auto">
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <main className="w-full max-w-3xl mx-auto flex flex-col items-center flex-grow">
                {/* Fila Superior */}
                <div className="w-full">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Financial Agent</h1>
                        <p className="text-gray-600 text-base sm:text-lg">
                            Uses multiple sources and tools to Financial Management
                        </p>
                    </header>

                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 w-full">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-md flex flex-col items-start h-full border border-gray-200">
                            <span className="material-symbols-sharp feature-card-icon text-blue-600 mb-3">quick_reference_all</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Report Analysis</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Analyzes financial reports to provide insights.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-md flex flex-col items-start h-full border border-gray-200">
                            <span className="material-symbols-sharp feature-card-icon text-amber-600 mb-3">area_chart</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Simulation and Forecasting</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Performs simulations and forecasts financial scenarios.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-md flex flex-col items-start h-full border border-gray-200">
                            <span className="material-symbols-sharp feature-card-icon text-purple-600 mb-3">dictionary</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Financial Terms Explained</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Explains complex financial terms clearly.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl shadow-md flex flex-col items-start h-full border border-gray-200">
                            <span className="material-symbols-sharp feature-card-icon text-teal-600 mb-3">travel_explore</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Latest market news</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Delivers up-to-date financial market news.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Fila Inferior - Contenido del chat */}
                <div className="w-full mt-auto">
                    <section className="flex flex-wrap justify-center gap-2 mb-8 ai-suggestion-buttons">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-gray-200">
                            Tell me about my portfolio!
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-gray-200">
                            Recommend new assets
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-gray-200">
                            How to diversify my portfolio?
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium py-2 px-3 rounded-lg transition-colors border border-gray-200">
                            What&apos;s the latest news?
                        </button>
                    </section>

                    <section className="w-full pt-6">
                        <div className="relative flex items-center mb-3">
                            <input
                                id="mainChatInput"
                                ref={mainChatInputRef}
                                type="text"
                                placeholder="Chatea con la IA..."
                                className="w-full p-4 pr-24 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-500"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                <button
                                    aria-label="Entrada de voz"
                                    title="Voz"
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md"
                                >
                                    <span className="material-symbols-sharp text-2xl">mic</span>
                                </button>
                                <button
                                    aria-label="Adjuntar archivo"
                                    title="Adjuntar"
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md"
                                >
                                    <span className="material-symbols-sharp text-2xl">attach_file</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center gap-3">
                            {/* Botones eliminados según el HTML original */}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AIAgentPage;
