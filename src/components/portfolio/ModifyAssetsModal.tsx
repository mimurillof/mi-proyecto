import React, { useState, useEffect } from 'react';
import { 
  listPortfolioAssets, 
  updatePortfolioAsset, 
  deletePortfolioAsset, 
  PortfolioAssetDB,
  formatAssetDate,
  formatAssetPrice 
} from '../../services/assetsService';

interface ModifyAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetsModified?: () => void;
}

interface EditingAsset {
  symbol: string;
  quantity: string;
  acquisition_price: string;
  acquisition_date: string;
}

const ModifyAssetsModal: React.FC<ModifyAssetsModalProps> = ({ isOpen, onClose, onAssetsModified }) => {
  // Estados
  const [assets, setAssets] = useState<PortfolioAssetDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<EditingAsset | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar activos al abrir modal
  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  // Reset al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setEditingAsset(null);
      setDeleteConfirm(null);
      setError(null);
    }
  }, [isOpen]);

  // Cargar activos del portafolio
  const loadAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listPortfolioAssets();
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los activos');
    } finally {
      setIsLoading(false);
    }
  };

  // Iniciar edición de un activo
  const handleStartEdit = (asset: PortfolioAssetDB) => {
    setEditingAsset({
      symbol: asset.asset_symbol,
      quantity: asset.quantity.toString(),
      acquisition_price: asset.acquisition_price.toString(),
      acquisition_date: asset.acquisition_date || new Date().toISOString().split('T')[0],
    });
    setDeleteConfirm(null);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingAsset(null);
    setError(null);
  };

  // Guardar cambios
  const handleSaveEdit = async () => {
    if (!editingAsset) return;

    const qty = parseFloat(editingAsset.quantity);
    const price = parseFloat(editingAsset.acquisition_price);

    if (isNaN(qty) || qty <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    if (isNaN(price) || price <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updatePortfolioAsset(editingAsset.symbol, {
        quantity: qty,
        acquisition_price: price,
        acquisition_date: editingAsset.acquisition_date,
      });

      // Recargar activos y cerrar edición
      await loadAssets();
      setEditingAsset(null);
      onAssetsModified?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el activo');
    } finally {
      setIsSaving(false);
    }
  };

  // Confirmar eliminación
  const handleConfirmDelete = (symbol: string) => {
    setDeleteConfirm(symbol);
    setEditingAsset(null);
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Eliminar activo
  const handleDelete = async (symbol: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      await deletePortfolioAsset(symbol);
      await loadAssets();
      setDeleteConfirm(null);
      onAssetsModified?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el activo');
    } finally {
      setIsDeleting(false);
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-lg font-semibold">Modificar Activos del Portafolio</h3>
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
        <div className="p-5 overflow-y-auto flex-1">
          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <svg className="w-8 h-8 mx-auto text-gray-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="mt-2 text-gray-500">Cargando activos...</p>
            </div>
          )}

          {/* Sin activos */}
          {!isLoading && assets.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="mt-4 text-gray-500">No hay activos en tu portafolio</p>
              <p className="text-sm text-gray-400 mt-1">Usa el botón "Añadir" para agregar tu primer activo</p>
            </div>
          )}

          {/* Lista de activos */}
          {!isLoading && assets.length > 0 && (
            <div className="space-y-3">
              {assets.map((asset) => (
                <div 
                  key={asset.asset_id}
                  className={`p-4 rounded-lg border transition-all ${
                    editingAsset?.symbol === asset.asset_symbol 
                      ? 'border-blue-300 bg-blue-50' 
                      : deleteConfirm === asset.asset_symbol
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Vista de edición */}
                  {editingAsset?.symbol === asset.asset_symbol ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900">{asset.asset_symbol}</h4>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Editando</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Cantidad</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={editingAsset.quantity}
                            onChange={(e) => setEditingAsset({ ...editingAsset, quantity: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Precio Adq.</label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={editingAsset.acquisition_price}
                            onChange={(e) => setEditingAsset({ ...editingAsset, acquisition_price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fecha Adq.</label>
                          <input
                            type="date"
                            max={maxDate}
                            value={editingAsset.acquisition_date}
                            onChange={(e) => setEditingAsset({ ...editingAsset, acquisition_date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-1"
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
                            'Guardar'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : deleteConfirm === asset.asset_symbol ? (
                    /* Vista de confirmación de eliminación */
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="font-medium text-red-700">¿Eliminar {asset.asset_symbol}?</span>
                      </div>
                      <p className="text-sm text-red-600 mb-3">
                        Esta acción no se puede deshacer. Se eliminará permanentemente este activo de tu portafolio.
                      </p>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleCancelDelete}
                          disabled={isDeleting}
                          className="px-3 py-1.5 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleDelete(asset.asset_symbol)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          {isDeleting ? (
                            <>
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Eliminando...
                            </>
                          ) : (
                            'Eliminar'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Vista normal */
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{asset.asset_symbol}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                          <span>
                            <strong className="text-gray-700">{asset.quantity}</strong> unidades
                          </span>
                          <span>
                            @ <strong className="text-gray-700">{formatAssetPrice(asset.acquisition_price)}</strong>
                          </span>
                          <span>
                            Fecha: <strong className="text-gray-700">{formatAssetDate(asset.acquisition_date)}</strong>
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          Total: {formatAssetPrice(asset.quantity * asset.acquisition_price)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleStartEdit(asset)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(asset.asset_symbol)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {assets.length} activo{assets.length !== 1 ? 's' : ''} en el portafolio
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyAssetsModal;
