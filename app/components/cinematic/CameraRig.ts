import { MathUtils, PerspectiveCamera, Vector3 } from 'three';
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

function pathValue(progress: number, key: 'position' | 'target', output: Vector3) {
  const value = MathUtils.clamp(progress, 0, 1);
  const first = CINEMATIC_KEYFRAMES[0];
  const last = CINEMATIC_KEYFRAMES[CINEMATIC_KEYFRAMES.length - 1];
  if (value <= first.progress) {
    output.set(...first[key]);
    return output;
  }
  if (value >= last.progress) {
    output.set(...last[key]);
    return output;
  }
  for (let index = 1; index < CINEMATIC_KEYFRAMES.length; index += 1) {
    const current = CINEMATIC_KEYFRAMES[index];
    const previous = CINEMATIC_KEYFRAMES[index - 1];
    if (value <= current.progress) {
      const t = MathUtils.smoothstep((value - previous.progress) / (current.progress - previous.progress), 0, 1);
      const before = CINEMATIC_KEYFRAMES[Math.max(0, index - 2)][key];
      const after = CINEMATIC_KEYFRAMES[Math.min(CINEMATIC_KEYFRAMES.length - 1, index + 1)][key];
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
    pathValue(value, 'position', this.position);
    pathValue(value, 'target', this.pathTarget);
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
