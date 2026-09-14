import type { CinematicKeyframe } from './types';

export const CINEMATIC_KEYFRAMES: CinematicKeyframe[] = [
  { progress: 0, scene: 'reveal', position: [5.2, 2.3, 9.4], target: [0.8, 1.4, 0.1], fov: 45, roll: 0, label: 'The first frame' },
  { progress: 0.07, scene: 'orbit', position: [4.9, 2.3, 8.0], target: [1.25, 1.4, 0.1], fov: 43, roll: -0.01, label: 'See the whole instrument' },
  { progress: 0.14, scene: 'orbit', position: [3.3, 2.0, 5.1], target: [1.85, 1.4, 0.5], fov: 39, roll: 0.01, label: 'Built to make ideas move' },
  { progress: 0.2, scene: 'lens', position: [2.55, 1.68, 3.15], target: [2.2, 1.42, 0.74], fov: 34, roll: 0, label: 'Follow the signal' },
  { progress: 0.25, scene: 'portal', position: [2.2, 1.45, 1.55], target: [2.2, 1.45, 0.05], fov: 29, roll: 0, label: 'Find the focus' },
  { progress: 0.3, scene: 'portal', position: [2.2, 1.45, -1.65], target: [2.2, 1.45, -5], fov: 43, roll: 0, label: 'Enter the lens' },
  { progress: 0.34, scene: 'doors', position: [6.2, 3.0, -10.5], target: [0, 4.55, -20], fov: 43, roll: -0.01, label: 'A bigger room' },
  { progress: 0.43, scene: 'doors', position: [4.45, 2.45, -14.0], target: [0, 4.35, -20], fov: 39, roll: 0.01, label: 'Make room for the idea' },
  { progress: 0.49, scene: 'passage', position: [2.35, 2.55, -17.25], target: [0, 3.7, -27], fov: 38, roll: 0, label: 'Hold the frame' },
  { progress: 0.56, scene: 'passage', position: [0.85, 2.35, -19.0], target: [0, 3.0, -30.5], fov: 37, roll: 0, label: 'Open sesame' },
  { progress: 0.64, scene: 'world', position: [0, 1.85, -23], target: [0, 2.05, -32], fov: 40, roll: 0, label: 'Step into UFirst' },
  { progress: 0.74, scene: 'services', position: [-3.45, 2.3, -31], target: [0, 2.2, -36], fov: 42, roll: 0.015, label: 'Every angle connected' },
  { progress: 0.84, scene: 'work', position: [3.2, 2.1, -39], target: [0, 2.05, -45], fov: 44, roll: -0.012, label: 'Make it real' },
  { progress: 0.94, scene: 'exit', position: [-1.6, 1.8, -47], target: [0, 2, -52], fov: 47, roll: 0, label: 'Built for the real world' },
  { progress: 1, scene: 'exit', position: [0, 1.6, -55], target: [0, 1.6, -60], fov: 50, roll: 0, label: 'Great work gets remembered' },
];
