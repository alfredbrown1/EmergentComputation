
export type Rule = number[];

export type ParticleType = 'alpha' | 'beta' | 'gamma' | 'domain';

export interface Particle {
    position: number;
    type: ParticleType;
    velocity: number;
}