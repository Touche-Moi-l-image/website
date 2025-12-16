import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ActionButton = ({
    onClick,
    children,
    icon,
    variant = 'secondary',
    className = '',
    disabled = false
}) => {

    const baseStyle = "flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-brand-yellow text-gray-900 hover:bg-yellow-300 shadow-lg shadow-yellow-500/20",
        secondary: "bg-gray-800 text-white hover:bg-gray-700 border border-white/5",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "bg-transparent text-gray-400 hover:text-white"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`${baseStyle} ${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && <FontAwesomeIcon icon={icon} />}
            {children}
        </motion.button>
    );
};

export default ActionButton;
