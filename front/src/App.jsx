import './App.css';
import useImageEditor from '../hooks/useImageEditor';
import Sidebar from './components/sidebar.jsx';
import { useState } from 'react';
import api from './services/apiService.js';

function App() {
  const { state, actions } = useImageEditor();
  const [editingStarted, setEditingStarted] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null); // 'bw', 'flipH', 'flipV' ou null

  //Convertit l'image actuelle en noir et blanc via l'API
  const handleConvertToBW = async (imageSource) => {
    setLoadingButton('bw');
    try {
      // Appel API
      const image = await api.convertToBW(imageSource);
      // On affiche la nouvelle image dans l’éditeur
      actions.setCurrentPicture(image);
    } catch (err) {
      console.error('Erreur conversion N&B (serveur) :', err);
    } finally {
      setLoadingButton(null);
    }
  };

//Flip (miroir) de l'image
  const handleFlip = async (direction) => {
    const key = direction === 'H' ? 'flipH' : 'flipV';
    setLoadingButton(key);
    try {
      const image = await api.flipImage(state.currentPicture, direction);
      actions.setCurrentPicture(image);
    } catch (err) {
      console.error('Erreur flip image:', err);
    } finally {
      setLoadingButton(null);
    }
  };
  
//Gestion de l'upload de l'image par l'utilisateur
  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      actions.setOriginalPicture(reader.result);
      actions.setCurrentPicture(reader.result);
      setEditingStarted(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
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

          {state.currentPicture && (
            <div className="preview">
              <img src={state.currentPicture} alt="Prévisualisation" />
            </div>
          )}

          {state.currentPicture && editingStarted && (
            <div className="editor-controls">
              <button
                className="convert-btn"
                onClick={() => handleConvertToBW(state.currentPicture)}
                disabled={loadingButton !== null}
              >
                {loadingButton === 'bw' ? 'Traitement...' : 'Convertir en N&B'}
              </button>

              <button
                className="flip-h-btn"
                onClick={() => handleFlip('H')}
                disabled={loadingButton !== null}
              >
                {loadingButton === 'flipH' ? 'Traitement...' : 'Flip Horizontal'}
              </button>

              <button
                className="flip-v-btn"
                onClick={() => handleFlip('V')}
                disabled={loadingButton !== null}
              >
                {loadingButton === 'flipV' ? 'Traitement...' : 'Flip Vertical'}
              </button>

              <button
                className="cancel-edit-btn"
                onClick={() => {
                  if (state.originalPicture) actions.setCurrentPicture(state.originalPicture);
                  if (lastObjectUrlRef.current) {
                    try { URL.revokeObjectURL(lastObjectUrlRef.current); } catch (e) {}
                    lastObjectUrlRef.current = null;
                  }
                  setEditingStarted(false);
                }}
                disabled={loadingButton !== null}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
