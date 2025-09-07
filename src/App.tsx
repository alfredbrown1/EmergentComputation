import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Rule } from './types';
import { CellularAutomaton, GeneticAlgorithm } from './services/simulation';
import { PREDEFINED_RULES } from './constants';
import Controls from './components/Controls';
import CADisplay from './components/CADisplay';
import EvolutionPanel from './components/EvolutionPanel';
import InfoPanel from './components/InfoPanel';
import IntroModal from './components/IntroModal';

const App: React.FC = () => {
    const [showIntro, setShowIntro] = useState<boolean>(true);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [evolutionMode, setEvolutionMode] = useState<boolean>(false);
    const [latticeSize, setLatticeSize] = useState<number>(149);
    const [speed, setSpeed] = useState<number>(500);

    // GA State
    const gaRef = useRef<GeneticAlgorithm>(new GeneticAlgorithm());
    const [generation, setGeneration] = useState<number>(0);
    const [bestFitness, setBestFitness] = useState<number>(0);
    const [bestRule, setBestRule] = useState<Rule | null>(null);
    const [fitnessHistory, setFitnessHistory] = useState<number[]>([]);

    // CA State
    const caRef = useRef<CellularAutomaton | null>(null);
    const [caHistory, setCaHistory] = useState<number[][]>([]);
    const [caParticles, setCaParticles] = useState<any[]>([]);
    const [initialDensity, setInitialDensity] = useState<number>(0);
    const [classification, setClassification] = useState<string>('-');

    const animationFrameRef = useRef<number | null>(null);
    const previewCalledRef = useRef<boolean>(false);

    // Effect for fxhash preview capture
    useEffect(() => {
        // When the CA has run for a bit and the modal is closed, take a snapshot.
        if (caHistory.length > 50 && !showIntro && !previewCalledRef.current) {
            fxpreview();
            previewCalledRef.current = true; // Ensure it's only called once
        }
    }, [caHistory, showIntro]);


    const updateCAState = useCallback(() => {
        if (!caRef.current) return;
        setCaHistory([...caRef.current.history]);
        setCaParticles([...caRef.current.particles]);
        setInitialDensity(caRef.current.initialDensity);
        
        const finalConfig = caRef.current.history[caRef.current.history.length - 1];
        if (finalConfig) {
            const allOnes = finalConfig.every(cell => cell === 1);
            const allZeros = finalConfig.every(cell => cell === 0);
            if (allOnes) setClassification('ALL 1s');
            else if (allZeros) setClassification('ALL 0s');
            else setClassification('MIXED');
        }
    }, []);
    
    const runCAAnimation = useCallback(() => {
        if (caRef.current && !caRef.current.isConverged() && caRef.current.history.length < 200) {
            caRef.current.step();
            updateCAState();
            const delay = Math.max(10, 1010 - speed);
            animationFrameRef.current = window.setTimeout(runCAAnimation, delay);
        } else {
             if (isRunning && !evolutionMode) setIsRunning(false);
        }
    }, [speed, updateCAState, isRunning, evolutionMode]);

    const stopAnimation = useCallback(() => {
        if (animationFrameRef.current) {
            clearTimeout(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);

    const runEvolutionStep = useCallback(() => {
        gaRef.current.evolve(latticeSize);
        setGeneration(gaRef.current.generation);
        setBestFitness(gaRef.current.bestFitness);
        setBestRule(gaRef.current.bestRule);
        setFitnessHistory([...gaRef.current.fitnessHistory]);

        if (gaRef.current.bestRule) {
            caRef.current = new CellularAutomaton(latticeSize, gaRef.current.bestRule);
            for (let i = 0; i < latticeSize; i++) {
                caRef.current.step();
            }
            updateCAState();
        }

        const delay = Math.max(50, 2000 - speed);
        animationFrameRef.current = window.setTimeout(runEvolutionStep, delay);
    }, [latticeSize, speed, updateCAState]);


    useEffect(() => {
        return stopAnimation;
    }, [stopAnimation]);


    const handleStartEvolution = () => {
        stopAnimation();
        setEvolutionMode(true);
        setIsRunning(true);
        runEvolutionStep();
    };

    const handlePause = () => {
        if (isRunning) {
            stopAnimation();
            setIsRunning(false);
        } else {
            setIsRunning(true);
            if(evolutionMode) {
                 runEvolutionStep();
            } else {
                 runCAAnimation();
            }
        }
    };

    const handleReset = () => {
        stopAnimation();
        setIsRunning(false);
        setEvolutionMode(false);
        gaRef.current.initialize();
        setGeneration(0);
        setBestFitness(0);
        setBestRule(null);
        setFitnessHistory([]);
        caRef.current = null;
        setCaHistory([]);
        setCaParticles([]);
        setInitialDensity(0);
        setClassification('-');
    };

    const runSimulationWithRule = (rule: Rule | null) => {
        stopAnimation();
        setEvolutionMode(false);
        caRef.current = new CellularAutomaton(latticeSize, rule || undefined);
        updateCAState();
        setIsRunning(true);
        runCAAnimation();
    }
    
    const handleRunBestCA = () => {
        if (bestRule) {
            runSimulationWithRule(bestRule);
        }
    };
    
    const handleRuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ruleName = e.target.value;
        const rule = PREDEFINED_RULES[ruleName] || null;
        runSimulationWithRule(rule);
    };

    const handleCloseIntro = () => {
        setShowIntro(false);
        // Start with a deterministic rule for a consistent first experience
        const ruleKey = Object.keys(PREDEFINED_RULES)[Math.floor(fxrand() * Object.keys(PREDEFINED_RULES).length)];
        runSimulationWithRule(PREDEFINED_RULES[ruleKey] || null);
    };

    return (
        <div className="bg-black text-green-400 min-h-screen p-4 sm:p-6 lg:p-8 font-mono">
            {showIntro && <IntroModal onClose={handleCloseIntro} />}
            <div className="max-w-7xl mx-auto bg-black border-2 border-green-500/30 p-6">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold" style={{ textShadow: '0 0 8px #00ff00' }}>Evolution of Emergent Computation</h1>
                    <p className="mt-2 text-lg text-green-300/80">
                        Visualizing genetic algorithms discovering cellular automata for density classification
                    </p>
                </header>
                
                <Controls
                    onStart={handleStartEvolution}
                    onPause={handlePause}
                    onReset={handleReset}
                    onRunBest={handleRunBestCA}
                    onRuleChange={handleRuleChange}
                    onLatticeSizeChange={(e) => setLatticeSize(parseInt(e.target.value))}
                    onSpeedChange={(e) => setSpeed(parseInt(e.target.value))}
                    isRunning={isRunning}
                    evolutionMode={evolutionMode}
                    latticeSize={latticeSize}
                    speed={speed}
                    bestRuleExists={!!bestRule}
                />

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <CADisplay history={caHistory} particles={caParticles} size={latticeSize} />
                    </div>
                    <div>
                        <EvolutionPanel
                            generation={generation}
                            bestFitness={bestFitness}
                            initialDensity={initialDensity}
                            classification={classification}
                            bestRule={bestRule}
                            fitnessHistory={fitnessHistory}
                        />
                    </div>
                </main>
                
                <InfoPanel />
            </div>
        </div>
    );
};

export default App;
