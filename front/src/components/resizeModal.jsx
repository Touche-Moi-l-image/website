import React, { useState } from 'react';

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
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <div className="modal-body">
                    <h3>Redimensionner</h3>

                    <div className="resize-controls" style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '20px 0' }}>

                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={maintainRatio}
                                onChange={(e) => setMaintainRatio(e.target.checked)}
                            />
                            <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Garder les proportions</span>
                        </label>

                        <div className="input-group">
                            <label>Largeur (%)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="range" min="1" max="200"
                                    value={widthPct}
                                    onChange={handleWidthChange}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number" min="1" max="200"
                                    value={widthPct}
                                    onChange={handleWidthChange}
                                    style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: 'white' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ opacity: maintainRatio ? 0.5 : 1, pointerEvents: maintainRatio ? 'none' : 'auto' }}>
                            <label>Hauteur (%)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="range" min="1" max="200"
                                    value={heightPct}
                                    onChange={handleHeightChange}
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number" min="1" max="200"
                                    value={heightPct}
                                    onChange={handleHeightChange}
                                    style={{ width: '60px', padding: '5px', borderRadius: '4px', border: '1px solid #555', background: '#333', color: 'white' }}
                                />
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <button className="apply-drawing-btn" onClick={handleConfirm}>Appliquer</button>
                        <button className="cancel-drawing-btn" onClick={onClose}>Annuler</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResizeModal;
