import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPalette, faCogs, faCode } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

function AboutModal({ onClose }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-yellow to-orange-500" />

                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">À propos de nous</h2>

                <div className="space-y-6">
                    <div>
                        <p className="text-brand-yellow font-bold text-lg mb-2">Touche Moi l'Image v1.0</p>
                        <p className="text-gray-400 leading-relaxed">
                            Une application simple et puissante pour retoucher vos photos en un clin d'œil.
                            Développée avec passion par une équipe de développeurs dévoués.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">L'équipe</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-3 bg-gray-800/50 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <FontAwesomeIcon icon={faPalette} />
                                </div>
                                <div>
                                    <strong className="text-gray-200 block">Caro & Lucas</strong>
                                    <span className="text-sm text-gray-500">Frontend, SonarCube, Rapports & Design</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4 p-3 bg-gray-800/50 rounded-lg border border-white/5">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <FontAwesomeIcon icon={faCogs} />
                                </div>
                                <div>
                                    <strong className="text-gray-200 block">Quentin</strong>
                                    <span className="text-sm text-gray-500">Backend & Routes API</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <p className="text-xs text-gray-600 text-center pt-4 border-t border-white/5">
                        © 2025 Touche Moi l'Image. Tous droits réservés.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default AboutModal;
