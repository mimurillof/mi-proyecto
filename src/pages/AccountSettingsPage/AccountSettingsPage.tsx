import React, { useState, useEffect } from 'react';
import './AccountSettingsPage.css'; // Importar los estilos CSS

// Asumimos un userId fijo para el ejemplo. En una app real, esto vendría de la autenticación.
const USER_ID = 1;

interface UserProfileData {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender: string;
    idNumber: string;
    taxIdNumber: string;
    taxIdCountry: string;
    residentialAddress: string;
    aboutMe: string;
    avatarUrl?: string;
    birthDate?: string; // Considerar formato Date si es necesario
    idExpeditionDate?: string; // Considerar formato Date
}

const AccountSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('content-profile-settings');

    const [profileData, setProfileData] = useState<UserProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        gender: 'male',
        idNumber: '',
        taxIdNumber: '',
        taxIdCountry: '',
        residentialAddress: '',
        aboutMe: '',
        avatarUrl: 'https://via.placeholder.com/150', // Default avatar
    });

    const [notifications, setNotifications] = useState({
        priceLimit: true,
        newReport: false,
        importantNews: true,
        events: false,
        appNotifications: true,
        emailNotifications: true,
        browserNotifications: false,
        googleSync: true,
        linkedinSync: false,
        facebookSync: false,
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const handleTabClick = (targetId: string) => {
        setActiveTab(targetId);
    };

    const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileData(prev => ({ ...prev, gender: e.target.value }));
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/users/${USER_ID}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: profileData.firstName,
                    last_name: profileData.lastName,
                    mobile_number: profileData.mobileNumber,
                    gender: profileData.gender,
                    tax_id_number: profileData.taxIdNumber,
                    tax_id_country: profileData.taxIdCountry,
                    residential_address: profileData.residentialAddress,
                    about_me: profileData.aboutMe,
                    avatar_url: profileData.avatarUrl,
                    birth_date: profileData.birthDate,
                    id_expedition_date: profileData.idExpeditionDate,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error updating profile: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNotificationSettingsSave = async () => {
        try {
            const response = await fetch(`/api/users/${USER_ID}/notifications`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    price_limit_notifications: notifications.priceLimit,
                    new_report_notifications: notifications.newReport,
                    important_news_notifications: notifications.importantNews,
                    event_notifications: notifications.events,
                    app_notifications: notifications.appNotifications,
                    email_notifications: notifications.emailNotifications,
                    browser_notifications: notifications.browserNotifications,
                    google_sync_enabled: notifications.googleSync,
                    linkedin_sync_enabled: notifications.linkedinSync,
                    facebook_sync_enabled: notifications.facebookSync,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update notification settings');
            }
            alert('Notification settings updated successfully!');
        } catch (error) {
            console.error('Error updating notification settings:', error);
            alert(`Error updating notification settings: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            alert("New passwords do not match.");
            return;
        }
        // Aquí iría la lógica para llamar a la API de cambio de contraseña
        try {
            // const response = await fetch(`/api/users/${USER_ID}/password`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         old_password: passwordData.oldPassword,
            //         new_password: passwordData.newPassword,
            //     }),
            // });
            // if (!response.ok) {
            //     const errorData = await response.json();
            //     throw new Error(errorData.error || 'Failed to change password');
            // }
            alert('Password changed successfully! (Simulated)');
            setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error) {
            console.error('Error changing password:', error);
            alert(`Error changing password: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await fetch(`/api/users/${USER_ID}/profile`);
                if (!response.ok) throw new Error('Failed to fetch profile data');
                const data = await response.json();
                setProfileData({
                    firstName: data.first_name || '',
                    lastName: data.last_name || '',
                    email: data.email || '',
                    mobileNumber: data.mobile_number || '',
                    gender: data.gender || 'male',
                    idNumber: data.id_number || '',
                    taxIdNumber: data.tax_id_number || '',
                    taxIdCountry: data.tax_id_country || '',
                    residentialAddress: data.residential_address || '',
                    aboutMe: data.about_me || '',
                    avatarUrl: data.avatar_url || 'https://via.placeholder.com/150',
                    birthDate: data.birth_date,
                    idExpeditionDate: data.id_expedition_date,
                });
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        const fetchNotificationSettings = async () => {
            try {
                const response = await fetch(`/api/users/${USER_ID}/notifications`);
                if (!response.ok) throw new Error('Failed to fetch notification settings');
                const data = await response.json();
                setNotifications({
                    priceLimit: data.price_limit_notifications,
                    newReport: data.new_report_notifications,
                    importantNews: data.important_news_notifications,
                    events: data.event_notifications,
                    appNotifications: data.app_notifications,
                    emailNotifications: data.email_notifications,
                    browserNotifications: data.browser_notifications,
                    googleSync: data.google_sync_enabled,
                    linkedinSync: data.linkedin_sync_enabled,
                    facebookSync: data.facebook_sync_enabled,
                });
            } catch (error) {
                console.error("Error fetching notification settings:", error);
            }
        };

        if (activeTab === 'content-profile-settings') {
            fetchProfileData();
        }
        if (activeTab === 'content-notifications') {
            fetchNotificationSettings();
        }
    }, [activeTab]);

    return (
        <div className="bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Account settings</h1>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-56 flex-shrink-0 self-start">
                        <aside className="w-full bg-white rounded-lg shadow-md p-4 md:p-6 md:pb-3">
                            <nav className="space-y-1">
                                <a
                                    href="#"
                                    className={`sidebar-link ${activeTab === 'content-profile-settings' ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); handleTabClick('content-profile-settings'); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                    <span className="whitespace-nowrap">Profile Settings</span>
                                </a>
                                <a
                                    href="#"
                                    className={`sidebar-link ${activeTab === 'content-password' ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); handleTabClick('content-password'); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                    <span className="whitespace-nowrap">Password</span>
                                </a>
                                <a
                                    href="#"
                                    className={`sidebar-link ${activeTab === 'content-notifications' ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); handleTabClick('content-notifications'); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                    </svg>
                                    <span className="whitespace-nowrap">Notifications</span>
                                </a>
                                <a
                                    href="#"
                                    className={`sidebar-link ${activeTab === 'content-verification' ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); handleTabClick('content-verification'); }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="whitespace-nowrap">Verification</span>
                                </a>
                            </nav>
                        </aside>
                    </div>
                    <main className="flex-1 bg-white rounded-lg shadow-md overflow-auto">
                        {activeTab === 'content-profile-settings' && (
                            <div id="content-profile-settings" className="content-section p-4 sm:p-6 lg:p-8">
                                {/* Sección de Avatar/Foto de Perfil */}
                                <div className="flex flex-col sm:flex-row items-center mb-8">
                                    <div className="relative mb-4 sm:mb-0 sm:mr-6">
                                        <img className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300" src={profileData.avatarUrl} alt="User Avatar" />
                                        <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 -mb-1 -mr-1 cursor-pointer">
                                            <span className="camera-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M4 5a2 2 0 012-2h8a2 2 0 012 2h2a1 1 0 011 1v10a1 1 0 01-1 1h-2a2 2 0 01-2 2H6a2 2 0 01-2-2H2a1 1 0 01-1-1V6a1 1 0 011-1h2zm8 0H8v2h4V5z" />
                                                </svg>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <form action="#" method="POST" onSubmit={handleProfileSave}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div>
                                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                                            <input type="text" name="firstName" id="first-name" value={profileData.firstName} onChange={handleProfileInputChange} placeholder="First name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                                            <input type="text" name="lastName" id="last-name" value={profileData.lastName} onChange={handleProfileInputChange} placeholder="Last name" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input type="email" name="email" id="email" value={profileData.email} placeholder="examples@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" readOnly />
                                        </div>
                                        <div>
                                            <label htmlFor="mobile-number" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                    🇨🇴 +57
                                                </span>
                                                <input type="tel" name="mobileNumber" id="mobile-number" value={profileData.mobileNumber} onChange={handleProfileInputChange} placeholder="0806 123 7890" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 border" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-6">
                                                <div className="flex items-center">
                                                    <input id="gender-male" name="gender" type="radio" value="male" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" checked={profileData.gender === 'male'} onChange={handleGenderChange} />
                                                    <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-900">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input id="gender-female" name="gender" type="radio" value="female" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" checked={profileData.gender === 'female'} onChange={handleGenderChange} />
                                                    <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-900">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="id-number" className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                                            <input type="text" name="idNumber" id="id-number" value={profileData.idNumber} placeholder="1559 000 7788 8DER" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" readOnly />
                                        </div>
                                        <div>
                                            <label htmlFor="tax-id-number" className="block text-sm font-medium text-gray-700 mb-1">Tax Identification Number</label>
                                            <input type="text" name="taxIdNumber" id="tax-id-number" value={profileData.taxIdNumber} onChange={handleProfileInputChange} placeholder="examples@gmail.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                        </div>
                                        <div>
                                            <label htmlFor="tax-id-country" className="block text-sm font-medium text-gray-700 mb-1">Tax Identification Country</label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                    🇨🇴
                                                </span>
                                                <input type="text" name="taxIdCountry" id="tax-id-country" value={profileData.taxIdCountry} onChange={handleProfileInputChange} placeholder="Nigeria" className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 border" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="residential-address" className="block text-sm font-medium text-gray-700 mb-1">Residential Address</label>
                                            <textarea name="residentialAddress" id="residential-address" rows={3} placeholder="Ib street orogun ibadan" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={profileData.residentialAddress} onChange={handleProfileInputChange}></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="about-me" className="block text-sm font-medium text-gray-700 mb-1">About me</label>
                                            <textarea name="aboutMe" id="about-me" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={profileData.aboutMe} onChange={handleProfileInputChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex justify-start">
                                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}
                        {activeTab === 'content-password' && (
                            <div id="content-password" className="content-section p-4 sm:p-6 lg:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
                                    <form onSubmit={handlePasswordSave} className="space-y-6">
                                        <div>
                                            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
                                            <input 
                                                type="password" 
                                                name="oldPassword" 
                                                id="old-password" 
                                                value={passwordData.oldPassword}
                                                onChange={handlePasswordInputChange}
                                                required 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                                placeholder="Ingresa tu contraseña actual" 
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                                            <input 
                                                type="password" 
                                                name="newPassword" 
                                                id="new-password" 
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordInputChange}
                                                required 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                                placeholder="Ingresa tu nueva contraseña" 
                                            />
                                            <div className="mt-2 flex space-x-1">
                                                {/* Indicador de fortaleza de contraseña (visual, sin lógica real aquí) */}
                                                <div className="h-1.5 flex-1 bg-gray-200 rounded-full">
                                                    <div className={`h-1.5 rounded-full ${passwordData.newPassword.length > 0 ? (passwordData.newPassword.length < 6 ? 'bg-red-500 w-1/3' : (passwordData.newPassword.length < 10 ? 'bg-yellow-500 w-2/3' : 'bg-green-500 w-full')) : ''}`}></div>
                                                </div>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.</p>
                                        </div>

                                        <div>
                                            <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
                                            <input 
                                                type="password" 
                                                name="confirmNewPassword" 
                                                id="confirm-new-password" 
                                                value={passwordData.confirmNewPassword}
                                                onChange={handlePasswordInputChange}
                                                required 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                                placeholder="Confirma tu nueva contraseña" 
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                                                Cambiar Contraseña
                                            </button>
                                        </div>
                                    </form>

                                    <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                                        <div>
                                            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                                ¿Olvidaste tu contraseña? Recuperar contraseña
                                            </a>
                                        </div>
                                        <div>
                                            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline">
                                                Ayuda y Soporte
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'content-notifications' && (
                            <div id="content-notifications" className="content-section p-4 sm:p-6 lg:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8">Configuración de Notificaciones</h2>
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Preferencias Generales</h3>
                                        {[
                                            { key: 'priceLimit', label: 'Notificación de límite de precio', desc: 'Recibe alertas cuando los precios alcancen tus límites.' },
                                            { key: 'newReport', label: 'Aviso de nuevo reporte', desc: 'Infórmate cuando haya nuevos reportes disponibles.' },
                                            { key: 'importantNews', label: 'Aviso de Noticias importantes', desc: 'Mantente al día con noticias cruciales.' },
                                            { key: 'events', label: 'Aviso de Eventos', desc: 'No te pierdas los próximos eventos.' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                                    <p className="text-xs text-gray-500">{item.desc}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-button-active' : 'toggle-button-inactive'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                    role="switch"
                                                    aria-checked={notifications[item.key as keyof typeof notifications]}
                                                    onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                                                >
                                                    <span className="sr-only">{item.label}</span>
                                                    <span aria-hidden="true" className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-knob-active' : 'toggle-knob-inactive'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                                                </button>
                                            </div>
                                        ))}
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 pt-6">Canales de Notificación</h3>
                                        {[
                                            { key: 'appNotifications', label: 'Notificaciones de aplicación' },
                                            { key: 'emailNotifications', label: 'Notificaciones de correo' },
                                            { key: 'browserNotifications', label: 'Notificaciones de navegador' },
                                        ].map(item => (
                                            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                                <button
                                                    type="button"
                                                    className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-button-active' : 'toggle-button-inactive'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                    role="switch"
                                                    aria-checked={notifications[item.key as keyof typeof notifications]}
                                                    onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                                                >
                                                    <span className="sr-only">{item.label}</span>
                                                    <span aria-hidden="true" className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-knob-active' : 'toggle-knob-inactive'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                                                </button>
                                            </div>
                                        ))}
                                        <div className="pt-8 mt-8 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-700 mb-6">Sincronizar con aplicaciones personales</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {[
                                                    { key: 'googleSync', label: 'Google', icon: <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg> },
                                                    { key: 'linkedinSync', label: 'LinkedIn', icon: <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> },
                                                    { key: 'facebookSync', label: 'Facebook', icon: <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg> },
                                                ].map(item => (
                                                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            {item.icon}
                                                            <span className="text-sm font-medium text-gray-900">{item.label}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-button-active' : 'toggle-button-inactive'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                                                            role="switch"
                                                            aria-checked={notifications[item.key as keyof typeof notifications]}
                                                            onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                                                        >
                                                            <span className="sr-only">Sincronizar {item.label}</span>
                                                            <span aria-hidden="true" className={`${notifications[item.key as keyof typeof notifications] ? 'toggle-knob-active' : 'toggle-knob-inactive'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex justify-start">
                                            <button 
                                                type="button" 
                                                onClick={handleNotificationSettingsSave}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
                                            >
                                                Save Notification Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'content-verification' && (
                            <div id="content-verification" className="content-section p-4 sm:p-6 lg:p-8">
                                <div className="mb-6">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8">Verificación de Cuenta</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Columna Izquierda: Información y Carga de Documento */}
                                        <div className="md:col-span-2 space-y-6">
                                            <div>
                                                <label htmlFor="verification-id-number" className="block text-sm font-medium text-gray-700 mb-1">Número de Identificación</label>
                                                <input type="text" name="verification-id-number" id="verification-id-number" value={profileData.idNumber || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" />
                                            </div>
                                            <div>
                                                <label htmlFor="verification-birth-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                                                <input type="text" name="verification-birth-date" id="verification-birth-date" value={profileData.birthDate || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" />
                                            </div>
                                            <div>
                                                <label htmlFor="verification-expedition-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Expedición</label>
                                                <input type="text" name="verification-expedition-date" id="verification-expedition-date" value={profileData.idExpeditionDate || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" />
                                            </div>

                                            <div className="pt-6">
                                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Verificar Documento</h3>
                                                <div className="w-full h-48 sm:h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                                                    <div className="text-center">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <p className="mt-2 text-sm text-gray-600">Vista previa del documento</p>
                                                        <p className="text-xs text-gray-500">Sube una imagen clara de tu documento.</p>
                                                    </div>
                                                </div>
                                                <button type="button" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm">
                                                    Cargar Documento
                                                </button>
                                                <p className="mt-2 text-xs text-gray-500">Estado: <span className="font-semibold text-yellow-600">Documento no cargado</span></p>
                                            </div>
                                        </div>

                                        {/* Columna Derecha: Acciones de Verificación Puntuales */}
                                        <div className="md:col-span-1 space-y-4">
                                            <button type="button" className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                                <svg className="w-5 h-5 mr-2 -ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Correo Verificado
                                            </button>
                                            <button type="button" className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                Verificar Teléfono
                                            </button>
                                            <button type="button" className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                Verificar Método de Pago
                                            </button>
                                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                <h4 className="text-sm font-semibold text-blue-700 mb-1">¿Por qué verificar?</h4>
                                                <p className="text-xs text-blue-600">La verificación ayuda a mantener tu cuenta segura y nos permite ofrecerte todos nuestros servicios.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsPage;
