import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faShareAlt, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ActionsFeedback: React.FC = () => {
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [showThanks, setShowThanks] = useState(false);

  const handleDownload = () => {
    console.log("Simulación: Iniciar descarga del reporte...");
    alert("Simulación: Descarga iniciada (acción no funcional).");
  };

  const handleShare = () => {
    console.log("Simulación: Abrir opciones para compartir...");
    alert("Simulación: Compartir activado (acción no funcional).");
  };

  const handleFeedback = (feedbackType: 'positive' | 'negative') => {
    setSelectedFeedback(feedbackType);
    setShowComment(true);
    setShowThanks(false); // Ocultar agradecimiento si se cambia el feedback
    console.log(`Feedback seleccionado: ${feedbackType}`);
    // Simular envío de feedback básico
    // sendFeedbackToBackend(feedbackType, null);
    console.log("Simulación: Feedback básico enviado.");
    setShowThanks(true); // Mostrar agradecimiento inmediato
  };

  const handleSendComment = () => {
    if (!selectedFeedback) {
      alert("Por favor, selecciona primero si el análisis fue útil o no (👍/👎).");
      return;
    }
    console.log(`Simulación: Enviando feedback (${selectedFeedback}) con comentario: "${comment}"`);
    // sendFeedbackToBackend(selectedFeedback, comment);
    setComment('');
    // setShowComment(false); // Opcional: ocultar comentarios después de enviar
    setShowThanks(true); // Asegurar que se muestre el agradecimiento
  };

  // Placeholder para la función de envío real
  // const sendFeedbackToBackend = (feedbackType, comment) => { ... }

  return (
    <div className="space-y-4">
      {/* Botones de Acción */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded shadow-sm transition duration-150 ease-in-out"
        >
          <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
          Descargar
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-medium rounded shadow-sm transition duration-150 ease-in-out"
        >
          <FontAwesomeIcon icon={faShareAlt} className="mr-1.5" />
          Compartir
        </button>
      </div>

      {/* Separador */}
      <hr className="my-3" />

      {/* Sección de Feedback */}
      <div className="text-center">
        <div className="flex justify-center gap-3 mb-3">
          <button
            onClick={() => handleFeedback('positive')}
            className={`inline-flex items-center justify-center w-10 h-10 border rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1
              ${selectedFeedback === 'positive'
                ? 'bg-green-500 text-white border-green-600 focus:ring-green-400'
                : 'border-gray-300 text-gray-500 hover:bg-green-50 hover:text-green-600 focus:ring-green-400'}`}
          >
            <FontAwesomeIcon icon={faThumbsUp} className="text-lg" />
          </button>
          <button
            onClick={() => handleFeedback('negative')}
            className={`inline-flex items-center justify-center w-10 h-10 border rounded-full transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1
              ${selectedFeedback === 'negative'
                ? 'bg-red-500 text-white border-red-600 focus:ring-red-400'
                : 'border-gray-300 text-gray-500 hover:bg-red-50 hover:text-red-600 focus:ring-red-400'}`}
          >
            <FontAwesomeIcon icon={faThumbsDown} className="text-lg" />
          </button>
        </div>

        {/* Área de Comentario */}
        {showComment && (
          <div className="mt-3 transition-opacity duration-300 ease-in-out opacity-100">
            <label htmlFor="feedbackComment" className="block text-xs font-medium text-gray-700 mb-1">Comentario (opcional):</label>
            <textarea
              id="feedbackComment"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-xs p-1.5"
              placeholder="Danos más detalles..."
            ></textarea>
            <button
              onClick={handleSendComment}
              className="mt-2 inline-flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded shadow-sm transition duration-150 ease-in-out"
            >
              Enviar Comentario
            </button>
          </div>
        )}

        {/* Mensaje de agradecimiento */}
        {showThanks && (
          <div className="mt-3 text-green-600 font-medium text-sm">
            ¡Gracias por tu feedback!
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionsFeedback;
