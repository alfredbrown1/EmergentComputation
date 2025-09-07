import React from 'react';

interface ControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onRunBest: () => void;
  onRuleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onLatticeSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRunning: boolean;
  evolutionMode: boolean;
  latticeSize: number;
  speed: number;
  bestRuleExists: boolean;
}

const ControlButton: React.FC<{ onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }> = ({ onClick, disabled = false, children, className = '' }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-black border border-green-500 text-green-500 font-bold py-2 px-4 uppercase tracking-widest transition-colors duration-300 hover:bg-green-500 hover:text-black focus:outline-none focus:bg-green-500 focus:text-black disabled:border-gray-600 disabled:text-gray-600 disabled:bg-black disabled:cursor-not-allowed hover:disabled:bg-black ${className}`}
    >
      {children}
    </button>
);


const Controls: React.FC<ControlsProps> = ({
  onStart,
  onPause,
  onReset,
  onRunBest,
  onRuleChange,
  onLatticeSizeChange,
  onSpeedChange,
  isRunning,
  evolutionMode,
  latticeSize,
  speed,
  bestRuleExists,
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center p-4 border border-green-500/30 bg-black mb-8">
      <ControlButton onClick={onStart} disabled={isRunning && evolutionMode}>Start Evolution</ControlButton>
      <ControlButton onClick={onPause} disabled={!isRunning}>
        {isRunning ? 'Pause' : 'Resume'}
      </ControlButton>
      <ControlButton onClick={onReset}>Reset</ControlButton>
      <ControlButton onClick={onRunBest} disabled={!bestRuleExists}>Run Best CA</ControlButton>

      <select id="caRule" onChange={onRuleChange} className="bg-black border border-green-500 text-green-500 p-2 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer uppercase">
        <option value="random">Random Rule</option>
        <option value="majority">Majority Rule</option>
        <option value="expand">Block Expanding</option>
        <option value="particle">Particle-based</option>
        <option value="gkl">GKL Rule</option>
      </select>

      <div className="flex items-center gap-2 text-green-400 uppercase text-sm">
        <label htmlFor="latticeSize">Size:</label>
        <input type="range" id="latticeSize" min="51" max="201" step="2" value={latticeSize} onChange={onLatticeSizeChange} className="w-32 accent-green-500" />
        <span className="bg-black border border-green-500/50 px-2 py-1">{latticeSize}</span>
      </div>

      <div className="flex items-center gap-2 text-green-400 uppercase text-sm">
        <label htmlFor="speed">Speed:</label>
        <input type="range" id="speed" min="1" max="1000" value={speed} onChange={onSpeedChange} className="w-32 accent-green-500" />
      </div>
    </div>
  );
};

export default Controls;