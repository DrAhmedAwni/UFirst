import type { CinematicSceneName } from './types';
import type { ExperienceMoment } from '@/app/content';

export type CinematicMoment = ExperienceMoment & { scene: CinematicSceneName; anchor: string };

export const CINEMATIC_MOMENTS: CinematicMoment[] = [
  {
    scene: 'reveal',
    number: '01',
    title: 'Make the first frame count.',
    body: 'UFirst brings strategy, story, and production into one clear point of view.',
    component: 'The exterior / A point of view',
    anchor: 'top',
  },
  {
    scene: 'system',
    number: '02',
    title: 'Earn attention.',
    body: 'Move closer. The lens is where a signal becomes something people can feel.',
    component: 'The lens / Find the focus',
    anchor: 'system',
  },
  {
    scene: 'about',
    number: '03',
    title: 'Enter the lens.',
    body: 'A sharper point of view gives ambitious brands a clearer lane to own. Keep moving and the next world opens.',
    component: 'The aperture / Enter the lens',
    anchor: 'about',
  },
  {
    scene: 'doors',
    number: '04',
    title: 'Open the next frame.',
    body: 'Beyond the optics is a world built for momentum. The threshold opens as the camera moves through it.',
    component: 'The doors / Cross the threshold',
    anchor: 'services',
  },
  {
    scene: 'services',
    number: '05',
    title: 'Make the move.',
    body: 'Brand, creative, production, digital, and growth work as one connected system.',
    component: 'The shutter / Make it move',
    anchor: 'services',
  },
  {
    scene: 'work',
    number: '06',
    title: 'Turn insight into work.',
    body: 'Ideas become real output: built for attention, remembered for a reason.',
    component: 'The sensor / See the signal',
    anchor: 'work',
  },
  {
    scene: 'process',
    number: '07',
    title: 'Build what lasts.',
    body: 'A disciplined process keeps the idea moving from first signal to measured momentum.',
    component: 'The processor / Build what lasts',
    anchor: 'process',
  },
  {
    scene: 'contact',
    number: '08',
    title: 'Carry it forward.',
    body: 'Bring the brief, the ambition, or the problem. We will find the frame worth making.',
    component: 'The memory / Carry it forward',
    anchor: 'contact',
  },
  {
    scene: 'contact',
    number: '09',
    title: 'See what is possible.',
    body: 'The mechanism is complete. Now the viewfinder points toward the next frame: yours.',
    component: 'The viewfinder / Start the conversation',
    anchor: 'contact',
  },
  {
    scene: 'exit',
    number: '10',
    title: 'Make your next bold move.',
    body: 'The camera returns complete. Now the next frame belongs to your brand.',
    component: 'The final frame / UFirst',
    anchor: 'contact',
  },
];

export function momentAt(progress: number) {
  const ranges: Array<[number, number]> = [
    [0, 0.07],
    [0.07, 0.18],
    [0.18, 0.22],
    [0.22, 0.39],
    [0.39, 0.52],
    [0.52, 0.62],
    [0.62, 0.82],
    [0.82, 0.9],
    [0.9, 0.95],
    [0.95, 1],
  ];
  const index = ranges.findIndex(([from, to]) => progress >= from && progress <= to);
  return CINEMATIC_MOMENTS[index < 0 ? CINEMATIC_MOMENTS.length - 1 : index];
}
