import React from 'react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = '', title, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: delay, ease: "easeOut" }}
            className={`bg-gray-900/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-300 ${className}`}
        >
            {title && (
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
                    {title}
                </h3>
            )}
            {children}
        </motion.div>
    );
};

export default BentoCard;
