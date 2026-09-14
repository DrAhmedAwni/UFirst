import { clamp, smooth } from '../scene-motion';
import type { CinematicSceneName } from './types';

export const CINEMATIC_RANGES: Array<{ scene: CinematicSceneName; from: number; to: number; label: string }> = [
  { scene: 'reveal', from: 0, to: 0.06, label: 'Darkness / Camera reveal' },
  { scene: 'orbit', from: 0.06, to: 0.12, label: 'Orbit / Physical camera' },
  { scene: 'lens', from: 0.12, to: 0.2, label: 'Lens / Approach' },
  { scene: 'portal', from: 0.2, to: 0.3, label: 'Aperture / Portal' },
  { scene: 'doors', from: 0.3, to: 0.49, label: 'Architecture / Monumental doors' },
  { scene: 'passage', from: 0.49, to: 0.64, label: 'Open sesame / Passage' },
  { scene: 'world', from: 0.64, to: 0.74, label: 'UFirst / Company world' },
  { scene: 'services', from: 0.74, to: 0.84, label: 'Capabilities / Services' },
  { scene: 'work', from: 0.84, to: 0.94, label: 'Selected work / Installations' },
  { scene: 'exit', from: 0.94, to: 1, label: 'Exit / Back to the work' },
];

export function progressFromElement(element: HTMLElement, viewportHeight: number) {
  return clamp(-element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - viewportHeight));
}

export function sceneAt(progress: number) {
  const current = CINEMATIC_RANGES.find((range) => progress >= range.from && progress <= range.to);
  return current ?? CINEMATIC_RANGES[CINEMATIC_RANGES.length - 1];
}

export function localSceneProgress(progress: number, from: number, to: number) {
  return smooth(clamp((progress - from) / Math.max(to - from, 0.0001)));
}

