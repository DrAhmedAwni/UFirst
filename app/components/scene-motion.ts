export type SceneChapter = 'hero' | 'system' | 'services' | 'process' | 'finale';
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

// Absolute scroll poses make the sequence reversible, including anchor jumps.
export function modulePose(chapter: SceneChapter, progress: number, index: number, selected: number) {
  const t = smooth(progress);
  const angle = index * Math.PI * 2 / 5 + t * 0.65;
  let x = Math.cos(angle) * 3.2, y = Math.sin(angle) * 2.5, z = Math.sin(angle) * 0.5;
  let scale = 0.65, rotation = -0.2 + index * 0.09;
  if (chapter === 'hero') {
    x *= 1 - t * 0.14; y *= 1 - t * 0.14; z += t * 0.8; rotation += t * 0.3;
  } else if (chapter === 'system') {
    x *= 1.25 - t * 0.35; y *= 1.25 - t * 0.35;
    z = (1 - t) * (index % 2 ? -1.8 : 1.3); scale = 0.72; rotation *= 1 - t;
  } else if (chapter === 'services') {
    const focus = index === selected;
    x = focus ? 0 : Math.cos(angle) * 3.7; y = focus ? 0 : Math.sin(angle) * 2.3;
    z = focus ? 1 : -1; scale = focus ? 1.5 : 0.47;
    rotation = focus ? (t - 0.5) * 0.28 : rotation;
  } else if (chapter === 'process') {
    x = (index - 2) * 1.8; y = Math.sin(index * 0.9 - t * Math.PI * 2) * 0.7; z = 0;
    scale = 0.58 + Math.max(0, 1 - Math.abs(t * 4 - index)) * 0.25; rotation = 0;
  } else {
    x *= 0.95 - t * 0.15; y *= 0.95 - t * 0.15; z = -0.7;
    scale = 0.52; rotation = (t - 0.5) * 0.3;
  }
  return { x, y, z, scale, rotation };
}

export function fittedCameraDistance(aspect: number) {
  return Math.max(4.4, 5.6 / Math.max(aspect, 0.1)) / Math.tan(19 * Math.PI / 180) + 3.5;
}
