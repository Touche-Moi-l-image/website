import React from 'react';
import logo from '../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPenNib, faInfoCircle, faCog } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

function Sidebar({ activeTab, onNavigate, onOpenAbout, onOpenSettings }) {
  const NavItem = ({ icon, label, active, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center p-4 w-full rounded-2xl transition-all duration-300 ${active
          ? 'bg-gray-900 text-brand-yellow shadow-lg shadow-yellow-500/10'
          : 'bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-200'
        }`}
    >
      <FontAwesomeIcon icon={icon} className="text-xl mb-1" />
      <span className="text-[10px] font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2 translate-y-full bg-gray-800 px-2 py-1 rounded shadow-xl z-50 pointer-events-none whitespace-nowrap">
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute left-0 w-1 h-8 bg-brand-yellow rounded-r-full"
        />
      )}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className="w-24 h-full bg-gray-950 border-r border-white/5 flex flex-col items-center py-6 gap-8 z-50 bg-opacity-90 backdrop-blur-xl"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="w-12 h-12 mb-4"
      >
        <img src={logo} alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,205,60,0.3)]" />
      </motion.div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-4 w-full px-3">
        <NavItem
          icon={faHome}
          label="Accueil"
          active={activeTab === 'home'}
          onClick={() => onNavigate('home')}
        />
        <NavItem
          icon={faPenNib}
          label="Éditeur"
          active={activeTab === 'editor'}
          onClick={() => onNavigate('editor')}
        />
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 w-full px-3">
        <NavItem
          icon={faInfoCircle}
          label="À propos"
          onClick={onOpenAbout}
        />
        <NavItem
          icon={faCog}
          label="Paramètres"
          onClick={onOpenSettings}
        />
      </div>
    </motion.div>
  );
}

export default Sidebar;
