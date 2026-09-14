import { clamp, smooth } from '../scene-motion';
import type { CinematicSceneName } from './types';

export const CINEMATIC_RANGES: Array<{ scene: CinematicSceneName; from: number; to: number; label: string }> = [
  { scene: 'reveal', from: 0, to: 0.07, label: 'Outside / The first frame' },
  { scene: 'system', from: 0.07, to: 0.18, label: 'Lens / Earn attention' },
  { scene: 'about', from: 0.18, to: 0.28, label: 'Aperture / Focus the story' },
  { scene: 'services', from: 0.28, to: 0.39, label: 'Shutter / Make the move' },
  { scene: 'work', from: 0.39, to: 0.54, label: 'Sensor / Turn insight into work' },
  { scene: 'process', from: 0.54, to: 0.69, label: 'Processor / Build the idea' },
  { scene: 'contact', from: 0.69, to: 0.83, label: 'Memory / Carry it forward' },
  { scene: 'contact', from: 0.83, to: 0.95, label: 'Viewfinder / See what is possible' },
  { scene: 'exit', from: 0.95, to: 1, label: 'Outside / Start the conversation' },
];

export function progressFromElement(element: HTMLElement, viewportHeight: number) {
  return clamp(-element.getBoundingClientRect().top / Math.max(1, element.offsetHeight - viewportHeight));
}

export function progressFromDocument() {
  return clamp(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
}

export function sceneAt(progress: number) {
  const current = CINEMATIC_RANGES.find((range) => progress >= range.from && progress <= range.to);
  return current ?? CINEMATIC_RANGES[CINEMATIC_RANGES.length - 1];
}

export function localSceneProgress(progress: number, from: number, to: number) {
  return smooth(clamp((progress - from) / Math.max(to - from, 0.0001)));
}
