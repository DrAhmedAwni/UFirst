import type { CinematicKeyframe } from './types';

export const CINEMATIC_KEYFRAMES: CinematicKeyframe[] = [
  { progress: 0, scene: 'reveal', position: [8, 4, 16], target: [0, 0, -4.5], fov: 45, roll: 0, label: 'Outside / The first frame' },
  { progress: 0.08, scene: 'reveal', position: [5, 2.5, 8], target: [0, 0, -2], fov: 42, roll: -0.012, label: 'Lens / Earn attention' },
  { progress: 0.17, scene: 'system', position: [1.2, 0.5, 3.2], target: [0, 0, -1.1], fov: 40, roll: 0.009, label: 'Inside / Find the focus' },
  { progress: 0.25, scene: 'about', position: [-0.35, 0.15, 1.9], target: [0, 0, -1.55], fov: 48, roll: -0.006, label: 'Aperture / Focus the story' },
  { progress: 0.35, scene: 'services', position: [0.55, -0.2, -0.5], target: [0, 0, -2.8], fov: 43, roll: 0.008, label: 'Shutter / Make the move' },
  { progress: 0.45, scene: 'services', position: [-0.5, 0.2, -2.1], target: [0, 0, -4.2], fov: 44, roll: -0.008, label: 'Sensor / See the signal' },
  { progress: 0.55, scene: 'work', position: [0.45, -0.25, -3.75], target: [0, 0, -5.7], fov: 44, roll: 0.007, label: 'Sensor / Turn insight into work' },
  { progress: 0.65, scene: 'work', position: [-0.45, 0.25, -4.7], target: [0, 0, -5.75], fov: 45, roll: -0.007, label: 'Processor / Build the idea' },
  { progress: 0.75, scene: 'process', position: [0.42, -0.18, -5.75], target: [0, 0, -7.15], fov: 46, roll: 0.006, label: 'Memory / Carry it forward' },
  { progress: 0.84, scene: 'process', position: [-0.35, 0.18, -6.85], target: [0, 0, -9], fov: 46, roll: -0.006, label: 'Output / Put it in motion' },
  { progress: 0.94, scene: 'contact', position: [0.7, 0.8, -8.35], target: [0, 0.15, -9.35], fov: 46, roll: 0.004, label: 'Viewfinder / See what is possible' },
  { progress: 1, scene: 'exit', position: [5.5, 3.4, -13], target: [0, 0, -7], fov: 48, roll: 0, label: 'Outside / Start the conversation' },
];
