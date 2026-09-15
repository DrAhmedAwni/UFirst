import type { Group, Object3D, Texture, Vector3 } from 'three';

export type CinematicSceneName =
  | 'reveal'
  | 'system'
  | 'about'
  | 'doors'
  | 'services'
  | 'work'
  | 'process'
  | 'contact'
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
  hero: string;
  cameraModel: string;
  cameraModelMobile: string;
  cameraModelDistant: string;
  cameraBodyAlbedo: string;
  cameraBodyNormal: string;
  cameraBodyRoughness: string;
  cameraExterior: string;
  cameraExploded: string;
  about: string;
  system: string[];
  services: string[];
  projects: string[];
  contact: string;
};

export type CinematicWorld = {
  update: (progress: number, delta: number) => void;
  setPointer?: (x: number, y: number) => void;
  dispose: () => void;
  roots: Group[];
  textures: Texture[];
  getPrimaryObjects: () => Object3D[];
};
