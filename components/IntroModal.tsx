
import React from 'react';

// A small visual component to demonstrate a CA rule
const CARuleVisual = () => (
    <div className="flex flex-col items-center my-4 p-4 bg-black/80 border border-green-500/30">
        <p className="text-sm mb-2 uppercase tracking-wider">Neighborhood:</p>
        <div className="flex gap-1 mb-2">
            <div className="w-6 h-6 bg-green-500" style={{ boxShadow: '0 0 5px #00ff00' }}></div>
            <div className="w-6 h-6 bg-black border border-green-800"></div>
            <div className="w-6 h-6 bg-green-500" style={{ boxShadow: '0 0 5px #00ff00' }}></div>
        </div>
        <p className="text-2xl animate-pulse text-green-500">↓</p>
        <p className="text-sm mb-2 uppercase tracking-wider">Rule Output:</p>
        <div className="w-6 h-6 bg-black border border-green-800"></div>
    </div>
);


const Section: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-green-400 mb-2 uppercase tracking-widest" style={{ textShadow: '0 0 5px #00ff00' }}>{title}</h2>
        <div className="text-green-300/90 space-y-2">{children}</div>
    </div>
);

const IntroModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 font-mono">
            <div className="bg-black text-green-400 shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-green-500" style={{ boxShadow: '0 0 25px rgba(0,255,0,0.5)' }}>
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-6" style={{ textShadow: '0 0 8px #00ff00' }}>Welcome to the Evolution of Emergent Computation</h1>
                
                <Section title="What is a Cellular Automaton?">
                    <p>
                        A cellular automaton is a grid of cells, each in a simple state (here, black for '0' or green for '1'). The state of each cell in the next time step is determined by a simple rule based on the states of its neighboring cells. Despite their simplicity, CAs can produce incredibly complex patterns.
                    </p>
                    <CARuleVisual />
                </Section>
                
                <Section title="The Goal: Density Classification">
                    <p>
                        The task for our CAs is 'density classification'. Given a random initial row, the CA must decide if the density of green cells ('1's) was greater than 50%. If so, the entire grid should turn green. If not, it should turn black. It's a surprisingly difficult computational task for such a simple system.
                    </p>
                </Section>

                <Section title="How 'Start Evolution' works">
                    <p>
                        This button kicks off a Genetic Algorithm (GA). The GA starts with a population of random CA rules. It tests how well each rule performs the density task (its 'fitness'). The best rules are 'bred' together (crossover) and slightly changed (mutation) to create a new generation. Over many generations, the GA 'evolves' highly sophisticated rules that can solve the task.
                    </p>
                </Section>
                
                <Section title="Understanding the Predefined Rules">
                    <ul className="list-inside space-y-1" style={{ listStyleType: '" > "' }}>
                        <li><strong>Majority Rule:</strong> Each cell adopts the state that is most common among its three neighbors (left, center, right). A simple, local 'voting' system.</li>
                        <li><strong>Block Expanding:</strong> A simple rule where continuous blocks of '1's tend to grow outwards.</li>
                        <li><strong>Particle-based:</strong> A good rule discovered by a genetic algorithm, similar to those found in the research paper. It uses 'particles' to communicate.</li>
                        <li><strong>GKL Rule:</strong> A mathematically constructed, robust rule known for its high performance on this task.</li>
                    </ul>
                </Section>

                <Section title="Emergent Computation & Particles">
                    <p>
                        The most successful evolved rules don't just 'average' the cells. Instead, they create patterns that act like <strong>'particles'</strong>—boundaries between regions of different local patterns.
                    </p>
                    <ul className="list-inside space-y-1 mt-2" style={{ listStyleType: '" > "' }}>
                        <li><strong>Particles:</strong> These are dynamic, persistent structures that move and interact, carrying information about the initial density. When particles collide, they can annihilate, pass through, or change each other.</li>
                        <li><strong>Transitions:</strong> Particles often form at the transitions (or domain walls) between regions of '0's and '1's.</li>
                        <li><strong>Information Processing:</strong> The final outcome (all black or all green) depends on the collective behavior and interactions of these emergent particles over time. This is a form of decentralized, emergent computation.</li>
                    </ul>
                </Section>
                
                <div className="text-center mt-8">
                    <button 
                        onClick={onClose}
                        className="bg-black border-2 border-green-500 text-green-500 font-bold py-3 px-8 uppercase tracking-widest transition-all duration-300 ease-in-out hover:bg-green-500 hover:text-black focus:outline-none focus:bg-green-500 focus:text-black"
                        style={{ boxShadow: '0 0 15px rgba(0,255,0,0.5)' }}
                    >
                        Start Simulation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntroModal;
