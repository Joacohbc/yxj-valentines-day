import React, { useState, useEffect } from 'react';
import { defaultGameConfig } from '../GameConfig';

export default function AdminConfig({ onSave, onClose, currentConfig }) {
    const [configJson, setConfigJson] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Pretty print JSON
        setConfigJson(JSON.stringify(currentConfig || defaultGameConfig, null, 2));
    }, [currentConfig]);

    const handleSave = () => {
        try {
            const parsed = JSON.parse(configJson);
            // Basic validation
            if (!parsed.challenges || !Array.isArray(parsed.challenges)) {
                throw new Error("Invalid config: 'challenges' must be an array.");
            }
            if (!parsed.totalLives) {
                 parsed.totalLives = parsed.challenges.length;
            }
            // Ensure consistency
            if (parsed.totalLives !== parsed.challenges.length) {
                 // Warn or adjust? Let's just adjust totalLives
                 parsed.totalLives = parsed.challenges.length;
            }

            onSave(parsed);
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg w-full max-w-3xl h-[80vh] flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-rose-600">Configuración del Juego</h2>
                <p className="mb-2 text-sm text-gray-600">Edita el JSON para personalizar vidas y retos.</p>

                <div className="flex-grow mb-4 relative">
                     <textarea
                        className="w-full h-full border border-gray-300 p-2 rounded font-mono text-sm resize-none focus:outline-none focus:border-rose-500"
                        value={configJson}
                        onChange={(e) => setConfigJson(e.target.value)}
                     />
                     {error && (
                         <div className="absolute bottom-2 left-2 right-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                             Error: {error}
                         </div>
                     )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Guardar y Reiniciar
                    </button>
                </div>
            </div>
        </div>
    );
}
