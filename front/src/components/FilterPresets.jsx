import React from 'react';

const PRESETS = [
    {
        id: 'eclat',
        name: 'Éclat',
        ops: [
            { type: 'contrast', value: 30 },
            { type: 'brightness', value: 10 }
        ]
    },
    {
        id: 'sombre',
        name: 'Sombre',
        ops: [
            { type: 'brightness', value: -30 },
            { type: 'contrast', value: 20 }
        ]
    },
    {
        id: 'douceur',
        name: 'Douceur',
        ops: [
            { type: 'blur', value: 2 }, // Blur value 0-100, 2 is subtle
            { type: 'brightness', value: 10 }
        ]
    },
    {
        id: 'vintage',
        name: 'Vintage',
        ops: [
            { type: 'contrast', value: -20 },
            { type: 'brightness', value: 20 }
        ]
    }
];

const FilterPresets = ({ onApplyPreset, disabled }) => {
    return (
        <div className="filter-presets">
            <h3>Filtres & Presets</h3>
            <div className="presets-grid">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.id}
                        className="preset-btn"
                        onClick={() => onApplyPreset(preset)}
                        disabled={disabled}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>
            <style>{`
        .filter-presets {
          margin: 1rem 0;
          text-align: left;
        }
        .filter-presets h3 {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .presets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 0.5rem;
        }
        .preset-btn {
          background: #444;
          border: 1px solid #555;
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        .preset-btn:hover:not(:disabled) {
          background: #555;
          border-color: #777;
        }
        .preset-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </div>
    );
};

export default FilterPresets;
