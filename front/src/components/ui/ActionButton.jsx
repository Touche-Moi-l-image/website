import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionButton = ({ icon, children, onClick, variant = 'primary', className = '', disabled = false, title = '' }) => {

    const baseStyle = "relative overflow-hidden flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-semibold tracking-wide shadow-lg group";

    const variants = {
        primary: "bg-gradient-to-r from-brand-yellow to-yellow-400 text-gray-900 hover:shadow-[0_0_20px_rgba(255,205,60,0.4)] hover:scale-[1.02]",
        secondary: "bg-gray-800/80 backdrop-blur-md text-gray-200 border border-white/10 hover:bg-gray-700/80 hover:text-white hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]",
        danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5 shadow-none"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
            title={title}
        >
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-150%] skew-x-[-20deg] group-hover:animate-shine pointer-events-none" />

            {icon && <FontAwesomeIcon icon={icon} className="transition-transform group-hover:rotate-[10deg]" />}
            {children && <span className="z-10">{children}</span>}
        </button>
    );
};

export default ActionButton;
