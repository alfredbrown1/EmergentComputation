import { Rule, Particle, ParticleType } from '../types';

export class CellularAutomaton {
    size: number;
    rule: Rule;
    configuration: number[];
    history: number[][];
    particles: Particle[];
    initialDensity: number;
    correctClassification: 0 | 1;

    constructor(size: number, rule?: Rule) {
        this.size = size;
        this.rule = rule || this.generateRandomRule();
        this.configuration = new Array(size);
        this.history = [];
        this.particles = [];
        this.initialDensity = 0;
        this.correctClassification = 0;
        this.reset();
    }

    generateRandomRule(): Rule {
        const rule = new Array(128);
        for (let i = 0; i < 128; i++) {
            rule[i] = fxrand() < 0.5 ? 0 : 1;
        }
        return rule;
    }

    reset() {
        const density = fxrand();
        this.configuration = Array.from({ length: this.size }, () => (fxrand() < density ? 1 : 0));
        this.history = [this.configuration.slice()];
        this.initialDensity = this.getDensity();
        this.correctClassification = this.initialDensity > 0.5 ? 1 : 0;
    }

    getDensity(): number {
        if (this.configuration.length === 0) return 0;
        return this.configuration.reduce((sum, cell) => sum + cell, 0) / this.size;
    }

    getNeighborhood(i: number): number {
        const left = this.configuration[(i - 1 + this.size) % this.size];
        const center = this.configuration[i];
        const right = this.configuration[(i + 1) % this.size];
        return (left << 2) | (center << 1) | right;
    }
    
    getNeighborhoodForHistory(config: number[], i: number): number {
        const left3 = config[(i - 3 + this.size) % this.size];
        const left2 = config[(i - 2 + this.size) % this.size];
        const left1 = config[(i - 1 + this.size) % this.size];
        const center = config[i];
        const right1 = config[(i + 1) % this.size];
        const right2 = config[(i + 2) % this.size];
        const right3 = config[(i + 3) % this.size];
        return (left3 << 6) | (left2 << 5) | (left1 << 4) | (center << 3) | (right1 << 2) | (right2 << 1) | right3;
    }


    step() {
        const newConfiguration = new Array(this.size);
        const currentConfig = this.configuration;
        
        for (let i = 0; i < this.size; i++) {
            const neighborhood = this.getNeighborhoodForHistory(currentConfig, i);
            newConfiguration[i] = this.rule[neighborhood];
        }
        
        this.configuration = newConfiguration;
        this.history.push(this.configuration.slice());
        this.detectParticles();
    }

    detectParticles() {
        this.particles = [];
        const config = this.configuration;
        for (let i = 0; i < this.size; i++) {
            // A particle is often a boundary between domains
            const prevCell = config[(i - 1 + this.size) % this.size];
            const currentCell = config[i];
            
            if (prevCell !== currentCell) { // Found a domain wall
                const nextCell = config[(i + 1) % this.size];
                const pattern = (prevCell << 2) | (currentCell << 1) | nextCell;
                let type: ParticleType = 'domain'; // default
                
                // Simplified classification based on local patterns around the wall.
                // These patterns often correspond to particles that carry information.
                switch (pattern) {
                    case 0b001: // a boundary moving right in a sea of 0s
                    case 0b011:
                        type = 'alpha'; 
                        break; 
                    
                    case 0b110: // a boundary moving left in a sea of 1s
                    case 0b100: 
                        type = 'gamma'; 
                        break; 

                    case 0b010: // an isolated '1'
                    case 0b101: // an isolated '0'
                        type = 'beta'; // often unstable, transient particles
                        break;
                }
                
                this.particles.push({
                    position: i,
                    type: type,
                    velocity: 0 // True velocity calculation is complex
                });
            }
        }
    }


    getFitness(): number {
        if (this.history.length < 10) return 0;
        
        const finalConfig = this.history[this.history.length - 1];
        const allOnes = finalConfig.every(cell => cell === 1);
        const allZeros = finalConfig.every(cell => cell === 0);

        if (allOnes) return this.correctClassification === 1 ? 1.0 : 0.0;
        if (allZeros) return this.correctClassification === 0 ? 1.0 : 0.0;
        
        return 0.5; // Ambiguous or not converged to a clear result
    }

    isConverged(): boolean {
        if (this.history.length < 5) return false;
        const recent = this.history.slice(-5);
        const firstConfigStr = JSON.stringify(recent[0]);
        return recent.every(config => JSON.stringify(config) === firstConfigStr);
    }
}

export class GeneticAlgorithm {
    populationSize: number;
    mutationRate: number;
    population: Rule[];
    generation: number;
    bestFitness: number;
    bestRule: Rule | null;
    fitnessHistory: number[];

    constructor(populationSize = 50, mutationRate = 0.02) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.population = [];
        this.generation = 0;
        this.bestFitness = 0;
        this.bestRule = null;
        this.fitnessHistory = [];
        this.initialize();
    }

    initialize() {
        this.population = Array.from({ length: this.populationSize }, () => this.generateRandomRule());
        this.generation = 0;
        this.bestFitness = 0;
        this.bestRule = null;
        this.fitnessHistory = [];
    }

    generateRandomRule(): Rule {
        return Array.from({ length: 128 }, () => (fxrand() < 0.5 ? 0 : 1));
    }

    evaluateFitness(rule: Rule, latticeSize: number): number {
        let totalFitness = 0;
        const testCases = 10;
        
        for (let test = 0; test < testCases; test++) {
            const ca = new CellularAutomaton(latticeSize, rule);
            const maxSteps = Math.floor(latticeSize * 1.5);
            for (let step = 0; step < maxSteps && !ca.isConverged(); step++) {
                ca.step();
            }
            totalFitness += ca.getFitness();
        }
        
        return totalFitness / testCases;
    }

    evolve(latticeSize: number) {
        const fitnessScores = this.population.map(rule => ({
            rule,
            fitness: this.evaluateFitness(rule, latticeSize)
        }));

        fitnessScores.sort((a, b) => b.fitness - a.fitness);
        
        if (fitnessScores[0].fitness >= this.bestFitness) {
            this.bestFitness = fitnessScores[0].fitness;
            this.bestRule = fitnessScores[0].rule.slice();
        }

        this.fitnessHistory.push(this.bestFitness);

        const newPopulation: Rule[] = [];
        const eliteCount = Math.floor(this.populationSize * 0.1);
        
        for (let i = 0; i < eliteCount; i++) {
            newPopulation.push(fitnessScores[i].rule.slice());
        }

        while (newPopulation.length < this.populationSize) {
            const parent1 = this.tournamentSelect(fitnessScores);
            const parent2 = this.tournamentSelect(fitnessScores);
            const offspring = this.crossover(parent1, parent2);
            this.mutate(offspring);
            newPopulation.push(offspring);
        }

        this.population = newPopulation;
        this.generation++;
    }

    tournamentSelect(fitnessScores: {rule: Rule, fitness: number}[], tournamentSize = 5): Rule {
        let best = null;
        let bestFitness = -1;
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(fxrand() * fitnessScores.length);
            const individual = fitnessScores[randomIndex];
            if (individual.fitness > bestFitness) {
                best = individual.rule;
                bestFitness = individual.fitness;
            }
        }
        return best!;
    }

    crossover(parent1: Rule, parent2: Rule): Rule {
        const crossoverPoint = Math.floor(fxrand() * 128);
        const offspring = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
        return offspring;
    }

    mutate(rule: Rule) {
        for (let i = 0; i < rule.length; i++) {
            if (fxrand() < this.mutationRate) {
                rule[i] = 1 - rule[i];
            }
        }
    }
}
