import type { CinematicKeyframe } from './types';

export const CINEMATIC_KEYFRAMES: CinematicKeyframe[] = [
  { progress: 0, scene: 'reveal', position: [8, 4, 16], target: [0, 0, -4.5], fov: 45, roll: 0, label: 'Outside / The first frame' },
  { progress: 0.08, scene: 'reveal', position: [5, 2.5, 8], target: [0, 0, -2], fov: 42, roll: -0.012, label: 'Lens / Earn attention' },
  { progress: 0.15, scene: 'system', position: [1.6, 0.6, 4.4], target: [0, 0, -1.2], fov: 40, roll: 0.009, label: 'Inside / Find the focus' },
  { progress: 0.22, scene: 'about', position: [0.3, 0.1, 1.2], target: [0, 0, -2.3], fov: 44, roll: -0.006, label: 'Aperture / Enter the lens' },
  { progress: 0.28, scene: 'doors', position: [0.9, 0.4, -0.2], target: [0, 0, -3.55], fov: 43, roll: 0.008, label: 'Doors / Approach the threshold' },
  { progress: 0.36, scene: 'doors', position: [0, 0.1, -1.4], target: [0, 0, -3.65], fov: 40, roll: -0.004, label: 'Doors / Open the next frame' },
  { progress: 0.43, scene: 'services', position: [0, -0.1, -2.2], target: [0, 0, -4.25], fov: 42, roll: 0.006, label: 'Passage / Enter the system' },
  { progress: 0.52, scene: 'services', position: [0.4, -0.2, -3.1], target: [0, 0, -4.5], fov: 44, roll: -0.008, label: 'Shutter / Make the move' },
  { progress: 0.62, scene: 'work', position: [-0.3, 0.2, -4.1], target: [0, 0, -5.8], fov: 44, roll: 0.007, label: 'Sensor / Turn insight into work' },
  { progress: 0.72, scene: 'process', position: [0.4, -0.2, -5.2], target: [0, 0, -6.8], fov: 45, roll: -0.007, label: 'Processor / Build the idea' },
  { progress: 0.82, scene: 'process', position: [-0.3, 0.2, -6.3], target: [0, 0, -8], fov: 46, roll: 0.006, label: 'Memory / Carry it forward' },
  { progress: 0.9, scene: 'contact', position: [0.5, 0.7, -8], target: [0, 0.1, -9.2], fov: 46, roll: -0.006, label: 'Viewfinder / See what is possible' },
  { progress: 0.95, scene: 'contact', position: [1, 1, -9], target: [0, 0.1, -9.35], fov: 46, roll: 0.004, label: 'Reassembly / Bring it together' },
  { progress: 1, scene: 'exit', position: [5.5, 3.4, -13], target: [0, 0, -7], fov: 48, roll: 0, label: 'Outside / Start the conversation' },
];
