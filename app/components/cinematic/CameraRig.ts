import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { CINEMATIC_KEYFRAMES, CINEMATIC_KEYFRAMES_MOBILE, CINEMATIC_KEYFRAMES_TABLET } from './camera-keyframes';
import type { CinematicSample } from './types';

function timelineValue(progress: number, key: 'fov' | 'roll', keyframes: typeof CINEMATIC_KEYFRAMES) {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (progress <= first.progress) return first[key];
  if (progress >= last.progress) return last[key];
  for (let index = 1; index < keyframes.length; index += 1) {
    const current = keyframes[index];
    const previous = keyframes[index - 1];
    if (progress <= current.progress) {
      const t = MathUtils.smoothstep((progress - previous.progress) / (current.progress - previous.progress), 0, 1);
      return MathUtils.lerp(previous[key], current[key], t);
    }
  }
  return last[key];
}

function pathValue(progress: number, key: 'position' | 'target', output: Vector3, keyframes: typeof CINEMATIC_KEYFRAMES) {
  const value = MathUtils.clamp(progress, 0, 1);
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (value <= first.progress) {
    output.set(...first[key]);
    return output;
  }
  if (value >= last.progress) {
    output.set(...last[key]);
    return output;
  }
  for (let index = 1; index < keyframes.length; index += 1) {
    const current = keyframes[index];
    const previous = keyframes[index - 1];
    if (value <= current.progress) {
      const t = MathUtils.smoothstep((value - previous.progress) / (current.progress - previous.progress), 0, 1);
      const before = keyframes[Math.max(0, index - 2)][key];
      const after = keyframes[Math.min(keyframes.length - 1, index + 1)][key];
      const p0 = before;
      const p1 = previous[key];
      const p2 = current[key];
      const p3 = after;
      const t2 = t * t;
      const t3 = t2 * t;

      // A Catmull–Rom segment keeps the lens approach,
      // threshold passage, and exit in one fluid camera journey without
      // introducing a separate animation state or scroll lock.
      output.set(
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
        0.5 * ((2 * p1[2]) + (-p0[2] + p2[2]) * t + (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 + (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3),
      );
      return output;
    }
  }
  output.set(...last[key]);
  return output;
}

export class CameraRig {
  private readonly position = new Vector3();
  private readonly pathTarget = new Vector3();
  private readonly currentTarget = new Vector3();
  private initialized = false;

  sample(progress: number, aspect: number): CinematicSample {
    const value = MathUtils.clamp(progress, 0, 1);
    const keyframes = aspect < 0.78 ? CINEMATIC_KEYFRAMES_MOBILE : aspect < 1.1 ? CINEMATIC_KEYFRAMES_TABLET : CINEMATIC_KEYFRAMES;
    pathValue(value, 'position', this.position, keyframes);
    pathValue(value, 'target', this.pathTarget, keyframes);
    return {
      position: this.position.clone(),
      target: this.pathTarget.clone(),
      fov: timelineValue(value, 'fov', keyframes),
      roll: timelineValue(value, 'roll', keyframes),
      scene: keyframes.reduce((current, frame) => value >= frame.progress ? frame : current, keyframes[0]).scene,
    };
  }

  apply(camera: PerspectiveCamera, progress: number, aspect: number, smoothing = 1) {
    const sample = this.sample(progress, aspect);
    if (!this.initialized) {
      camera.position.copy(sample.position);
      this.currentTarget.copy(sample.target);
      camera.lookAt(this.currentTarget);
      camera.rotateZ(sample.roll);
      camera.aspect = aspect;
      camera.fov = sample.fov;
      camera.updateProjectionMatrix();
      this.initialized = true;
      return sample;
    }
    camera.position.lerp(sample.position, smoothing);
    this.currentTarget.lerp(sample.target, smoothing);
    camera.lookAt(this.currentTarget);
    camera.rotateZ(sample.roll * smoothing);
    camera.aspect = aspect;
    camera.fov = MathUtils.lerp(camera.fov, sample.fov, smoothing);
    camera.updateProjectionMatrix();
    return sample;
  }
}
