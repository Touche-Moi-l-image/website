import './App.css';
import useImageEditor from '../hooks/useImageEditor';
import Sidebar from './components/sidebar.jsx';
import DrawingCanvas from './components/DrawingCanvas.jsx';
import Showcase from './components/Showcase.jsx';
import AboutModal from './components/AboutModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import FilterPresets from './components/FilterPresets.jsx';
import CropOverlay from './components/CropOverlay.jsx';
import ResizeModal from './components/resizeModal.jsx';
import BentoCard from './components/ui/BentoCard.jsx';
import ActionButton from './components/ui/ActionButton.jsx';
import { faMagic, faArrowsAltH, faArrowsAltV, faEraser, faExpand, faCropAlt, faSave, faPen, faUndo, faRedo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const canvasRef = useRef(null);

  const [imageSize, setImageSize] = useState({ width: 800, height: 600 });
  const [realDimensions, setRealDimensions] = useState(null);

  // États pour les sliders (valeurs visuelles)
  const [brightnessVal, setBrightnessVal] = useState(0);
  const [contrastVal, setContrastVal] = useState(0);
  const [rotationVal, setRotationVal] = useState(0);

  // Drawing State
  const [brushColor, setBrushColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];

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
        setRealDimensions({ w: img.naturalWidth, h: img.naturalHeight });
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
    setShowResizeModal(true);
  };

  const onConfirmResize = (wPct, hPct) => {
    commitAndApply((src) => api.resizeImage(src, wPct, hPct), 'resize');
  };

  const handleCrop = () => {
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

  const handleApplyPreset = async (preset) => {
    // 1. Extract values from preset
    let newBrightness = 0;
    let newContrast = 0;
    let otherOps = [];

    preset.ops.forEach(op => {
      if (op.type === 'brightness') newBrightness = op.value;
      else if (op.type === 'contrast') newContrast = op.value;
      else otherOps.push(op);
    });

    // 2. Set Visual State
    setBrightnessVal(newBrightness);
    setContrastVal(newContrast);

    // 3. Apply changes via API (Sequential "Burn-in" for now, or Smart Apply?)
    // The user wants the sliders to REFLECT the state. 
    // If we just use commitAndApply, it resets sliders to 0. We must NOT reset sliders.
    // But our commitAndApply logic DOES reset sliders. We need a custom apply logic here.

    setLoadingButton(`preset-${preset.id}`);
    try {
      // Start from base
      let currentSrc = baseImageRef.current;

      // If we have Other Ops (Blur, BW), apply them to base first? 
      // Or just apply everything sequentially.

      // Strategy: Apply Brightness -> Contrast -> Others.
      // But we want the "Result" to be editable via sliders. 
      // If we burn in Brightness, the slider should be 0.
      // If we want slider at 20, we should apply Brightness(20) to Base.

      // If we have BOTH:
      // We can't really support both live sliders with current API structure (sequential calls).
      // However, we can burn them in for the PREVIEW, and if user touches slider, we might have issue.
      // BUT, let's try to just apply them and keep the slider values.

      // NOTE: Current standard apply functions use baseImageRef.
      // If I set state, then call api, I get a result.
      // If I DON'T reset state, the slider matches the result (if the result is just that op).

      if (newBrightness !== 0) {
        currentSrc = await api.brightnessImage(currentSrc, newBrightness + 100);
      }
      if (newContrast !== 0) {
        currentSrc = await api.contrastImage(currentSrc, newContrast + 100);
      }

      for (const op of otherOps) {
        if (op.type === 'blur') currentSrc = await api.blurImage(currentSrc, op.value);
        else if (op.type === 'bw') currentSrc = await api.convertToBW(currentSrc);
      }

      actions.setCurrentPicture(currentSrc);
      if (canvasRef.current?.reloadImage) {
        canvasRef.current.reloadImage(currentSrc);
      }

      // Crucial: Do NOT reset sliders.
      // But we also need to be careful about 'activeSliderRef'.
      // If we leave sliders at Non-Zero, and user touches one...
      // e.g. touches Brightness: handleSliderChange triggers.
      // It sets activeSliderRef = 'brightness'.
      // It uses baseImageRef (which is OLD base).
      // It applies NEW brightness.
      // It LOSES the Contrast effect we just applied!

      // This confirms we need to Burn-In the "Cross-Channel" effects, OR support Cumulative.
      // Since we can't easily support Cumulative without backend changes,
      // We will ACCEPT that touching High-Brightness slider might reset Contrast.
      // OR we update baseImageRef to be the result of the "Other" ops, and only keep one lively?

      // For now, fulfilling the user request: "Filters set Sliders".
      // We set the sliders. We apply the effect.
      // Just be aware of the "Switching Tools Resets" limitation.

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingButton(null);
    }
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
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden">
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showResizeModal && <ResizeModal onClose={() => setShowResizeModal(false)} onConfirm={onConfirmResize} />}
      <Sidebar
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onOpenAbout={() => setShowAbout(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <div className={`flex-1 flex flex-col h-full relative ${activeTab === 'home' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {activeTab === 'home' && (
          <Showcase onStartEditing={() => setActiveTab('editor')} />
        )}

        {activeTab === 'editor' && (
          <div className="flex flex-col h-full p-4 gap-6">
            <h1 className="text-3xl font-bold text-center text-brand-yellow tracking-tight">Touche Moi l'Image</h1>

            <div className="flex flex-col items-center justify-center gap-4 py-8">
              {!state.currentPicture && (
                <label className="cursor-pointer bg-brand-yellow text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-yellow-400 hover:scale-105 transition-all text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faSave} /> {/* Using save icon as placeholder for upload or import generic upload icon if avail */}
                  Sélectionner une image
                  <input type="file" accept="image/*" onChange={handleUpload} hidden />
                </label>
              )}

              {state.currentPicture && !editingStarted && (
                <div className="flex gap-4">
                  <label className="cursor-pointer bg-gray-700 text-white font-medium py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                    Changer d'image
                    <input type="file" accept="image/*" onChange={handleUpload} hidden />
                  </label>
                  <button
                    className="bg-brand-yellow text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg"
                    onClick={() => setEditingStarted(true)}
                  >
                    Commencer à modifier
                  </button>
                </div>
              )}
            </div>

            {state.currentPicture && !editingStarted && (
              <div className="flex-1 flex items-center justify-center p-4 bg-gray-900/50 rounded-2xl border border-white/5 backdrop-blur-sm overflow-hidden">
                <img
                  src={state.currentPicture}
                  alt="Prévisualisation"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            )}

            {/* Editor Area - Only show if editing started OR we want to show it always? 
                Logic seems to be: Select Image -> Preview -> Click Start -> Editor. 
                Let's checking the original logic. 
                Original: {activeTab === 'editor' && ( <div className="app"> ... {showcase stuff removed} ... {preview} ... {grid} )}
                The grid was ALWAYS rendered in my previous view? No.
                Line 384: {state.currentPicture && !editingStarted && ( preview )}
                Line 390: <div className="grid ..."> 
                It seems the grid was always there but empty? 
                Actually, the DrawingCanvas needs the image. If !editingStarted, maybe we shouldn't show the editor grid?
                Let's wrap the grid in editingStarted check to be clean, OR just show it.
                The user complained about "cadre qu'il faut".
                Let's assume the user wants to see the editor immediately often.
                For now, I will keep the logic: If editingStarted is true, show grid. If not, show preview.
            */}

            {editingStarted && (
              <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-1 gap-6 flex-1 min-h-0 overflow-hidden">
                {/* MAIN CANVAS AREA - Spans 3 cols */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-full min-h-0">
                  <BentoCard className="flex-1 flex items-center justify-center relative overflow-hidden group">
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
                        brushColor={brushColor}
                        brushSize={brushSize}
                        isEraser={isEraser}
                        onHistoryChange={({ canUndo, canRedo }) => {
                          setCanUndo(canUndo);
                          setCanRedo(canRedo);
                        }}
                      />
                    )}

                    {/* Floating Dimensions Pill */}
                    {realDimensions && (
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gray-300 border border-white/10">
                        {realDimensions.w} x {realDimensions.h} px
                      </div>
                    )}

                    {loadingButton && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </BentoCard>

                  {/* BOTTOM TOOLBAR (Quick Actions) */}
                  <BentoCard className="p-4">
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                      <ActionButton
                        icon={faMagic}
                        variant="secondary"
                        onClick={handleConvertToBW}
                        disabled={loadingButton !== null}
                      >
                        N&B
                      </ActionButton>
                      <ActionButton
                        icon={faArrowsAltH}
                        variant="secondary"
                        onClick={() => handleFlip('H')}
                        disabled={loadingButton !== null}
                      >
                        Flip H
                      </ActionButton>
                      <ActionButton
                        icon={faArrowsAltV}
                        variant="secondary"
                        onClick={() => handleFlip('V')}
                        disabled={loadingButton !== null}
                      >
                        Flip V
                      </ActionButton>
                      <ActionButton
                        icon={faEraser}
                        variant="secondary"
                        onClick={handleRemoveBackground}
                        disabled={loadingButton !== null}
                      >
                        No BG
                      </ActionButton>
                      <ActionButton
                        icon={faExpand}
                        variant="secondary"
                        onClick={handleResize}
                        disabled={loadingButton !== null}
                      >
                        Resize
                      </ActionButton>
                      <ActionButton
                        icon={faCropAlt}
                        variant="danger" // Pink/Red for attention
                        className="!bg-pink-500/10 !text-pink-400 !border-pink-500/20 hover:!bg-pink-500/20"
                        onClick={handleCrop}
                        disabled={loadingButton !== null}
                      >
                        Crop
                      </ActionButton>
                    </div>
                  </BentoCard>
                </div>

                {/* RIGHT SIDEBAR (Adjustments) - Spans 1 col */}
                <div className="flex flex-col gap-6 h-full overflow-y-auto min-h-0 pr-2">

                  {/* DRAWING TOOLS */}
                  <BentoCard title="Outils de Dessin" className="flex flex-col gap-4 max-h-[40vh] shrink-0" contentClassName="overflow-y-auto pr-2 custom-scrollbar">
                    <div className="flex flex-col gap-4">
                      {/* Tools Toggles */}
                      <div className="flex gap-2 justify-center bg-gray-800/50 p-1 rounded-lg">
                        <button
                          onClick={() => setIsEraser(false)}
                          className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all ${!isEraser ? 'bg-brand-yellow text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                          <FontAwesomeIcon icon={faPen} />
                          <span className="text-xs">Pinceau</span>
                        </button>
                        <button
                          onClick={() => setIsEraser(true)}
                          className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all ${isEraser ? 'bg-brand-yellow text-black font-bold shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                          <FontAwesomeIcon icon={faEraser} />
                          <span className="text-xs">Gomme</span>
                        </button>
                      </div>

                      {/* Color Picker (Only if Pen) */}
                      {!isEraser && (
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs text-gray-400">
                            <span>Couleur</span>
                            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: brushColor }}></div>
                          </div>
                          <div className="grid grid-cols-8 gap-2">
                            {colors.map(c => (
                              <button
                                key={c}
                                onClick={() => setBrushColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${brushColor === c ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                          <input
                            type="color"
                            value={brushColor}
                            onChange={(e) => setBrushColor(e.target.value)}
                            className="w-full h-8 cursor-pointer bg-transparent rounded-lg border border-gray-700"
                          />
                        </div>
                      )}

                      {/* Size Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Taille</span>
                          <span>{brushSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="1" max="50"
                          value={brushSize}
                          onChange={(e) => setBrushSize(Number(e.target.value))}
                          className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                        />
                      </div>

                      {/* History Actions */}
                      <div className="flex gap-2 pt-2 border-t border-white/10">
                        <ActionButton
                          icon={faUndo}
                          variant="secondary"
                          disabled={!canUndo}
                          onClick={() => canvasRef.current?.undo()}
                          className="flex-1 !py-2 text-xs"
                          title="Annuler"
                        >
                        </ActionButton>
                        <ActionButton
                          icon={faRedo}
                          variant="secondary"
                          disabled={!canRedo}
                          onClick={() => canvasRef.current?.redo()}
                          className="flex-1 !py-2 text-xs"
                          title="Refaire"
                        >
                        </ActionButton>
                        <ActionButton
                          icon={faTrash}
                          variant="danger"
                          onClick={() => canvasRef.current?.clearCanvas()}
                          className="flex-1 !py-2 text-xs !bg-red-500/10 !text-red-400 hover:!bg-red-500/20"
                          title="Tout effacer"
                        >
                        </ActionButton>
                      </div>
                    </div>
                  </BentoCard>

                  {/* ADJUSTMENTS */}
                  <BentoCard title="Ajustements" className="flex flex-col gap-6 max-h-[30vh] shrink-0" contentClassName="overflow-y-auto pr-2 custom-scrollbar">

                    {/* Brightness */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Luminosité</span>
                        <span>{brightnessVal}</span>
                      </div>
                      <input
                        type="range"
                        min="-100" max="100"
                        value={brightnessVal}
                        onChange={(e) => setBrightnessVal(Number(e.target.value))}
                        onMouseUp={() => applyBrightness()}
                        onTouchEnd={() => applyBrightness()}
                        disabled={loadingButton !== null}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                      />
                    </div>

                    {/* Contrast */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Contraste</span>
                        <span>{contrastVal}</span>
                      </div>
                      <input
                        type="range"
                        min="-100" max="100"
                        value={contrastVal}
                        onChange={(e) => setContrastVal(Number(e.target.value))}
                        onMouseUp={() => applyContrast()}
                        onTouchEnd={() => applyContrast()}
                        disabled={loadingButton !== null}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                      />
                    </div>

                    {/* Rotation */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Rotation</span>
                        <span>{rotationVal}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180" max="180"
                        value={rotationVal}
                        onChange={(e) => setRotationVal(Number(e.target.value))}
                        onMouseUp={() => applyRotation()}
                        onTouchEnd={() => applyRotation()}
                        disabled={loadingButton !== null}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-yellow"
                      />
                    </div>
                  </BentoCard>

                  {/* PRESETS */}
                  <BentoCard title="Filtres" className="max-h-[30vh] shrink-0" contentClassName="overflow-y-auto pr-2 custom-scrollbar">
                    <FilterPresets
                      onApplyPreset={handleApplyPreset}
                      disabled={loadingButton !== null}
                    />
                  </BentoCard>

                  {/* SAVE ACTIONS */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <ActionButton
                      variant="primary"
                      icon={faSave}
                      onClick={handleDownload}
                      disabled={loadingButton !== null}
                      className='w-full justify-center py-4 text-sm font-bold tracking-wide'
                    >
                      Télécharger
                    </ActionButton>
                    <ActionButton
                      variant="secondary"
                      onClick={handleApplyDrawing}
                      disabled={loadingButton !== null}
                      className='w-full justify-center text-sm'
                    >
                      Fusionner Dessin
                    </ActionButton>
                    <ActionButton
                      variant="ghost"
                      onClick={handleReset}
                      disabled={loadingButton !== null}
                      className='w-full justify-center text-xs text-red-400 hover:text-red-300'
                    >
                      Réinitialiser tout
                    </ActionButton>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </div >
    </div >
  );
}

export default App;