import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = forwardRef(({ imageUrl, width, height }, ref) => {
  const backgroundCanvasRef = useRef(null); // Canvas pour l'image de fond
  const drawingCanvasRef = useRef(null); // Canvas transparent pour le dessin
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);

  // Initialiser le canvas de fond avec l'image
  useEffect(() => {
    const bgCanvas = backgroundCanvasRef.current;
    if (!bgCanvas) return;

    const ctx = bgCanvas.getContext('2d');

    // Charger l'image de fond
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      ctx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  // Initialiser l'historique du dessin au premier chargement
  useEffect(() => {
    const drawCanvas = drawingCanvasRef.current;
    if (!drawCanvas || history.length > 0) return;
    saveToHistory();
  }, [imageUrl, width, height]);

  // Sauvegarder l'état actuel du dessin dans l'historique
  const saveToHistory = () => {
    const drawCanvas = drawingCanvasRef.current;
    if (!drawCanvas) return;

    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(drawCanvas.toDataURL());
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  // Exposer les méthodes au parent via ref
  useImperativeHandle(ref, () => ({
    getImageData: () => {
      // Fusionner les deux canvas (fond + dessin)
      const bgCanvas = backgroundCanvasRef.current;
      const drawCanvas = drawingCanvasRef.current;
      if (!bgCanvas || !drawCanvas) return null;

      // Créer un canvas temporaire pour la fusion
      const mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = width;
      mergedCanvas.height = height;
      const ctx = mergedCanvas.getContext('2d');

      // Dessiner l'image de fond
      ctx.drawImage(bgCanvas, 0, 0);
      // Dessiner le calque de dessin par-dessus
      ctx.drawImage(drawCanvas, 0, 0);

      return mergedCanvas.toDataURL('image/png');
    },
    reloadImage: (imageData) => {
      const bgCanvas = backgroundCanvasRef.current;
      const drawCanvas = drawingCanvasRef.current;
      if (!bgCanvas || !drawCanvas) return;

      // Recharger l'image de fond
      const bgCtx = bgCanvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.drawImage(img, 0, 0, bgCanvas.width, bgCanvas.height);
      };
      img.src = imageData;

      // Effacer le calque de dessin et réinitialiser l'historique
      const drawCtx = drawCanvas.getContext('2d');
      drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      setHistory([]);
      setHistoryStep(-1);
      saveToHistory();
    },
    clearCanvas: () => {
      const drawCanvas = drawingCanvasRef.current;
      if (!drawCanvas) return;

      // Effacer uniquement le calque de dessin
      const ctx = drawCanvas.getContext('2d');
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      saveToHistory();
    },
    undo: () => {
      if (historyStep > 0) {
        const drawCanvas = drawingCanvasRef.current;
        const ctx = drawCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          ctx.drawImage(img, 0, 0, drawCanvas.width, drawCanvas.height);
        };
        img.src = history[historyStep - 1];
        setHistoryStep(historyStep - 1);
      }
    },
    redo: () => {
      if (historyStep < history.length - 1) {
        const drawCanvas = drawingCanvasRef.current;
        const ctx = drawCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
          ctx.drawImage(img, 0, 0, drawCanvas.width, drawCanvas.height);
        };
        img.src = history[historyStep + 1];
        setHistoryStep(historyStep + 1);
      }
    }
  }));

  const startDrawing = (e) => {
    const drawCanvas = drawingCanvasRef.current;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = drawCanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const drawCanvas = drawingCanvasRef.current;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = drawCanvas.getContext('2d');
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      // La gomme efface uniquement le calque de dessin
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

  return (
    <div className="drawing-canvas-wrapper">
      {/* Toolbar flottante compacte */}
      <div className={`drawing-toolbar-compact ${toolbarCollapsed ? 'collapsed' : ''}`}>
        <button
          className="toolbar-toggle"
          onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
          title={toolbarCollapsed ? "Afficher les outils" : "Masquer les outils"}
        >
          {toolbarCollapsed ? '🎨' : '✕'}
        </button>

        {!toolbarCollapsed && (
          <>
            {/* Sélecteur de couleur */}
            <div className="toolbar-group">
              <button
                className="color-display"
                style={{ backgroundColor: brushColor }}
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Choisir une couleur"
              />
              {showColorPicker && (
                <div className="color-palette-advanced">
                  {/* Palette rapide */}
                  <div className="quick-colors">
                    {colors.map(color => (
                      <button
                        key={color}
                        className={`palette-color ${brushColor === color && !isEraser ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setBrushColor(color);
                          setIsEraser(false);
                        }}
                      />
                    ))}
                  </div>

                  {/* Séparateur */}
                  <div className="color-separator"></div>

                  {/* Sélecteur de couleur natif */}
                  <div className="color-picker-section">
                    <label className="color-picker-label">Roue de couleur :</label>
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => {
                        setBrushColor(e.target.value);
                        setIsEraser(false);
                      }}
                      className="color-wheel-input"
                    />
                  </div>

                  {/* Input code hexadécimal */}
                  <div className="hex-input-section">
                    <label className="hex-label">Code hex :</label>
                    <input
                      type="text"
                      value={brushColor}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Valider le format hexadécimal
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                          setBrushColor(value);
                          if (value.length === 7) {
                            setIsEraser(false);
                          }
                        }
                      }}
                      className="hex-input"
                      placeholder="#FF0000"
                      maxLength={7}
                    />
                  </div>

                  {/* Bouton fermer */}
                  <button
                    className="close-picker-btn"
                    onClick={() => setShowColorPicker(false)}
                  >
                    ✓ OK
                  </button>
                </div>
              )}
            </div>

            {/* Taille du pinceau */}
            <div className="toolbar-group size-group">
              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="size-slider"
                title={`Taille: ${brushSize}px`}
              />
              <span className="size-label">{brushSize}px</span>
            </div>

            {/* Outils */}
            <div className="toolbar-group">
              <button
                className={`tool-icon ${!isEraser ? 'active' : ''}`}
                onClick={() => setIsEraser(false)}
                title="Pinceau"
              >
                ✏️
              </button>
              <button
                className={`tool-icon ${isEraser ? 'active' : ''}`}
                onClick={() => setIsEraser(true)}
                title="Gomme"
              >
                🧹
              </button>
            </div>

            {/* Actions */}
            <div className="toolbar-group">
              <button
                className="tool-icon"
                onClick={() => ref.current?.undo()}
                disabled={historyStep <= 0}
                title="Annuler"
              >
                ↶
              </button>
              <button
                className="tool-icon"
                onClick={() => ref.current?.redo()}
                disabled={historyStep >= history.length - 1}
                title="Refaire"
              >
                ↷
              </button>
              <button
                className="tool-icon danger"
                onClick={() => ref.current?.clearCanvas()}
                title="Effacer tout"
              >
                🗑️
              </button>
            </div>
          </>
        )}
      </div>

      {/* Canvas de fond (image) */}
      <canvas
        ref={backgroundCanvasRef}
        width={width}
        height={height}
        className="background-canvas"
      />

      {/* Canvas de dessin transparent superposé */}
      <canvas
        ref={drawingCanvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="drawing-canvas"
      />
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas;

