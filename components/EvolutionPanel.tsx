
import React, { useRef, useEffect } from 'react';
import { Rule } from '../types';

interface StatCardProps {
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
    <div className="bg-black border border-green-500/30 p-3 text-center">
        <div className="text-xs text-green-300/70 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-bold text-green-400">{value}</div>
    </div>
);

interface EvolutionPanelProps {
    generation: number;
    bestFitness: number;
    initialDensity: number;
    classification: string;
    bestRule: Rule | null;
    fitnessHistory: number[];
}

const EvolutionPanel: React.FC<EvolutionPanelProps> = ({
    generation,
    bestFitness,
    initialDensity,
    classification,
    bestRule,
    fitnessHistory,
}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas || fitnessHistory.length < 1) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const scaleX = width / Math.max(1, fitnessHistory.length - 1);
        
        fitnessHistory.forEach((fitness, i) => {
            const x = i * scaleX;
            const y = height - (fitness * height);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

    }, [fitnessHistory]);
    
    return (
        <div className="bg-black border border-green-500/30 p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-center uppercase tracking-widest">Evolutionary Progress</h3>
            <canvas ref={chartRef} width="300" height="200" className="w-full h-48 bg-black border-2 border-green-500 mb-4"></canvas>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <StatCard label="Generation" value={generation} />
                <StatCard label="Best Fitness" value={bestFitness.toFixed(3)} />
                <StatCard label="Initial Density" value={initialDensity.toFixed(3)} />
                <StatCard label="Classification" value={classification} />
            </div>
            
            <div className="flex-grow bg-black border border-green-500/30 p-3 text-sm text-green-300 overflow-hidden flex flex-col">
                <strong className="uppercase tracking-wider">Current Best Rule:</strong>
                <div className="break-all mt-1 flex-grow overflow-y-auto text-xs">
                    {bestRule ? bestRule.join('') : 'Evolving...'}
                </div>
            </div>
        </div>
    );
};

export default EvolutionPanel;
