import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faExpand } from '@fortawesome/free-solid-svg-icons';
import ActionButton from './ui/ActionButton';

const ResizeModal = ({ onClose, onConfirm }) => {
    const [widthPct, setWidthPct] = useState(50);
    const [heightPct, setHeightPct] = useState(50);
    const [maintainRatio, setMaintainRatio] = useState(true);

    const handleWidthChange = (e) => {
        const val = Number(e.target.value);
        setWidthPct(val);
        if (maintainRatio) setHeightPct(val);
    };

    const handleHeightChange = (e) => {
        const val = Number(e.target.value);
        setHeightPct(val);
        if (maintainRatio) setWidthPct(val);
    };

    const handleConfirm = () => {
        onConfirm(widthPct, heightPct);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faExpand} className="text-brand-yellow" />
                        Redimensionner
                    </h3>
                    <button className="text-gray-500 hover:text-white" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="flex flex-col gap-6">

                    <label className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                        <input
                            type="checkbox"
                            checked={maintainRatio}
                            onChange={(e) => setMaintainRatio(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-600 accent-brand-yellow"
                        />
                        <span className="text-sm text-gray-300">Garder les proportions</span>
                    </label>

                    {/* Width */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <label className="text-gray-400">Largeur (%)</label>
                            <input
                                type="number" min="1" max="200"
                                value={widthPct}
                                onChange={handleWidthChange}
                                className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-right text-white focus:border-brand-yellow outline-none text-xs"
                            />
                        </div>
                        <input
                            type="range" min="1" max="200"
                            value={widthPct}
                            onChange={handleWidthChange}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                        />
                    </div>

                    {/* Height */}
                    <div className={`space-y-2 transition-opacity ${maintainRatio ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex justify-between text-sm">
                            <label className="text-gray-400">Hauteur (%)</label>
                            <input
                                type="number" min="1" max="200"
                                value={heightPct}
                                onChange={handleHeightChange}
                                className="w-16 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-right text-white focus:border-brand-yellow outline-none text-xs"
                            />
                        </div>
                        <input
                            type="range" min="1" max="200"
                            value={heightPct}
                            onChange={handleHeightChange}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                        />
                    </div>

                </div>

                <div className="flex gap-3 mt-8">
                    <ActionButton variant="primary" onClick={handleConfirm} className="flex-1 justify-center py-2">
                        Appliquer
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={onClose} className="flex-1 justify-center py-2">
                        Annuler
                    </ActionButton>
                </div>

            </div>
        </div>
    );
};

export default ResizeModal;
