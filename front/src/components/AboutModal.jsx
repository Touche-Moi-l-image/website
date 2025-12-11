import React, { useEffect } from 'react';

function AboutModal({ onClose }) {
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
                <h2>À propos de nous</h2>
                <div className="modal-body">
                    <p className="highlight">Touche Moi l'Image v1.0</p>
                    <p>
                        Une application simple et puissante pour retoucher vos photos en un clin d'œil.
                        Développée avec passion par une équipe de développeurs dévoués.
                    </p>
                    <h3>L'équipe</h3>
                    <ul className="team-list">
                        <li>
                            <span className="dev-icon">🎨</span>
                            <strong>Caro & Lucas :</strong> Frontend, SonarCube, Rapports & Design
                        </li>
                        <li>
                            <span className="dev-icon">⚙️</span>
                            <strong>Quentin :</strong> Backend & Routes API
                        </li>
                    </ul>
                    <p className="footer-note">© 2025 Touche Moi l'Image. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    );
}

export default AboutModal;
