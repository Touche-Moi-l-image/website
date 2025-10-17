import React from 'react';
import '../App.css';
import logo from '../assets/logo.png'; 

function Sidebar() {
  return (
    <div className="sidebar">
      {/* --- Logo en haut --- */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo Touche Moi l'Image" />
      </div>

      {/* --- Navigation principale --- */}
      <div className="sidebar-nav">
        <button>🏠 Accueil</button>
        <button>🖌️ Éditeur</button>
        <button>ℹ️ À propos</button>
      </div>

      {/* --- Paramètres en bas --- */}
      <div className="sidebar-bottom">
        <button>⚙️ Paramètres</button>
      </div>
    </div>
  );
}

export default Sidebar;
