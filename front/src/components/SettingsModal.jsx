import React, { useEffect } from 'react';

function SettingsModal({ onClose }) {
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Paramètres</h2>

                <div className="modal-body settings-body">

                    <div className="setting-item">
                        <label>Langue</label>
                        <select defaultValue="fr">
                            <option value="fr">Français</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <label>Thème</label>
                        <div className="toggle-wrapper">
                            <span>Sombre</span>
                            <label className="switch">
                                <input type="checkbox" defaultChecked />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <label>Mode Expert</label>
                        <div className="toggle-wrapper">
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>

                    <hr className="divider" style={{ width: '100%', margin: '1.5rem 0' }} />

                    <button className="reset-btn">Réinitialiser les préférences</button>

                    <p className="footer-note">Version 1.0.0</p>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
