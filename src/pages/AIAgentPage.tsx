import React, { useEffect, useRef, useState, useCallback } from 'react';
import './AIAgentPage.css'; // Importar estilos específicos
import { Helmet } from 'react-helmet'; // Necesitamos instalar esta dependencia
import { API_CONFIG, getApiUrl, getAuthHeaders } from '../config/api';

// Interfaces para tipos de datos
interface ChatMessage {
    id: string;
    type: 'user' | 'agent';
    content: string;
    timestamp: Date;
    model_used?: string;
    tools_used?: string[];
    session_id?: string;
    files?: string[]; // Nombres de archivos adjuntos
}

interface InlineFile {
    filename: string;
    content_type: string;
    data: string; // Base64
}

interface AgentResponse {
    response: string;
    model_used: string;
    tools_used: string[];
    metadata: Record<string, unknown>;
    urls_processed: string[];
    token_usage: Record<string, number>;
    session_id: string;
}

// Función helper para convertir archivo a base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // El resultado incluye el prefijo "data:mime/type;base64,", lo removemos
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = error => reject(error);
    });
};

const AIAgentPage: React.FC = () => {
    const mainChatInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Estados del componente
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const handleEnterPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !isLoading) {
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
    }, [isLoading]);

    // Scroll automático al final del chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Función para enviar mensaje al backend
    const sendMessage = useCallback(async () => {
        if (!mainChatInputRef.current) return;
        
        const message = mainChatInputRef.current.value.trim();
        if (!message && !selectedFile) return;

        setIsLoading(true);
        
        // Agregar mensaje del usuario al chat
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: message || 'Archivo adjunto para análisis',
            timestamp: new Date(),
            files: selectedFile ? [selectedFile.name] : undefined
        };
        
        setMessages(prev => [...prev, userMessage]);
        setShowChat(true);
        mainChatInputRef.current.value = '';

        // Crear mensaje del agente vacío que iremos llenando con chunks
        const agentMessageId = (Date.now() + 1).toString();
        const initialAgentMessage: ChatMessage = {
            id: agentMessageId,
            type: 'agent',
            content: '',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, initialAgentMessage]);

        try {
            // ✅ Preparar archivos inline (base64) si hay archivo seleccionado
            let inlineFiles: InlineFile[] | undefined;
            
            if (selectedFile) {
                const base64Data = await fileToBase64(selectedFile);
                inlineFiles = [{
                    filename: selectedFile.name,
                    content_type: selectedFile.type || 'application/octet-stream',
                    data: base64Data
                }];
            }
            
            // ✅ Usar streaming SSE para TODOS los casos (con o sin archivo)
            const requestBody = {
                message: message || 'Analiza este archivo y describe su contenido',
                files: inlineFiles // Puede ser undefined si no hay archivos
            };
            
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.CHAT), {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // ✅ Manejar errores de autenticación
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    window.dispatchEvent(new CustomEvent('authError', { 
                        detail: { 
                            status: response.status,
                            message: 'Sesión expirada. Por favor inicia sesión nuevamente.'
                        } 
                    }));
                }
                throw new Error(`Error del servidor: ${response.status}`);
            }

            // Procesar streaming SSE
            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let metadata: Record<string, unknown> | null = null;

            if (!reader) {
                throw new Error('No se pudo obtener el reader del stream');
            }

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const dataStr = line.slice(6);
                            try {
                                const data = JSON.parse(dataStr);
                                
                                // Si hay texto, agregarlo
                                if (data.text) {
                                    accumulatedContent += data.text;
                                    // Actualizar mensaje en tiempo real
                                    setMessages(prev => prev.map(msg => 
                                        msg.id === agentMessageId
                                            ? { ...msg, content: accumulatedContent }
                                            : msg
                                    ));
                                }
                                
                                // Si hay metadata final
                                if (data.metadata) {
                                    metadata = data.metadata;
                                }
                                
                                // Si llega "done", terminar
                                if (data.done) {
                                    // Actualizar con metadata final
                                    if (metadata) {
                                        setMessages(prev => prev.map(msg => 
                                            msg.id === agentMessageId
                                                ? { 
                                                    ...msg, 
                                                    model_used: metadata?.model_used as string,
                                                    tools_used: metadata?.tools_used as string[],
                                                    session_id: metadata?.session_id as string
                                                }
                                                : msg
                                        ));
                                    }
                                    return; // Terminar procesamiento
                                }
                                
                                // Si hay error
                                if (data.error) {
                                    throw new Error(data.error);
                                }
                            } catch (e) {
                                // Ignorar líneas que no son JSON válido
                                console.debug('Línea no-JSON ignorada:', line);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
            
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            
            // Actualizar mensaje del agente con error
            setMessages(prev => prev.map(msg => 
                msg.id === agentMessageId
                    ? { 
                        ...msg, 
                        content: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}. Verifica que el backend esté ejecutándose en ${API_CONFIG.BASE_URL}`
                    }
                    : msg
            ));
        } finally {
            setIsLoading(false);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [selectedFile]);

    // Manejar selección de archivo
    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    // Limpiar chat
    function clearChat() {
        setMessages([]);
        setShowChat(false);
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-start bg-white text-gray-800 p-4 sm:p-6 overflow-auto">
            <Helmet>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            
            <main className="w-full max-w-4xl mx-auto flex flex-col items-center flex-grow">
                {/* Header - solo visible si no hay chat */}
                {!showChat && (
                    <div className="w-full">
                        <header className="text-center mb-10">
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">Financial Agent</h1>
                            <p className="text-gray-600 text-base sm:text-lg">
                                Uses multiple sources and tools for Financial Management
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
                )}

                {/* Chat Area - visible cuando hay mensajes */}
                {showChat && (
                    <div className="w-full flex-grow flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Chat con Horizon Agent</h2>
                            <button
                                onClick={clearChat}
                                className="text-gray-500 hover:text-red-500 text-sm font-medium py-2 px-3 rounded-lg transition-colors"
                            >
                                Limpiar Chat
                            </button>
                        </div>
                        
                        <div 
                            ref={chatContainerRef}
                            className="flex-grow bg-gray-50 rounded-xl p-4 overflow-y-auto mb-4 border border-gray-200"
                            style={{ maxHeight: '400px' }}
                        >
                            {messages.map((message) => (
                                <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                                        message.type === 'user' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                    }`}>
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                        {message.type === 'agent' && message.model_used && (
                                            <div className="mt-2 text-xs text-gray-500">
                                                Modelo: {message.model_used} | Herramientas: {message.tools_used?.join(', ') || 'Ninguna'}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-xs text-gray-400 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="text-left mb-4">
                                    <div className="inline-block bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            <span className="text-gray-600">Horizon está pensando...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="w-full mt-auto">
                    {!showChat && (
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
                    )}

                    <section className="w-full pt-6">
                        {selectedFile && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="material-symbols-sharp text-blue-600">
                                        {selectedFile.type.startsWith('image/') ? 'image' : 
                                         selectedFile.type === 'application/pdf' ? 'picture_as_pdf' : 
                                         'description'}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-blue-800">{selectedFile.name}</span>
                                        <span className="text-xs text-blue-600">
                                            {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Desconocido'}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedFile(null)}
                                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors"
                                    aria-label="Eliminar archivo"
                                >
                                    <span className="material-symbols-sharp">close</span>
                                </button>
                            </div>
                        )}
                        
                        <div className="relative flex items-center mb-3">
                            <input
                                id="mainChatInput"
                                ref={mainChatInputRef}
                                type="text"
                                placeholder={isLoading ? "Procesando..." : "Chatea con Horizon Financial Agent..."}
                                disabled={isLoading}
                                className="w-full p-4 pr-24 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-500 disabled:opacity-50"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.csv,.json,.md"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    aria-label="Adjuntar archivo"
                                    title="Adjuntar archivo"
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md disabled:opacity-50"
                                >
                                    <span className="material-symbols-sharp text-2xl">attach_file</span>
                                </button>
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading}
                                    aria-label="Enviar mensaje"
                                    title="Enviar"
                                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md disabled:opacity-50"
                                >
                                    <span className="material-symbols-sharp text-2xl">
                                        {isLoading ? 'hourglass_empty' : 'send'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AIAgentPage;
