import React, { useState, useRef, useEffect } from 'react';

const CropOverlay = ({ imageSrc, width, height, onConfirm, onCancel }) => {
    const [selection, setSelection] = useState(null); // { x, y, w, h }
    const [isDragging, setIsDragging] = useState(false);
    const startRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Mettre à jour la sélection pendant le drag
    const handleMouseDown = (e) => {
        e.preventDefault();
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        startRef.current = { x, y };
        setIsDragging(true);
        setSelection({ x, y, w: 0, h: 0 });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        let currentX = e.clientX - rect.left;
        let currentY = e.clientY - rect.top;

        // Limites
        currentX = Math.max(0, Math.min(currentX, width));
        currentY = Math.max(0, Math.min(currentY, height));

        const startX = startRef.current.x;
        const startY = startRef.current.y;

        const newX = Math.min(startX, currentX);
        const newY = Math.min(startY, currentY);
        const newW = Math.abs(currentX - startX);
        const newH = Math.abs(currentY - startY);

        setSelection({ x: newX, y: newY, w: newW, h: newH });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleConfirm = () => {
        if (!selection || selection.w === 0 || selection.h === 0) {
            alert("Veuillez sélectionner une zone.");
            return;
        }
        onConfirm(selection);
    };

    return (
        <div
            className="crop-overlay-container"
            style={{ width, height, position: 'relative', userSelect: 'none' }}
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <img src={imageSrc} width={width} height={height} style={{ pointerEvents: 'none' }} alt="Crop target" />

            {/* Overlay sombre */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                pointerEvents: 'none'
            }} />

            {/* Zone claire (sélection) */}
            {selection && (
                <div style={{
                    position: 'absolute',
                    left: selection.x,
                    top: selection.y,
                    width: selection.w,
                    height: selection.h,
                    background: 'transparent',
                    border: '2px solid white',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                    pointerEvents: 'none'
                }} />
            )}

            {/* Contrôles (Positionnés DANS le conteneur pour ne pas être cachés) */}
            <div className="crop-controls"
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 100,
                    background: 'rgba(0,0,0,0.8)',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                {!selection ? (
                    <span className="text-white font-medium text-sm whitespace-nowrap">Glissez pour sélectionner</span>
                ) : (
                    <>
                        <button
                            onClick={handleConfirm}
                            disabled={selection.w < 10}
                            className="bg-green-500 hover:bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                        >
                            ✓
                        </button>
                        <button
                            onClick={onCancel}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-lg"
                        >
                            ✕
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CropOverlay;
