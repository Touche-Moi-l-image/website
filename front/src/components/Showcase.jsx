import React from 'react';
import BentoCard from './ui/BentoCard';
import ActionButton from './ui/ActionButton';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

// Import images
import imgBlur from '../../../src/img/blured_image.png';
import imgFlip from '../../../src/img/flipped_image.png';
import imgBW from '../../../src/img/bw.png';
import imgRotate from '../../../src/img/rotated_image.png';
import imgBrightness from '../../../src/img/brightened_image.png';
import imgContrast from '../../../src/img/contrasted_image.png';
import imgCrop from '../../../src/img/croped-image.png';
import imgResize from '../../../src/img/resized_image.png';
import logo from '../assets/logo.png';

const features = [
    { id: 1, title: 'Flou Artistique', img: imgBlur, desc: 'Appliquez un effet de flou pour adoucir vos images.' },
    { id: 2, title: 'Miroir (Flip)', img: imgFlip, desc: 'Retournez vos images horizontalement ou verticalement.' },
    { id: 3, title: 'Noir & Blanc', img: imgBW, desc: 'Donnez un style rétro avec le filtre niveaux de gris.' },
    { id: 4, title: 'Rotation', img: imgRotate, desc: 'Faites pivoter vos images sous n\'importe quel angle.' },
    { id: 5, title: 'Luminosité', img: imgBrightness, desc: 'Ajustez l\'exposition pour des photos éclatantes.' },
    { id: 6, title: 'Contraste', img: imgContrast, desc: 'Renforcez les couleurs et les détails.' },
    { id: 7, title: 'Recadrage', img: imgCrop, desc: 'Recadrez l\'essentiel de votre sujet.' },
    { id: 8, title: 'Redimensionner', img: imgResize, desc: 'Changez la taille de vos images sans perte.' },
];

function Showcase({ onStartEditing }) {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">

            {/* Header */}
            <div className="flex flex-col items-center gap-4 mb-16 text-center">
                <div className="w-20 h-20 bg-brand-yellow rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(255,205,60,0.3)] animate-float">
                    <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                </div>
                <div>
                    <h1 className="text-5xl font-bold mb-3 tracking-tight">Touche Moi l'Image</h1>
                    <p className="text-xl text-gray-400 font-light">
                        La retouche photo <span className="text-brand-yellow font-medium">réinventée</span> et amusante.
                    </p>
                </div>

                <ActionButton
                    variant="primary"
                    icon={faRocket}
                    className="mt-6 !px-8 !py-4 text-lg"
                    onClick={onStartEditing}
                >
                    Commencer à créer
                </ActionButton>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {features.map((feature, index) => (
                    <BentoCard
                        key={feature.id}
                        delay={index * 0.1}
                        className="group relative overflow-hidden min-h-[280px] flex flex-col justify-end"
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                src={feature.img}
                                alt={feature.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                        </div>

                        <div className="relative z-10 p-2">
                            <h3 className="text-2xl font-bold text-brand-yellow mb-2">{feature.title}</h3>
                            <p className="text-sm text-gray-300 leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                {feature.desc}
                            </p>
                        </div>
                    </BentoCard>
                ))}
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default Showcase;
