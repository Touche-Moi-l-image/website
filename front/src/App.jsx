import './App.css';
import useImageEditor from '../hooks/useImageEditor';
import { useState } from 'react';

function App() {
  const { state, actions } = useImageEditor();
  const [editingStarted, setEditingStarted] = useState(false);

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      actions.setOriginalPicture(reader.result);
      actions.setCurrentPicture(reader.result);
      setEditingStarted(false); // reset si on change d’image
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="app">
      <h1>Touche Moi l'Image 🎨</h1>

      {/* --- Upload Section --- */}
      <div className="upload-section">
        {!state.currentPicture && (
          <label className="upload-btn">
            Sélectionner une image {' '}
            <input type="file" accept="image/*" onChange={handleUpload} hidden />
          </label>
        )}

        {state.currentPicture && !editingStarted && (
          <>
            <label className="change-btn">
              Changer d'image {' '}
              <input type="file" accept="image/*" onChange={handleUpload} hidden />
            </label>
            <button
              className="edit-btn"
              onClick={() => setEditingStarted(true)}
            >
              Commencer à modifier
            </button>
          </>
        )}
      </div>

      {/* --- Preview Section --- */}
      {state.currentPicture && (
        <div className="preview">
          <img
            src={state.currentPicture}
            alt="Prévisualisation"
          />
        </div>
      )}
    </div>
  );
}

export default App;
