import React from 'react';
import './AlertsNotificationsCenter.css'; // Opcional, para estilos específicos

// --- ICONOS SVG COMO COMPONENTES FUNCIONALES O CONSTANTES JSX ---
const ICONS = {
    opportunity: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path></svg>,
    warning: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.257 3.099c.625-1.095 2.13-1.095 2.755 0l5.483 9.632A2 2 0 0114.998 16H4.22c-1.302 0-2.265-1.49-1.728-2.685l5.483-9.632zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>,
    critical: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>,
    info: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>,
    aiAgent: <svg className="w-10 h-10 rounded-full p-1 bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM7 11h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zM7 15h10v2H7v-2z"></path></svg>,
    userPlaceholder: <svg className="w-10 h-10 rounded-full text-gray-400 dark:text-slate-500 bg-gray-200 dark:bg-slate-700 p-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
};

const alertColorMapping = {
    opportunity: { bg: 'bg-green-50 dark:bg-green-900', border: 'border-green-500 dark:border-green-700', text: 'text-green-700 dark:text-green-300', iconText: 'text-green-500 dark:text-green-400' },
    warning: { bg: 'bg-yellow-50 dark:bg-yellow-900', border: 'border-yellow-500 dark:border-yellow-700', text: 'text-yellow-700 dark:text-yellow-300', iconText: 'text-yellow-500 dark:text-yellow-400' },
    critical: { bg: 'bg-red-50 dark:bg-red-900', border: 'border-red-500 dark:border-red-700', text: 'text-red-700 dark:text-red-300', iconText: 'text-red-500 dark:text-red-400' },
    info: { bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-500 dark:border-blue-700', text: 'text-blue-700 dark:text-blue-300', iconText: 'text-blue-500 dark:text-blue-400' }
};

type AlertType = 'opportunity' | 'warning' | 'critical' | 'info';

interface AlertData {
    id: string;
    type: AlertType;
    iconSVG: JSX.Element;
    message: string;
    authorType: 'AI' | 'Analyst' | 'System';
    authorName: string;
}

interface NotificationData {
    id: string;
    avatarType: 'AI' | 'Analyst' | 'System' | 'User';
    senderName: string;
    notificationText: string;
    timestamp: string;
    isRead: boolean;
}

const alertsData: AlertData[] = [
    { id: 'alert1', type: 'opportunity', iconSVG: ICONS.opportunity, message: "Oportunidad de compra detectada para TechCorp (TCORP) debido a resultados trimestrales positivos.", authorType: 'AI', authorName: "AI Financial Advisor" },
    { id: 'alert2', type: 'warning', iconSVG: ICONS.warning, message: "Movimiento inusual en el volumen de 'Global Goods Inc.', se recomienda monitoreo.", authorType: 'Analyst', authorName: "Elena Ríos" },
    { id: 'alert3', type: 'critical', iconSVG: ICONS.critical, message: "Alerta: El valor de 'CryptoX Coin' ha caído un 15% en la última hora.", authorType: 'AI', authorName: "AI Market Monitor" },
    { id: 'alert4', type: 'info', iconSVG: ICONS.info, message: "Actualización de política de privacidad programada para el próximo mes.", authorType: 'System', authorName: "Equipo de Cumplimiento" }
];

const notificationsData: NotificationData[] = [
    { id: 'notif1', avatarType: 'AI', senderName: "AI Portfolio Agent", notificationText: "El informe mensual de su portafolio ya está disponible en la sección de documentos.", timestamp: "Hace 10 minutos", isRead: false },
    { id: 'notif2', avatarType: 'Analyst', senderName: "Javier Luna (Analista)", notificationText: "Recordatorio: Reunión de estrategia de inversión programada para el Viernes a las 11:00 AM.", timestamp: "Ayer, 18:20", isRead: true },
    { id: 'notif3', avatarType: 'System', senderName: "Sistema de Alertas", notificationText: "El activo 'Global ETF Bond' ha tenido una variación de +0.5% en las últimas 24h.", timestamp: "2024-03-10 09:00", isRead: true },
    { id: 'notif4', avatarType: 'AI', senderName: "AI News Digest", notificationText: "Actualización de mercado: El sector tecnológico muestra un crecimiento del 2% impulsado por la IA.", timestamp: "Hace 2 horas", isRead: false },
    { id: 'notif5', avatarType: 'Analyst', senderName: "Laura Gómez (Analista)", notificationText: "He añadido nuevas notas de análisis sobre su activo 'EcoEnergy Corp'. Puede revisarlas en su perfil.", timestamp: "Hace 3 días", isRead: true }
];

const getAvatarSvg = (avatarType: NotificationData['avatarType']): JSX.Element => {
    if (avatarType === 'AI' || avatarType === 'System') return ICONS.aiAgent;
    if (avatarType === 'Analyst' || avatarType === 'User') return ICONS.userPlaceholder;
    // Fallback, aunque no debería ser necesario con tipos estrictos
    return <img src="https://via.placeholder.com/40" alt="avatar" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700" />;
};

const AlertsNotificationsCenter: React.FC = () => {
    // En una aplicación real, estos datos vendrían de props o un estado global/contexto
    // y las funciones para marcar como leído se manejarían aquí.

    return (
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-lg overflow-hidden h-full flex flex-col">
            <header className="bg-slate-800 dark:bg-slate-700 text-white p-6 flex-shrink-0">
                <h1 className="text-2xl font-bold">Centro de Alertas y Notificaciones</h1>
            </header>
            
            <div className="p-6 flex-grow overflow-y-auto">
                <section className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                        Alertas Importantes
                    </h2>
                    <div className="space-y-4">
                        {alertsData.map(alert => {
                            const colors = alertColorMapping[alert.type] || alertColorMapping.info;
                            return (
                                <div key={alert.id} className={`p-4 border-l-4 rounded-md flex items-start space-x-3 shadow-sm ${colors.bg} ${colors.border}`}>
                                    <div className={`flex-shrink-0 ${colors.iconText}`}>
                                        {alert.iconSVG}
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`font-semibold ${colors.text}`}>{alert.message}</p>
                                        <p className={`text-sm ${colors.text} opacity-80 mt-1`}>
                                            Fuente: {alert.authorName} 
                                            ({alert.authorType === 'AI' ? 'Agente IA' : alert.authorType === 'Analyst' ? 'Analista' : 'Sistema'})
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                         {alertsData.length === 0 && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No hay alertas importantes.</p>
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4 pb-2 border-b border-gray-200 dark:border-slate-700">
                        Historial de Notificaciones
                    </h2>
                    <div className="bg-white dark:bg-slate-800 rounded-md border border-gray-200 dark:border-slate-700 notifications-list-scroll">
                        {notificationsData.length === 0 && (
                            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">No hay notificaciones recientes.</p>
                        )}
                        {notificationsData.map(notification => {
                            const avatarHTML = getAvatarSvg(notification.avatarType);
                            const readStatusClasses = !notification.isRead 
                                ? 'bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800' 
                                : 'hover:bg-gray-50 dark:hover:bg-slate-700';
                            const textWeightClass = !notification.isRead ? 'font-semibold' : 'font-normal';

                            return (
                                <div key={notification.id} className={`flex items-start p-3 sm:p-4 space-x-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0 transition-colors duration-150 ease-in-out ${readStatusClasses}`}>
                                    <div className="flex-shrink-0 mt-1">
                                        {avatarHTML}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${textWeightClass} text-gray-800 dark:text-gray-200 truncate`}>{notification.senderName}</p>
                                        <p className={`text-sm ${!notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{notification.notificationText}</p>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{notification.timestamp}</p>
                                    </div>
                                    {!notification.isRead 
                                        ? <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 ml-2"></div> 
                                        : <div className="w-2.5 h-2.5 flex-shrink-0 ml-2"></div>}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center flex-shrink-0">
                    La información mostrada es con fines ilustrativos y no representa datos en tiempo real.
                </p>
            </div>
        </div>
    );
};

export default AlertsNotificationsCenter;
