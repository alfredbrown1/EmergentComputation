import React, { useRef, useEffect } from 'react';
import { Particle } from '../types';

interface CADisplayProps {
    history: number[][];
    particles: Particle[];
    size: number;
}

const PARTICLE_COLORS: { [key: string]: string } = {
    alpha: '#00ffff', // Neon Cyan
    beta: '#ffff00',  // Neon Yellow
    gamma: '#ff00ff', // Neon Magenta
    domain: '#ff0000',// Neon Red
};


const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-4" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></div>
        <span className="uppercase text-sm">{label}</span>
    </div>
);

const CADisplay: React.FC<CADisplayProps> = ({ history, particles, size }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !history || history.length === 0) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const cellSize = Math.max(1, width / size);
        const timeStepsToShow = Math.floor(height / 2);
        const relevantHistory = history.slice(-timeStepsToShow);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        relevantHistory.forEach((config, t) => {
            const y = t * 2;
            for (let i = 0; i < size; i++) {
                if (config[i] === 1) {
                    ctx.fillStyle = '#00ff00'; // Neon Green
                    ctx.fillRect(i * cellSize, y, cellSize, 2);
                }
            }
        });

        if (particles.length > 0) {
            const lastY = (relevantHistory.length - 1) * 2;
            particles.forEach(p => {
                const color = PARTICLE_COLORS[p.type] || PARTICLE_COLORS.domain;
                ctx.fillStyle = color;
                ctx.shadowColor = color;
                ctx.shadowBlur = 10;
                ctx.fillRect(p.position * cellSize, lastY, cellSize * 2, 4); // Make particles more visible
            });
            ctx.shadowBlur = 0; // Reset shadow
        }
    }, [history, particles, size]);

    return (
        <div className="bg-black border border-green-500/30 p-6">
            <h3 className="text-xl font-bold mb-4 text-center uppercase tracking-widest">Space-Time Diagram</h3>
            <canvas ref={canvasRef} width="600" height="400" className="w-full h-auto bg-black border-2 border-green-500"></canvas>
            <div className="flex justify-center gap-6 mt-4 flex-wrap">
                <LegendItem color="#000" label="State 0" />
                <LegendItem color="#00ff00" label="State 1" />
                <LegendItem color={PARTICLE_COLORS.alpha} label="α Particle" />
                <LegendItem color={PARTICLE_COLORS.beta} label="β Particle" />
                <LegendItem color={PARTICLE_COLORS.gamma} label="γ Particle" />
            </div>
        </div>
    );
};

export default CADisplay;