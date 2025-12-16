import React from 'react';

const BentoCard = ({ children, className = '', title, delay = 0 }) => {
    return (
        <div
            className={`relative overflow-hidden bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,205,60,0.1)] hover:border-brand-yellow/30 hover:-translate-y-1 group ${className}`}
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-yellow/5 rounded-full blur-3xl group-hover:bg-brand-yellow/10 transition-colors duration-500 pointer-events-none" />

            {title && (
                <h3 className="relative z-10 text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                    {title}
                </h3>
            )}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export default BentoCard;
