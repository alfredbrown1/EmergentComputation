import React from 'react';

const ParticleItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-black border border-green-500/30 p-3 text-center h-full">
        <strong className="text-green-400">{title}</strong>
        <p className="text-xs text-green-300/80">{description}</p>
    </div>
);

const InfoPanel: React.FC = () => {
    return (
        <div className="bg-black border border-green-500/30 p-6 mt-8">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">About This Simulation</h3>
            <p className="mb-4 text-green-300/90">This visualization demonstrates the key findings from Crutchfield & Mitchell (1995):</p>
            <ul className="list-inside space-y-2 mb-6" style={{ listStyleType: '" > "' }}>
                <li><strong>Density Classification Task:</strong> The CA must determine if the initial configuration has more than 50% '1's.</li>
                <li><strong>Emergent Computation:</strong> Successful CAs develop particle-based information processing.</li>
                <li><strong>Evolutionary Discovery:</strong> Genetic algorithms can discover sophisticated computational strategies.</li>
                <li><strong>Particle Interactions:</strong> Domain walls (particles) carry and process information across space-time.</li>
            </ul>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <ParticleItem title="α particles" description="Low density signals" />
                <ParticleItem title="β particles" description="Unstable transitions" />
                <ParticleItem title="γ particles" description="High density signals" />
                <ParticleItem title="Domain A⁰" description="All 0s region" />
                <ParticleItem title="Domain A¹" description="All 1s region" />
                <ParticleItem title="Domain A²" description="Pattern (10001)*" />
            </div>
        </div>
    );
};

export default InfoPanel;