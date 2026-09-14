export type CinematicQuality = 'high' | 'medium' | 'low';

export function detectCinematicQuality(mobile: boolean): CinematicQuality {
  if (mobile) return 'low';
  const deviceMemory = 'deviceMemory' in navigator ? Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) : 8;
  const cores = navigator.hardwareConcurrency || 8;
  if (deviceMemory <= 4 || cores <= 4) return 'medium';
  return 'high';
}

export function cinematicPixelRatio(quality: CinematicQuality, mobile: boolean) {
  if (mobile || quality === 'low') return 1.1;
  if (quality === 'medium') return 1.25;
  return 1.5;
}
