import React, { useState, useEffect, useRef } from 'react';
import { 
    getUserProfile, 
    updateUserProfile, 
    getUserAvatar,
    uploadProfileImage,
    deleteProfileImage,
    changePassword,
    UserProfile, 
    UserProfileUpdate,
    GenderEnum,
    PasswordChangeRequest
} from '../../services/userService';
import './AccountSettingsPage.css';

// ============================================================
// Componentes de íconos
// ============================================================

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    </div>
);

// ============================================================
// Tipos
// ============================================================

type ActiveTab = 'profile' | 'password' | 'notifications' | 'verification';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender: GenderEnum | '';
    idNumber: string;
    taxIdNumber: string;
    taxIdCountry: string;
    residentialAddress: string;
    aboutMe: string;
}

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// ============================================================
// Componente Principal
// ============================================================

const AccountSettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    // Estado del perfil
    const [avatarUrl, setAvatarUrl] = useState<string>('https://via.placeholder.com/150');
    const [isDefaultAvatar, setIsDefaultAvatar] = useState(true);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        mobileNumber: '',
        gender: '',
        idNumber: '',
        taxIdNumber: '',
        taxIdCountry: '',
        residentialAddress: '',
        aboutMe: '',
    });

    // Estado del cambio de contraseña
    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    // ============================================================
    // Cargar datos del perfil
    // ============================================================

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [profile, avatar] = await Promise.all([
                getUserProfile(),
                getUserAvatar()
            ]);
            
            setFormData({
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                email: profile.email || '',
                mobileNumber: profile.mobile || '',
                gender: (profile.gender as GenderEnum) || '',
                idNumber: profile.identification_number || '',
                taxIdNumber: profile.tax_id_number || '',
                taxIdCountry: profile.tax_id_country || '',
                residentialAddress: profile.residential_address || '',
                aboutMe: profile.bio || '',
            });
            
            setAvatarUrl(avatar.avatar_url);
            setIsDefaultAvatar(avatar.is_default);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
        } finally {
            setLoading(false);
        }
    };

    // ============================================================
    // Handlers del formulario de perfil
    // ============================================================

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, gender: e.target.value as GenderEnum }));
    };

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const updateData: UserProfileUpdate = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                mobile: formData.mobileNumber || null,
                gender: formData.gender as GenderEnum || null,
                bio: formData.aboutMe || null,
                tax_id_number: formData.taxIdNumber || null,
                tax_id_country: formData.taxIdCountry || null,
                residential_address: formData.residentialAddress || null,
            };
            
            await updateUserProfile(updateData);
            setSuccessMessage('Perfil actualizado correctamente');
            
            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el perfil');
        } finally {
            setSaving(false);
        }
    };

    // ============================================================
    // Handlers de imagen de perfil
    // ============================================================

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError('Solo se permiten imágenes JPG, PNG, GIF o WEBP');
            return;
        }

        // Validar tamaño (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('La imagen no puede superar los 5MB');
            return;
        }

        setUploadingImage(true);
        setError(null);

        try {
            await uploadProfileImage(file);
            
            // Recargar avatar
            const avatar = await getUserAvatar();
            setAvatarUrl(avatar.avatar_url);
            setIsDefaultAvatar(avatar.is_default);
            
            setSuccessMessage('Imagen de perfil actualizada');
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Actualizar navbar
            if (typeof (window as any).reloadUserAvatar === 'function') {
                (window as any).reloadUserAvatar();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al subir la imagen');
        } finally {
            setUploadingImage(false);
            // Limpiar input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteAvatar = async () => {
        if (isDefaultAvatar) return;
        
        if (!confirm('¿Estás seguro de eliminar tu imagen de perfil?')) return;
        
        setUploadingImage(true);
        setError(null);
        
        try {
            await deleteProfileImage();
            
            // Recargar avatar
            const avatar = await getUserAvatar();
            setAvatarUrl(avatar.avatar_url);
            setIsDefaultAvatar(avatar.is_default);
            
            setSuccessMessage('Imagen de perfil eliminada');
            setTimeout(() => setSuccessMessage(null), 3000);
            
            // Actualizar navbar
            if (typeof (window as any).reloadUserAvatar === 'function') {
                (window as any).reloadUserAvatar();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la imagen');
        } finally {
            setUploadingImage(false);
        }
    };

    // ============================================================
    // Handlers de cambio de contraseña
    // ============================================================

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordError(null);
    };

    const getPasswordStrength = (password: string): { width: string; color: string; text: string } => {
        if (!password) return { width: '0%', color: 'bg-gray-200', text: '' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return { width: '33%', color: 'bg-red-500', text: 'Débil' };
        if (score <= 4) return { width: '66%', color: 'bg-yellow-500', text: 'Media' };
        return { width: '100%', color: 'bg-green-500', text: 'Fuerte' };
    };

    const handlePasswordSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        // Validaciones
        if (!passwordForm.currentPassword) {
            setPasswordError('Ingresa tu contraseña actual');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Las contraseñas nuevas no coinciden');
            return;
        }

        if (passwordForm.currentPassword === passwordForm.newPassword) {
            setPasswordError('La nueva contraseña debe ser diferente a la actual');
            return;
        }

        setChangingPassword(true);

        try {
            const data: PasswordChangeRequest = {
                current_password: passwordForm.currentPassword,
                new_password: passwordForm.newPassword,
                confirm_password: passwordForm.confirmPassword,
            };
            
            await changePassword(data);
            
            setPasswordSuccess('Contraseña actualizada correctamente');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            
            setTimeout(() => setPasswordSuccess(null), 3000);
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña');
        } finally {
            setChangingPassword(false);
        }
    };

    // ============================================================
    // Render
    // ============================================================

    const passwordStrength = getPasswordStrength(passwordForm.newPassword);

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-gray-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
            
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Sidebar */}
                    <div className="w-full md:w-56 flex-shrink-0 self-start">
                        <aside className="w-full bg-white rounded-lg shadow-md p-4 md:p-6 md:pb-3">
                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`sidebar-link w-full text-left ${activeTab === 'profile' ? 'active' : ''}`}
                                >
                                    <UserIcon />
                                    <span className="whitespace-nowrap">Profile Settings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`sidebar-link w-full text-left ${activeTab === 'password' ? 'active' : ''}`}
                                >
                                    <LockIcon />
                                    <span className="whitespace-nowrap">Password</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('notifications')}
                                    className={`sidebar-link w-full text-left opacity-50 cursor-not-allowed`}
                                    disabled
                                >
                                    <BellIcon />
                                    <span className="whitespace-nowrap">Notifications</span>
                                    <span className="ml-2 text-xs text-gray-400">(Próximamente)</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('verification')}
                                    className={`sidebar-link w-full text-left opacity-50 cursor-not-allowed`}
                                    disabled
                                >
                                    <CheckIcon />
                                    <span className="whitespace-nowrap">Verification</span>
                                    <span className="ml-2 text-xs text-gray-400">(Próximamente)</span>
                                </button>
                            </nav>
                        </aside>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-lg shadow-md overflow-auto">
                        {/* ======================== Profile Settings Tab ======================== */}
                        {activeTab === 'profile' && (
                            <div className="content-section p-4 sm:p-6 lg:p-8">
                                {/* Mensajes de error y éxito */}
                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                )}
                                {successMessage && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                        {successMessage}
                                    </div>
                                )}

                                {/* Avatar Section */}
                                <div className="flex flex-col sm:flex-row items-center mb-8">
                                    <div className="relative mb-4 sm:mb-0 sm:mr-6">
                                        <img 
                                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-gray-300" 
                                            src={avatarUrl} 
                                            alt="User Avatar"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                                            }}
                                        />
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <button 
                                            onClick={handleAvatarClick}
                                            disabled={uploadingImage}
                                            className="absolute bottom-0 right-0 -mb-1 -mr-1 cursor-pointer"
                                        >
                                            <span className="camera-icon">
                                                {uploadingImage ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                ) : (
                                                    <CameraIcon />
                                                )}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <p className="text-sm text-gray-500 mb-2">
                                            JPG, PNG, GIF o WEBP. Máximo 5MB.
                                        </p>
                                        {!isDefaultAvatar && (
                                            <button
                                                onClick={handleDeleteAvatar}
                                                disabled={uploadingImage}
                                                className="inline-flex items-center text-sm text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon />
                                                <span className="ml-1">Eliminar imagen</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Profile Form */}
                                <form onSubmit={handleProfileSave}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        {/* First Name */}
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="firstName" 
                                                id="firstName" 
                                                value={formData.firstName} 
                                                onChange={handleInputChange} 
                                                placeholder="First name" 
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="text" 
                                                name="lastName" 
                                                id="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleInputChange} 
                                                placeholder="Last name" 
                                                required
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            />
                                        </div>

                                        {/* Email (readonly) */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                id="email" 
                                                value={formData.email} 
                                                readOnly 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" 
                                            />
                                        </div>

                                        {/* Mobile Number */}
                                        <div>
                                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                    🇨🇴 +57
                                                </span>
                                                <input 
                                                    type="tel" 
                                                    name="mobileNumber" 
                                                    id="mobileNumber" 
                                                    value={formData.mobileNumber} 
                                                    onChange={handleInputChange} 
                                                    placeholder="300 123 4567" 
                                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 border" 
                                                />
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="md:col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <div className="mt-2 space-y-2 sm:space-y-0 sm:flex sm:space-x-6">
                                                <div className="flex items-center">
                                                    <input 
                                                        id="gender-male" 
                                                        name="gender" 
                                                        type="radio" 
                                                        value="male" 
                                                        checked={formData.gender === 'male'} 
                                                        onChange={handleGenderChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" 
                                                    />
                                                    <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-900">
                                                        Male
                                                    </label>
                                                </div>
                                                <div className="flex items-center">
                                                    <input 
                                                        id="gender-female" 
                                                        name="gender" 
                                                        type="radio" 
                                                        value="female" 
                                                        checked={formData.gender === 'female'} 
                                                        onChange={handleGenderChange}
                                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" 
                                                    />
                                                    <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-900">
                                                        Female
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ID (readonly) */}
                                        <div>
                                            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                ID
                                            </label>
                                            <input 
                                                type="text" 
                                                name="idNumber" 
                                                id="idNumber" 
                                                value={formData.idNumber} 
                                                readOnly 
                                                placeholder="No registrado" 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm" 
                                            />
                                        </div>

                                        {/* Tax ID Number */}
                                        <div>
                                            <label htmlFor="taxIdNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tax Identification Number
                                            </label>
                                            <input 
                                                type="text" 
                                                name="taxIdNumber" 
                                                id="taxIdNumber" 
                                                value={formData.taxIdNumber} 
                                                onChange={handleInputChange} 
                                                placeholder="NIT o número fiscal" 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            />
                                        </div>

                                        {/* Tax ID Country */}
                                        <div>
                                            <label htmlFor="taxIdCountry" className="block text-sm font-medium text-gray-700 mb-1">
                                                Tax Identification Country
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                    🌍
                                                </span>
                                                <input 
                                                    type="text" 
                                                    name="taxIdCountry" 
                                                    id="taxIdCountry" 
                                                    value={formData.taxIdCountry} 
                                                    onChange={handleInputChange} 
                                                    placeholder="Colombia" 
                                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 border" 
                                                />
                                            </div>
                                        </div>

                                        {/* Residential Address */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="residentialAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                                Residential Address
                                            </label>
                                            <textarea 
                                                name="residentialAddress" 
                                                id="residentialAddress" 
                                                rows={3} 
                                                value={formData.residentialAddress} 
                                                onChange={handleInputChange} 
                                                placeholder="Tu dirección residencial completa" 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            ></textarea>
                                        </div>

                                        {/* About Me */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-1">
                                                About me
                                            </label>
                                            <textarea 
                                                name="aboutMe" 
                                                id="aboutMe" 
                                                rows={4} 
                                                value={formData.aboutMe} 
                                                onChange={handleInputChange} 
                                                placeholder="Cuéntanos sobre ti..." 
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex justify-start">
                                            <button 
                                                type="submit" 
                                                disabled={saving}
                                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm flex items-center"
                                            >
                                                {saving ? (
                                                    <>
                                                        <LoadingSpinner />
                                                        <span className="ml-2">Guardando...</span>
                                                    </>
                                                ) : (
                                                    'Save Changes'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* ======================== Password Tab ======================== */}
                        {activeTab === 'password' && (
                            <div className="content-section p-4 sm:p-6 lg:p-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Cambiar Contraseña</h2>
                                
                                {/* Mensajes */}
                                {passwordError && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {passwordError}
                                    </div>
                                )}
                                {passwordSuccess && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                        {passwordSuccess}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordSave} className="space-y-6 max-w-md">
                                    {/* Current Password */}
                                    <div>
                                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Contraseña Actual
                                        </label>
                                        <input 
                                            type="password" 
                                            name="currentPassword" 
                                            id="currentPassword" 
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordInputChange}
                                            required 
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            placeholder="Ingresa tu contraseña actual" 
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nueva Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            name="newPassword" 
                                            id="newPassword" 
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordInputChange}
                                            required 
                                            minLength={8}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            placeholder="Ingresa tu nueva contraseña" 
                                        />
                                        {/* Password Strength Indicator */}
                                        {passwordForm.newPassword && (
                                            <div className="mt-2">
                                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                                        style={{ width: passwordStrength.width }}
                                                    ></div>
                                                </div>
                                                <p className={`mt-1 text-xs ${
                                                    passwordStrength.text === 'Débil' ? 'text-red-500' :
                                                    passwordStrength.text === 'Media' ? 'text-yellow-600' :
                                                    'text-green-500'
                                                }`}>
                                                    Fortaleza: {passwordStrength.text}
                                                </p>
                                            </div>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirmar Nueva Contraseña
                                        </label>
                                        <input 
                                            type="password" 
                                            name="confirmPassword" 
                                            id="confirmPassword" 
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordInputChange}
                                            required 
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                                            placeholder="Confirma tu nueva contraseña" 
                                        />
                                        {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                                            <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <button 
                                            type="submit" 
                                            disabled={changingPassword}
                                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm flex items-center justify-center"
                                        >
                                            {changingPassword ? (
                                                <>
                                                    <LoadingSpinner />
                                                    <span className="ml-2">Cambiando...</span>
                                                </>
                                            ) : (
                                                'Cambiar Contraseña'
                                            )}
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
                        )}

                        {/* ======================== Coming Soon Tabs ======================== */}
                        {(activeTab === 'notifications' || activeTab === 'verification') && (
                            <div className="content-section p-4 sm:p-6 lg:p-8">
                                <div className="text-center py-12">
                                    <div className="mb-4">
                                        {activeTab === 'notifications' ? <BellIcon /> : <CheckIcon />}
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                        {activeTab === 'notifications' ? 'Notificaciones' : 'Verificación'}
                                    </h2>
                                    <p className="text-gray-500">
                                        Esta funcionalidad estará disponible próximamente.
                                    </p>
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
