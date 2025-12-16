import React from 'react';
import '../App.css';
import logo from '../assets/logo.png';

function Sidebar({ activeTab, onNavigate, onOpenAbout, onOpenSettings }) {
  return (
    <div className="sidebar">
      {/* --- Logo en haut --- */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Touche Moi l'Image" />
      </div>

      {/* --- Navigation principale --- */}
      <div className="sidebar-nav">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          onClick={() => onNavigate('home')}
        >
          🏠 Accueil
        </button>
        <button
          className={activeTab === 'editor' ? 'active' : ''}
          onClick={() => onNavigate('editor')}
        >
          🖌️ Éditeur
        </button>
        <button onClick={onOpenAbout}>ℹ️ À propos</button>
      </div>

      {/* --- Paramètres en bas --- */}
      <div className="sidebar-bottom">
        <button onClick={onOpenSettings}>⚙️ Paramètres</button>
      </div>
    </div>
  );
}

export default Sidebar;
