import React, { useState, useEffect, useRef } from 'react';
import { searchAssets, getAssetProfile, SearchResult, AssetProfile, formatPrice, formatChangePercent } from '../../services/yahooService';
import { createPortfolioAsset } from '../../services/assetsService';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetAdded?: () => void;
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose, onAssetAdded }) => {
  // Estados de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados del activo seleccionado
  const [selectedAsset, setSelectedAsset] = useState<AssetProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Estados del formulario
  const [quantity, setQuantity] = useState<string>('');
  const [acquisitionPrice, setAcquisitionPrice] = useState<string>('');
  const [acquisitionDate, setAcquisitionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Reset al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSearchResults([]);
      setShowDropdown(false);
      setSelectedAsset(null);
      setQuantity('');
      setAcquisitionPrice('');
      setAcquisitionDate(new Date().toISOString().split('T')[0]);
      setError(null);
    }
  }, [isOpen]);

  // Búsqueda con debounce
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchAssets(searchTerm);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error buscando:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  // Click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Seleccionar activo
  const handleSelectAsset = async (result: SearchResult) => {
    setIsLoadingProfile(true);
    setError(null);
    setShowDropdown(false);
    setSearchTerm('');

    try {
      const profile = await getAssetProfile(result.symbol);
      setSelectedAsset(profile);
      // Auto-rellenar precio de adquisición con precio actual
      setAcquisitionPrice(profile.price.toFixed(2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener información del activo');
      setSelectedAsset(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Quitar activo seleccionado
  const handleRemoveSelected = () => {
    setSelectedAsset(null);
    setQuantity('');
    setAcquisitionPrice('');
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  // Guardar activo
  const handleSave = async () => {
    if (!selectedAsset) {
      setError('Selecciona un activo');
      return;
    }

    const qty = parseFloat(quantity);
    const price = parseFloat(acquisitionPrice);

    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (!acquisitionDate) {
      setError('Selecciona una fecha de adquisición');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createPortfolioAsset({
        asset_symbol: selectedAsset.symbol,
        quantity: qty,
        acquisition_price: price,
        acquisition_date: acquisitionDate,
      });

      // Notificar éxito y cerrar
      onAssetAdded?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el activo');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Añadir Activo al Portafolio</h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Mensaje de error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Buscador de activos */}
          {!selectedAsset && (
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar Activo
              </label>
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar por símbolo o nombre (ej: AAPL, Tesla)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Dropdown de resultados */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.length === 0 && !isSearching && searchTerm.length >= 2 && (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron resultados para "{searchTerm}"
                    </div>
                  )}
                  
                  {searchResults.map((result) => (
                    <button
                      key={`${result.symbol}-${result.exchange}`}
                      onClick={() => handleSelectAsset(result)}
                      className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-500">
                            {result.symbol} • {result.exchangeShortName}
                          </div>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {result.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Loading profile */}
          {isLoadingProfile && (
            <div className="text-center py-8">
              <svg className="w-8 h-8 mx-auto text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-2 text-gray-500">Cargando información del activo...</p>
            </div>
          )}

          {/* Activo seleccionado */}
          {selectedAsset && !isLoadingProfile && (
            <>
              {/* Tarjeta del activo */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedAsset.companyName}</h4>
                    <p className="text-sm text-gray-500">{selectedAsset.symbol} • {selectedAsset.exchangeShortName}</p>
                  </div>
                  <button
                    onClick={handleRemoveSelected}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    title="Cambiar activo"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(selectedAsset.price, selectedAsset.currency)}
                  </span>
                  <span className={`text-sm font-medium ${selectedAsset.changes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatChangePercent(selectedAsset.changesPercentage)}
                  </span>
                </div>
              </div>

              {/* Formulario */}
              <div className="space-y-4">
                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad de Unidades
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ej: 10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  />
                </div>

                {/* Precio de adquisición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio de Adquisición ({selectedAsset.currency})
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Ej: 150.00"
                    value={acquisitionPrice}
                    onChange={(e) => setAcquisitionPrice(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Precio actual: {formatPrice(selectedAsset.price, selectedAsset.currency)}
                  </p>
                </div>

                {/* Fecha de adquisición */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Adquisición
                  </label>
                  <input
                    type="date"
                    max={maxDate}
                    value={acquisitionDate}
                    onChange={(e) => setAcquisitionDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                  />
                </div>

                {/* Resumen */}
                {quantity && acquisitionPrice && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Total inversión:</strong>{' '}
                      {formatPrice(parseFloat(quantity) * parseFloat(acquisitionPrice), selectedAsset.currency)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedAsset || isSaving || !quantity || !acquisitionPrice}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Añadir Activo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;
