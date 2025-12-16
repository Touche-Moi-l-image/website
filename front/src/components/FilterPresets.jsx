import React from 'react';
import { motion } from 'framer-motion';

const PRESETS = [
    {
        id: 'eclat',
        name: 'Éclat',
        gradient: 'from-orange-400 to-yellow-300',
        ops: [
            { type: 'contrast', value: 30 },
            { type: 'brightness', value: 10 }
        ]
    },
    {
        id: 'sombre',
        name: 'Sombre',
        gradient: 'from-gray-700 to-gray-900',
        ops: [
            { type: 'brightness', value: -30 },
            { type: 'contrast', value: 20 }
        ]
    },
    {
        id: 'douceur',
        name: 'Douceur',
        gradient: 'from-pink-300 to-rose-300',
        ops: [
            { type: 'blur', value: 2 },
            { type: 'brightness', value: 10 }
        ]
    },
    {
        id: 'vintage',
        name: 'Vintage',
        gradient: 'from-amber-700 to-orange-900',
        ops: [
            { type: 'contrast', value: -20 },
            { type: 'brightness', value: 20 }
        ]
    }
];

const FilterPresets = ({ onApplyPreset, disabled }) => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
                <motion.button
                    key={preset.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative overflow-hidden p-4 rounded-xl text-left shadow-lg group bg-gradient-to-br ${preset.gradient} opacity-90 hover:opacity-100 transition-opacity`}
                    onClick={() => onApplyPreset(preset)}
                    disabled={disabled}
                >
                    <span className="relative z-10 text-white font-bold text-shadow-sm uppercase tracking-wider text-xs">
                        {preset.name}
                    </span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </motion.button>
            ))}
        </div>
    );
};

export default FilterPresets;
