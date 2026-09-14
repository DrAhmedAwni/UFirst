import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { CINEMATIC_KEYFRAMES } from './camera-keyframes';
import type { CinematicSample } from './types';

function timelineValue(progress: number, key: 'fov' | 'roll') {
  const first = CINEMATIC_KEYFRAMES[0];
  const last = CINEMATIC_KEYFRAMES[CINEMATIC_KEYFRAMES.length - 1];
  if (progress <= first.progress) return first[key];
  if (progress >= last.progress) return last[key];
  for (let index = 1; index < CINEMATIC_KEYFRAMES.length; index += 1) {
    const current = CINEMATIC_KEYFRAMES[index];
    const previous = CINEMATIC_KEYFRAMES[index - 1];
    if (progress <= current.progress) {
      const t = MathUtils.smoothstep((progress - previous.progress) / (current.progress - previous.progress), 0, 1);
      return MathUtils.lerp(previous[key], current[key], t);
    }
  }
  return last[key];
}

export class CameraRig {
  private readonly positionPath = new CatmullRomCurve3(CINEMATIC_KEYFRAMES.map((frame) => new Vector3(...frame.position)), false, 'centripetal', 0.35);
  private readonly targetPath = new CatmullRomCurve3(CINEMATIC_KEYFRAMES.map((frame) => new Vector3(...frame.target)), false, 'centripetal', 0.35);
  private readonly position = new Vector3();
  private readonly pathTarget = new Vector3();
  private readonly currentTarget = new Vector3();

  sample(progress: number, aspect: number): CinematicSample {
    const value = MathUtils.clamp(progress, 0, 1);
    this.positionPath.getPointAt(value, this.position);
    this.targetPath.getPointAt(value, this.pathTarget);
    const portrait = aspect < 0.78;
    if (portrait) {
      this.position.x *= 0.56;
      this.position.y += 0.22;
      this.position.z += value < 0.32 ? 0.65 : 1.15;
      this.pathTarget.x *= 0.72;
      this.pathTarget.y += 0.18;
    }
    return {
      position: this.position.clone(),
      target: this.pathTarget.clone(),
      fov: timelineValue(value, 'fov') + (portrait ? 7 : aspect < 1.1 ? 3 : 0),
      roll: timelineValue(value, 'roll') * (portrait ? 0.55 : 1),
      scene: CINEMATIC_KEYFRAMES.reduce((current, frame) => value >= frame.progress ? frame : current, CINEMATIC_KEYFRAMES[0]).scene,
    };
  }

  apply(camera: PerspectiveCamera, progress: number, aspect: number, smoothing = 1) {
    const sample = this.sample(progress, aspect);
    camera.position.lerp(sample.position, smoothing);
    this.currentTarget.lerp(sample.target, smoothing);
    camera.lookAt(this.currentTarget);
    camera.rotateZ(sample.roll * smoothing);
    camera.fov = MathUtils.lerp(camera.fov, sample.fov, smoothing);
    camera.updateProjectionMatrix();
    return sample;
  }
}
