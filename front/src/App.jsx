import './App.css';
import useImageEditor from '../hooks/useImageEditor';
import Sidebar from './components/sidebar.jsx';
import DrawingCanvas from './components/DrawingCanvas.jsx';
import Showcase from './components/Showcase.jsx';
import AboutModal from './components/AboutModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import FilterPresets from './components/FilterPresets.jsx';
import CropOverlay from './components/CropOverlay.jsx';
import { useState, useRef, useEffect } from 'react';
import api from './services/apiService.js';

function App() {
  const { state, actions } = useImageEditor();

  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [editingStarted, setEditingStarted] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const canvasRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 800, height: 600 });

  // États pour les sliders (valeurs visuelles)
  const [brightnessVal, setBrightnessVal] = useState(0);
  const [contrastVal, setContrastVal] = useState(0);
  const [rotationVal, setRotationVal] = useState(0);

  // --- NOUVELLE LOGIQUE : IMAGE DE RÉFÉRENCE & TIMERS ---
  const baseImageRef = useRef(null);
  const activeSliderRef = useRef(null);

  // Refs pour les timers de saisie automatique (debounce)
  const brightnessTimeoutRef = useRef(null);
  const contrastTimeoutRef = useRef(null);
  const rotationTimeoutRef = useRef(null);

  // Initialisation de l'image de référence quand on charge une nouvelle image
  useEffect(() => {
    if (state.currentPicture && !baseImageRef.current) {
      baseImageRef.current = state.currentPicture;
    }
  }, [state.currentPicture]);

  // Calculer les dimensions de l'image pour le canvas
  useEffect(() => {
    if (state.currentPicture) {
      const img = new Image();
      img.onload = () => {
        const maxWidth = window.innerWidth * 0.7;
        const maxHeight = window.innerHeight * 0.6;

        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        setImageSize({ width, height });
      };
      img.src = state.currentPicture;
    }
  }, [state.currentPicture]);

  // Gestionnaire intelligent pour les sliders
  const handleSliderChange = async (sliderName, apiCall) => {
    if (!state.currentPicture) return;
    setLoadingButton(sliderName);

    try {
      if (activeSliderRef.current !== sliderName) {
        if (activeSliderRef.current !== null) {
          baseImageRef.current = state.currentPicture;
        } else {
          baseImageRef.current = state.currentPicture;
        }
        activeSliderRef.current = sliderName;
      }

      const newImage = await apiCall(baseImageRef.current);

      actions.setCurrentPicture(newImage);
      if (canvasRef.current?.reloadImage) {
        canvasRef.current.reloadImage(newImage);
      }

    } catch (err) {
      console.error(`Erreur ${sliderName}:`, err);
    } finally {
      setLoadingButton(null);
    }
  };

  // --- Handlers des Sliders (valeurs absolues appliquées à la base) ---

  // Note: On accepte un argument optionnel 'val' pour les appels depuis les timers/inputs
  const applyBrightness = (val = brightnessVal) => {
    handleSliderChange('brightness', (src) =>
      api.brightnessImage(src, val + 100)
    );
  };

  const applyContrast = (val = contrastVal) => {
    handleSliderChange('contrast', (src) =>
      api.contrastImage(src, val + 100)
    );
  };

  const applyRotation = (val = rotationVal) => {
    handleSliderChange('rotation', (src) =>
      api.rotateImage(src, val)
    );
  };

  // --- Helpers pour la saisie numérique (Auto-validation) ---

  const handleInputNumberChange = (e, setVal, timeoutRef, applyFn) => {
    const val = Number(e.target.value);
    setVal(val);

    // Si un timer était déjà en cours (l'utilisateur tape encore), on l'annule
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // On lance un nouveau timer : si pas d'autre frappe d'ici 800ms, on valide
    timeoutRef.current = setTimeout(() => {
      applyFn(val);
    }, 800);
  };

  const handleInputKeyDown = (e, timeoutRef, applyFn) => {
    if (e.key === 'Enter') {
      // Validation immédiate : on annule le timer automatique
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      applyFn();
    }
  };

  const handleInputBlur = (timeoutRef, applyFn) => {
    // Validation immédiate au clic ailleurs
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    applyFn();
  };

  // --- Handlers des Boutons ---

  const commitAndApply = async (apiCall, key) => {
    setLoadingButton(key);
    try {
      const image = await apiCall(state.currentPicture);
      actions.setCurrentPicture(image);
      if (canvasRef.current?.reloadImage) canvasRef.current.reloadImage(image);

      baseImageRef.current = image;
      activeSliderRef.current = null;
      setBrightnessVal(0);
      setContrastVal(0);
      setRotationVal(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingButton(null);
    }
  };

  const handleConvertToBW = () => commitAndApply((src) => api.convertToBW(src), 'bw');
  const handleFlip = (direction) => commitAndApply((src) => api.flipImage(src, direction), direction === 'H' ? 'flipH' : 'flipV');

  const handleRemoveBackground = () => commitAndApply((src) => api.removeBackground(src), 'removebg');

  const handleResize = () => {
    setIsCropping(true);
  };

  const onConfirmCrop = (selection) => {
    if (!baseImageRef.current || !selection) return;

    // Calculer les ratios pour l'image réelle (natural dimensions)
    const displayW = imageSize.width;
    const displayH = imageSize.height;

    const img = new Image();
    img.src = baseImageRef.current;

    // Attendre que l'image soit chargée pour avoir les dimensions naturelles (si pas déjà là)
    // Mais ici baseImageRef est une dataURL, donc synchrone ? Non.
    // On assume img.naturalWidth disponible après onload. 
    // Plus simple : on utilise des ratios basés sur displayW/H si on assume que l'image affichée EST baseImageRef

    // Problème : drawingCanvas affiche state.currentPicture (modifié)
    // CropOverlay affiche aussi state.currentPicture

    // On veut cropper SUR le résultat actuel.

    const scaleX = img.naturalWidth / displayW; // Wait, we can't get naturalWidth synchronously without an Image object helper.
    // Hack: reload image object or use HTMLImageElement if valid.

    // Meilleure approche: passer l'image source à CropOverlay et on assume App connaît la "natural size" ?
    // On a calculé imageSize dans le useEffect, mais on n'a pas gardé originalSize en state, juste local.

    // On va charger l'image pour avoir les dimensions réelles
    const tempImg = new Image();
    tempImg.onload = () => {
      const realW = tempImg.naturalWidth;
      const realH = tempImg.naturalHeight;

      const scaleX = realW / displayW;
      const scaleY = realH / displayH;

      const realCrop = {
        left: Math.round(selection.x * scaleX),
        top: Math.round(selection.y * scaleY),
        width: Math.round(selection.w * scaleX),
        height: Math.round(selection.h * scaleY)
      };

      // API attend: crop_top, crop_bottom, crop_left, crop_right (pixels à enlever ?)
      // Check crop_image.py: "Supports direct file upload... do_crop(image) ... left=left_px, right=... orig_w - right_px"
      // Le code serveur: 
      // left = crop_left_val
      // right = orig_w - crop_right_val
      // Donc crop_right est la marge droite (pixels à enlever à droite), pas la coordonnée X de droite.

      const cropTop = realCrop.top;
      const cropLeft = realCrop.left;
      const cropBottom = realH - (realCrop.top + realCrop.height);
      const cropRight = realW - (realCrop.left + realCrop.width);

      commitAndApply((src) => api.cropImage(src, cropTop, cropBottom, cropLeft, cropRight), 'crop');
      setIsCropping(false);
    };
    tempImg.src = state.currentPicture;
  };

  const handleApplyPreset = (preset) => {
    commitAndApply(async (initialSrc) => {
      let currentSrc = initialSrc;
      for (const op of preset.ops) {
        if (op.type === 'contrast') {
          currentSrc = await api.contrastImage(currentSrc, op.value + 100);
        } else if (op.type === 'brightness') {
          currentSrc = await api.brightnessImage(currentSrc, op.value + 100);
        } else if (op.type === 'blur') {
          currentSrc = await api.blurImage(currentSrc, op.value);
        } else if (op.type === 'bw') {
          currentSrc = await api.convertToBW(currentSrc);
        }
      }
      return currentSrc;
    }, `preset-${preset.id}`);
  };

  const handleApplyDrawing = () => {
    if (canvasRef.current) {
      const mergedImage = canvasRef.current.getImageData();
      actions.setCurrentPicture(mergedImage);
      baseImageRef.current = mergedImage;
      if (canvasRef.current.reloadImage) {
        canvasRef.current.reloadImage(mergedImage);
      }
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const finalImage = canvasRef.current.getImageData();
      const link = document.createElement('a');
      link.download = 'image-editee.png';
      link.href = finalImage;
      link.click();
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      actions.setOriginalPicture(reader.result);
      actions.setCurrentPicture(reader.result);
      setEditingStarted(false);

      baseImageRef.current = reader.result;
      activeSliderRef.current = null;
      setBrightnessVal(0);
      setContrastVal(0);
      setRotationVal(0);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (state.originalPicture) {
      actions.setCurrentPicture(state.originalPicture);
      baseImageRef.current = state.originalPicture;
    }
    if (canvasRef.current?.reloadImage) canvasRef.current.reloadImage(state.originalPicture);
    setEditingStarted(false);

    setBrightnessVal(0);
    setContrastVal(0);
    setRotationVal(0);
    activeSliderRef.current = null;
  };

  const numberInputStyle = {
    width: '60px',
    background: '#333',
    border: '1px solid #555',
    color: '#fff',
    borderRadius: '4px',
    padding: '2px 5px',
    fontSize: '0.8rem',
    textAlign: 'right'
  };

  return (
    <div className="layout">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenAbout={() => setShowAbout(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <div className="main-content">
        {activeTab === 'home' && (
          <Showcase onStartEditing={() => setActiveTab('editor')} />
        )}

        {activeTab === 'editor' && (
          <div className="app">
            <h1>Touche Moi l'Image</h1>

            <div className="upload-section">
              {!state.currentPicture && (
                <label className="upload-btn">
                  Sélectionner une image{' '}
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
              )}

              {state.currentPicture && !editingStarted && (
                <>
                  <label className="change-btn">
                    Changer d'image{' '}
                    <input type="file" accept="image/*" onChange={handleUpload} hidden />
                  </label>
                  <button className="edit-btn" onClick={() => setEditingStarted(true)}>
                    Commencer à modifier
                  </button>
                </>
              )}
            </div>

            {/* Note: Showcase conditional REMOVED here, it is now at top level based on activeTab */}

            {state.currentPicture && !editingStarted && (
              <div className="preview">
                <img src={state.currentPicture} alt="Prévisualisation" />
              </div>
            )}

            {state.currentPicture && editingStarted && (
              <>
                <div className="preview">
                  {isCropping ? (
                    <CropOverlay
                      imageSrc={state.currentPicture}
                      width={imageSize.width}
                      height={imageSize.height}
                      onConfirm={onConfirmCrop}
                      onCancel={() => setIsCropping(false)}
                    />
                  ) : (
                    <DrawingCanvas
                      ref={canvasRef}
                      imageUrl={state.currentPicture}
                      width={imageSize.width}
                      height={imageSize.height}
                    />
                  )}
                  {loadingButton && <div className="loader-overlay">Traitement...</div>}
                </div>

                <div className="editor-controls">

                  <div className="control-group buttons-row">
                    <button className="convert-btn" onClick={handleConvertToBW} disabled={loadingButton !== null}>
                      N&B
                    </button>
                    <button className="flip-h-btn" onClick={() => handleFlip('H')} disabled={loadingButton !== null}>
                      Flip H
                    </button>
                    <button className="flip-v-btn" onClick={() => handleFlip('V')} disabled={loadingButton !== null}>
                      Flip V
                    </button>
                    <button className="remove-bg-btn" onClick={handleRemoveBackground} disabled={loadingButton !== null} style={{ fontSize: '0.7rem' }}>
                      No BG
                    </button>
                    <button className="resize-btn" onClick={() => setIsCropping(true)} disabled={loadingButton !== null} style={{ fontSize: '0.7rem' }}>
                      Crop
                    </button>
                  </div>

                  <hr className="divider" />

                  <FilterPresets
                    onApplyPreset={handleApplyPreset}
                    disabled={loadingButton !== null}
                  />

                  <hr className="divider" />

                  <div className="control-group sliders-column">

                    {/* Luminosité */}
                    <div className="slider-container">
                      <label>
                        <span>Luminosité</span>
                        <input
                          type="number"
                          min="-100"
                          max="100"
                          value={brightnessVal}
                          onChange={(e) => handleInputNumberChange(e, setBrightnessVal, brightnessTimeoutRef, applyBrightness)}
                          onKeyDown={(e) => handleInputKeyDown(e, brightnessTimeoutRef, applyBrightness)}
                          onBlur={() => handleInputBlur(brightnessTimeoutRef, applyBrightness)}
                          disabled={loadingButton !== null}
                          style={numberInputStyle}
                        />
                      </label>
                      <input
                        type="range"
                        min="-100" max="100"
                        value={brightnessVal}
                        onChange={(e) => setBrightnessVal(Number(e.target.value))}
                        onMouseUp={() => applyBrightness()}
                        onTouchEnd={() => applyBrightness()}
                        disabled={loadingButton !== null}
                      />
                    </div>

                    {/* Contraste */}
                    <div className="slider-container">
                      <label>
                        <span>Contraste</span>
                        <input
                          type="number"
                          min="-100"
                          max="100"
                          value={contrastVal}
                          onChange={(e) => handleInputNumberChange(e, setContrastVal, contrastTimeoutRef, applyContrast)}
                          onKeyDown={(e) => handleInputKeyDown(e, contrastTimeoutRef, applyContrast)}
                          onBlur={() => handleInputBlur(contrastTimeoutRef, applyContrast)}
                          disabled={loadingButton !== null}
                          style={numberInputStyle}
                        />
                      </label>
                      <input
                        type="range"
                        min="-100" max="100"
                        value={contrastVal}
                        onChange={(e) => setContrastVal(Number(e.target.value))}
                        onMouseUp={() => applyContrast()}
                        onTouchEnd={() => applyContrast()}
                        disabled={loadingButton !== null}
                      />
                    </div>

                    {/* Rotation */}
                    <div className="slider-container">
                      <label>
                        <span>Rotation</span>
                        <input
                          type="number"
                          min="-180"
                          max="180"
                          value={rotationVal}
                          onChange={(e) => handleInputNumberChange(e, setRotationVal, rotationTimeoutRef, applyRotation)}
                          onKeyDown={(e) => handleInputKeyDown(e, rotationTimeoutRef, applyRotation)}
                          onBlur={() => handleInputBlur(rotationTimeoutRef, applyRotation)}
                          disabled={loadingButton !== null}
                          style={numberInputStyle}
                        />
                      </label>
                      <input
                        type="range"
                        min="-180" max="180"
                        value={rotationVal}
                        onChange={(e) => setRotationVal(Number(e.target.value))}
                        onMouseUp={() => applyRotation()}
                        onTouchEnd={() => applyRotation()}
                        disabled={loadingButton !== null}
                      />
                    </div>
                  </div>

                  <hr className="divider" />

                  <div className="control-group buttons-row">
                    <button className="apply-drawing-btn" onClick={handleApplyDrawing} disabled={loadingButton !== null}>
                      ✓ Fusionner Dessin
                    </button>
                    <button className="download-btn" onClick={handleDownload} disabled={loadingButton !== null}>
                      💾 Télécharger
                    </button>
                  </div>

                  <button
                    className="cancel-edit-btn"
                    onClick={handleReset}
                    disabled={loadingButton !== null}
                  >
                    Annuler / Reset
                  </button>
                </div>
              </>
            )
            }

          </div >
        )}
      </div >
    </div >
  );
}

export default App;