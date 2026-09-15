import type { CinematicKeyframe } from './types';

export const CINEMATIC_KEYFRAMES: CinematicKeyframe[] = [
  { progress: 0, scene: 'reveal', position: [8, 4, 16], target: [0, 0, -4.5], fov: 45, roll: 0, label: 'Outside / The first frame' },
  { progress: 0.08, scene: 'reveal', position: [5, 2.5, 8], target: [0, 0, -2], fov: 42, roll: -0.012, label: 'Lens / Earn attention' },
  { progress: 0.15, scene: 'system', position: [1.6, 0.6, 4.4], target: [0, 0, -1.2], fov: 40, roll: 0.009, label: 'Inside / Find the focus' },
  { progress: 0.22, scene: 'about', position: [0.3, 0.1, 1.2], target: [0, 0, -2.3], fov: 44, roll: -0.006, label: 'Aperture / Enter the lens' },
  { progress: 0.28, scene: 'doors', position: [1.35, 0.55, 1.25], target: [0, 0, -3.35], fov: 48, roll: 0.006, label: 'Doors / Approach the threshold' },
  { progress: 0.36, scene: 'doors', position: [0.72, 0.24, 0.72], target: [0, 0, -3.72], fov: 51, roll: -0.003, label: 'Doors / Open the next frame' },
  { progress: 0.43, scene: 'services', position: [0.38, -0.08, 0.5], target: [0, 0, -4.18], fov: 55, roll: 0.004, label: 'Passage / Enter the system' },
  { progress: 0.52, scene: 'services', position: [0.92, -0.28, 0.22], target: [0, 0, -4.85], fov: 60, roll: -0.006, label: 'Shutter / Make the move' },
  { progress: 0.62, scene: 'work', position: [-1.18, 0.5, -0.2], target: [0, 0, -5.75], fov: 61, roll: 0.005, label: 'Sensor / Turn insight into work' },
  { progress: 0.72, scene: 'process', position: [1.05, -0.38, -0.92], target: [0, -0.1, -6.72], fov: 60, roll: -0.005, label: 'Processor / Build the idea' },
  { progress: 0.82, scene: 'process', position: [-0.92, 0.34, -1.9], target: [0, 0, -7.72], fov: 58, roll: 0.004, label: 'Memory / Carry it forward' },
  { progress: 0.9, scene: 'contact', position: [0.5, 0.62, -3.25], target: [0, 0.1, -8.82], fov: 52, roll: -0.004, label: 'Viewfinder / See what is possible' },
  { progress: 0.95, scene: 'contact', position: [1, 0.9, -5.35], target: [0, 0.1, -9.2], fov: 49, roll: 0.003, label: 'Reassembly / Bring it together' },
  { progress: 1, scene: 'exit', position: [5.5, 3.4, -13], target: [0, 0, -7], fov: 48, roll: 0, label: 'Outside / Start the conversation' },
];

function viewportPath(viewport: 'tablet' | 'mobile') {
  return CINEMATIC_KEYFRAMES.map((frame) => {
    const [x, y, z] = frame.position;
    const [targetX, targetY, targetZ] = frame.target;
    if (viewport === 'mobile') {
      return {
        ...frame,
        position: [x * 0.56, y + 0.22, z + (frame.progress < 0.32 ? 2.2 : 2.6)] as [number, number, number],
        target: [targetX * 0.72, targetY + 0.18, targetZ] as [number, number, number],
        // A narrow viewport needs a much wider vertical lens to preserve the
        // same physical width of the camera passage on a phone.
        fov: Math.min(90, frame.fov + 40),
        roll: frame.roll * 0.55,
      };
    }
    return {
      ...frame,
      position: [x * 0.82, y + 0.12, z + (frame.progress < 0.32 ? 0.35 : 0.72)] as [number, number, number],
      target: [targetX * 0.88, targetY + 0.08, targetZ] as [number, number, number],
      fov: frame.fov + 3,
      roll: frame.roll * 0.78,
    };
  });
}

// These are deliberately separate camera compositions, not a CSS scale of
// the desktop canvas: mobile protects the lens passage and text clearance,
// while tablet keeps a wider physical silhouette in the first and final shots.
export const CINEMATIC_KEYFRAMES_TABLET: CinematicKeyframe[] = viewportPath('tablet');
export const CINEMATIC_KEYFRAMES_MOBILE: CinematicKeyframe[] = viewportPath('mobile');
