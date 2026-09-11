/* eslint-disable @next/next/no-img-element */
import type { SceneChapter } from './scene-motion';

export default function SceneStage({ chapter, image, label, selected = 0 }: {
  chapter: SceneChapter; image: string; label: string; selected?: number;
}) {
  return <div className={`three-stage three-stage-${chapter}`} data-3d-stage={chapter} data-selected={selected} role="img" aria-label={label}>
    <img className="three-stage-poster" src={image} alt="" loading={chapter === 'hero' ? 'eager' : 'lazy'} />
    <div className="three-stage-caption" aria-hidden="true"><span>UFirst / {chapter}</span><span className="three-motion-hint">Scroll to explore ↓</span></div>
  </div>;
}
