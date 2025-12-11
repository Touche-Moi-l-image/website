import React from 'react';

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
        <div className="showcase-container">
            <div className="app-header">
                <img src={logo} alt="Logo" className="header-logo" />
                <h1>Touche Moi l'Image</h1>
            </div>

            <div className="showcase-header">
                <h2>Tout ce que vous pouvez faire</h2>
                <p className="showcase-subtitle">Découvrez nos outils de retouche puissants et simples à utiliser.</p>
            </div>

            <div className="showcase-grid">
                {features.map((feature) => (
                    <div key={feature.id} className="showcase-card">
                        <div className="card-image-wrapper">
                            <img src={feature.img} alt={feature.title} />
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="showcase-footer">
                <button className="cta-btn large" onClick={onStartEditing}>C'est parti !</button>
            </div>
        </div>
    );
}

export default Showcase;
