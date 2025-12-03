import React, { useState, useEffect, useRef } from 'react';
import './UserProfilePage.css';
import { Camera, Loader2, Save, X, Edit3 } from 'lucide-react';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfileImage,
  deleteProfileImage,
  UserProfile, 
  UserProfileUpdate,
  GenderEnum,
  getGenderLabel,
  GENDER_LABELS
} from '../../services/userService';

const UserProfilePage: React.FC = () => {
  // Estado del perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de edición
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileUpdate>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Estado de imagen
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar perfil al montar
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Iniciar edición
  const handleStartEdit = () => {
    if (!profile) return;
    setEditedProfile({
      first_name: profile.first_name,
      last_name: profile.last_name,
      birth_date: profile.birth_date,
      gender: profile.gender,
      mobile: profile.mobile,
      country: profile.country,
      identification_number: profile.identification_number,
      bio: profile.bio,
    });
    setIsEditing(true);
    setSaveError(null);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({});
    setSaveError(null);
  };

  // Guardar cambios
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      const updatedProfile = await updateUserProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
      setEditedProfile({});
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en los campos
  const handleFieldChange = (field: keyof UserProfileUpdate, value: string | null) => {
    setEditedProfile(prev => ({ ...prev, [field]: value || null }));
  };

  // Subir imagen de perfil
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setImageError('Formato no permitido. Usa JPG, PNG, GIF o WEBP');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('La imagen debe ser menor a 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setImageError(null);
      await uploadProfileImage(file);
      // Recargar perfil para obtener nueva URL
      await loadProfile();
      // Recargar avatar en el navbar
      if ((window as any).reloadUserAvatar) {
        (window as any).reloadUserAvatar();
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Error al subir imagen');
    } finally {
      setUploadingImage(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Eliminar imagen de perfil
  const handleDeleteImage = async () => {
    if (!confirm('¿Estás seguro de eliminar tu foto de perfil?')) return;
    
    try {
      setUploadingImage(true);
      setImageError(null);
      await deleteProfileImage();
      await loadProfile();
      // Recargar avatar en el navbar
      if ((window as any).reloadUserAvatar) {
        (window as any).reloadUserAvatar();
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Error al eliminar imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'No especificado';
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sky-600 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadProfile}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-slate-50 min-h-screen flex items-start justify-center py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="profile-card p-6 sm:p-8 min-h-[80vh] w-full max-w-4xl">
        
        {/* Botón de edición */}
        <div className="flex justify-end mb-4">
          {!isEditing ? (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {saveError}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start">
          {/* Columna de la Imagen */}
          <div className="mb-6 sm:mb-0 sm:mr-8 flex-shrink-0 relative">
            <div className="relative group">
              <img 
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-sky-100"
                src={profile.profile_image_url || 'https://api.dicebear.com/7.x/initials/svg?seed=' + (profile.first_name?.[0] || 'U')}
                alt="Foto de Perfil"
              />
              
              {/* Overlay para cambiar imagen */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                {uploadingImage ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
              
              {/* Input file oculto */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            {/* Botones de imagen */}
            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="text-xs text-sky-600 hover:text-sky-800 disabled:opacity-50"
              >
                Cambiar foto
              </button>
              {profile.profile_image_url && !profile.profile_image_url.includes('dicebear') && (
                <button
                  onClick={handleDeleteImage}
                  disabled={uploadingImage}
                  className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
            </div>
            
            {imageError && (
              <p className="text-xs text-red-600 text-center mt-2">{imageError}</p>
            )}
          </div>
          
          {/* Columna de Contenido Principal */}
          <div className="flex-grow w-full">
            <h1 className="text-3xl sm:text-4xl font-bold text-sky-700 mb-6 text-center sm:text-left">
              Perfil de Usuario
            </h1>

            {/* Información Personal en dos columnas */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-8">
              {/* Nombre */}
              <div>
                <label className="info-label block text-base">Nombre:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.first_name || ''}
                    onChange={(e) => handleFieldChange('first_name', e.target.value)}
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                ) : (
                  <p className="info-value text-base">{profile.first_name || 'No especificado'}</p>
                )}
              </div>
              
              {/* Apellidos */}
              <div>
                <label className="info-label block text-base">Apellidos:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.last_name || ''}
                    onChange={(e) => handleFieldChange('last_name', e.target.value)}
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                ) : (
                  <p className="info-value text-base">{profile.last_name || 'No especificado'}</p>
                )}
              </div>
              
              {/* Email (no editable) */}
              <div>
                <label className="info-label block text-base">Email:</label>
                <p className="info-value text-base">{profile.email}</p>
              </div>
              
              {/* Móvil */}
              <div>
                <label className="info-label block text-base">Móvil:</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.mobile || ''}
                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                    placeholder="+57 300 123 4567"
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                ) : (
                  <p className="info-value text-base">{profile.mobile || 'No especificado'}</p>
                )}
              </div>
              
              {/* Género */}
              <div>
                <label className="info-label block text-base">Género:</label>
                {isEditing ? (
                  <select
                    value={editedProfile.gender || ''}
                    onChange={(e) => handleFieldChange('gender', e.target.value as GenderEnum || null)}
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none cursor-pointer"
                  >
                    <option value="">Seleccionar...</option>
                    {Object.entries(GENDER_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <p className="info-value text-base">{getGenderLabel(profile.gender)}</p>
                )}
              </div>
              
              {/* País */}
              <div>
                <label className="info-label block text-base">País:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.country || ''}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    placeholder="Colombia"
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                ) : (
                  <p className="info-value text-base">{profile.country || 'No especificado'}</p>
                )}
              </div>
              
              {/* Fecha de nacimiento */}
              <div>
                <label className="info-label block text-base">Fecha de Nacimiento:</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile.birth_date || ''}
                    onChange={(e) => handleFieldChange('birth_date', e.target.value)}
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none cursor-pointer"
                  />
                ) : (
                  <p className="info-value text-base">{formatDate(profile.birth_date)}</p>
                )}
              </div>
              
              {/* ID */}
              <div>
                <label className="info-label block text-base">ID (Número de Identificación):</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.identification_number || ''}
                    onChange={(e) => handleFieldChange('identification_number', e.target.value)}
                    placeholder="1020XXXXXX"
                    className="info-value text-base w-full focus:ring-2 focus:ring-sky-300 focus:outline-none"
                  />
                ) : (
                  <p className="info-value text-base">{profile.identification_number || 'No especificado'}</p>
                )}
              </div>
            </div>

            {/* Sección "Acerca de mí" */}
            <div>
              <label className="info-label block text-base mb-2">Acerca de mí:</label>
              {isEditing ? (
                <textarea
                  value={editedProfile.bio || ''}
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  rows={6}
                  maxLength={1000}
                  placeholder="Cuéntanos sobre ti..."
                  className="info-value text-base w-full min-h-48 focus:ring-2 focus:ring-sky-300 focus:outline-none resize-none"
                />
              ) : (
                <p className="info-value text-base leading-relaxed min-h-48 text-left whitespace-pre-wrap">
                  {profile.bio || 'No has agregado información sobre ti todavía.'}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {(editedProfile.bio || '').length}/1000 caracteres
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;