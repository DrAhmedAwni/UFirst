import type { Group, Object3D, Texture, Vector3 } from 'three';

export type CinematicSceneName =
  | 'reveal'
  | 'orbit'
  | 'lens'
  | 'portal'
  | 'doors'
  | 'passage'
  | 'world'
  | 'services'
  | 'work'
  | 'exit';

export type CinematicKeyframe = {
  progress: number;
  scene: CinematicSceneName;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  roll: number;
  label: string;
};

export type CinematicSample = {
  position: Vector3;
  target: Vector3;
  fov: number;
  roll: number;
  scene: CinematicSceneName;
};

export type CinematicAssetUrls = {
  brand: string;
  creative: string;
  production: string;
  social: string;
  growth: string;
  projects: string[];
};

export type CinematicWorld = {
  update: (progress: number, delta: number) => void;
  dispose: () => void;
  roots: Group[];
  textures: Texture[];
  getPrimaryObjects: () => Object3D[];
};
