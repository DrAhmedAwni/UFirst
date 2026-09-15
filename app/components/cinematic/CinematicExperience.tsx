'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ACESFilmicToneMapping,
  LoadingManager,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from 'three';
import type { SiteContent } from '@/app/content';
import { createCinematicWorld } from './CinematicWorld';
import { CameraRig } from './CameraRig';
import { cinematicPixelRatio, detectCinematicQuality } from './quality-tiers';
import { progressFromDocument, sceneAt } from './ScrollDirector';
import { CINEMATIC_MOMENTS, momentAt } from './scene-moments';
import type { CinematicAssetUrls } from './types';

export default function CinematicExperience({ content, paused, onPausedChange }: { content: SiteContent; paused: boolean; onPausedChange: (paused: boolean) => void }) {
  const sequenceRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const [progress, setProgress] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(3);
  const [webglAvailable, setWebglAvailable] = useState(true);

  const assets = useMemo<CinematicAssetUrls>(() => ({
    hero: content.hero.background.src,
    cameraModel: '/models/ufirst-camera-production.glb',
    cameraModelMobile: '/models/ufirst-camera-mobile.glb',
    cameraModelDistant: '/models/ufirst-camera-distant.glb',
    cameraBodyAlbedo: '/assets/camera/camera-body-albedo-v1.webp',
    cameraBodyNormal: '/assets/camera/camera-body-normal-v1.webp',
    cameraBodyRoughness: '/assets/camera/camera-body-roughness-v1.webp',
    cameraExterior: '/assets/camera/ufirst-camera-exterior-v2.png',
    cameraExploded: '/assets/camera/ufirst-camera-exploded-v2.png',
    about: content.about.image.src,
    system: [content.system.browser.src, content.system.dashboard.src, content.system.mobile.src],
    services: content.services.map((service) => service.image.src),
    projects: content.projects.map((project) => project.image.src),
    contact: content.projects.at(-1)?.image.src ?? content.hero.background.src,
  }), [content.about.image.src, content.hero.background.src, content.projects, content.services, content.system.browser.src, content.system.dashboard.src, content.system.mobile.src]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const sequence = sequenceRef.current;
    const canvas = canvasRef.current;
    if (!sequence || !canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      canvas.hidden = true;
      window.setTimeout(() => {
        setWebglAvailable(false);
        setLoadingProgress(100);
      }, 0);
      return;
    }

    window.setTimeout(() => setWebglAvailable(true), 0);
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const quality = detectCinematicQuality(mobile);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, cinematicPixelRatio(quality, mobile)));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.setClearColor(0x050708, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.05, 100);
    const rig = new CameraRig();
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const manager = new LoadingManager();
    manager.onProgress = (_url, loaded, total) => setLoadingProgress(Math.max(12, Math.round((loaded / Math.max(total, 1)) * 100)));
    manager.onLoad = () => setLoadingProgress(100);
    manager.onError = () => setLoadingProgress((value) => Math.max(value, 88));
    const world = createCinematicWorld(manager, assets, { mobile, quality });
    scene.add(...world.roots);
    let disposed = false;
    let frame = 0;
    let lastTime = performance.now();
    let currentProgress = 0;
    let lastOverlayProgress = -1;

    const render = (now: number) => {
      frame = 0;
      if (disposed || document.hidden) return;
      const delta = Math.min((now - lastTime) / 1000 || 0.016, 0.1);
      lastTime = now;
      const targetProgress = motionPreference.matches ? 0 : progressFromDocument();
      if (!pausedRef.current && !motionPreference.matches) currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-10 * delta));
      const aspect = Math.max(0.25, window.innerWidth / Math.max(window.innerHeight, 1));
      world.update(currentProgress, delta);
      rig.apply(camera, currentProgress, aspect, 0.2);
      renderer.render(scene, camera);
      if (Math.abs(currentProgress - lastOverlayProgress) > 0.012 || lastOverlayProgress < 0) {
        lastOverlayProgress = currentProgress;
        setProgress(currentProgress);
      }
      document.documentElement.classList.toggle('cinematic-deep', currentProgress > 0.22 && currentProgress < 0.93);
      if (Math.abs(targetProgress - currentProgress) > 0.0005 || !pausedRef.current) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(render); };
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      schedule();
    };
    const visibility = () => { if (!document.hidden) schedule(); };
    const onScroll = () => schedule();
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      world.setPointer?.((event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2, (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2);
      schedule();
    };
    const onPointerLeave = () => {
      world.setPointer?.(0, 0);
      schedule();
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', visibility);
    motionPreference.addEventListener('change', schedule);
    schedule();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', visibility);
      motionPreference.removeEventListener('change', schedule);
      document.documentElement.classList.remove('cinematic-deep');
      world.dispose();
      world.textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [assets]);

  const activeScene = sceneAt(progress);
  const activeMoment = momentAt(progress);
  const authoredMoment = content.experience.moments.find((moment) => moment.number === activeMoment.number);
  const displayMoment = authoredMoment ? { ...activeMoment, ...authoredMoment } : activeMoment;
  const lightScene = activeScene.scene === 'services' || activeScene.scene === 'process';
  const heroOpacity = progress < 0.16 ? 1 - Math.max(0, progress - 0.04) / 0.12 : 0;
  const sceneOpacity = 0.9;

  function skipCinematic() {
    document.getElementById('about')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
     <section className={lightScene ? 'cinematic-sequence cinematic-on-light' : 'cinematic-sequence'} id="top" ref={sequenceRef} aria-labelledby="cinematic-title">
      <div className="cinematic-sticky">
         <div className="cinematic-fallback" style={{ '--cinematic-fallback': `url('${content.hero.background.src}')`, opacity: webglAvailable ? 0 : 0.72 } as CSSProperties} aria-hidden="true" />
        <canvas className="cinematic-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="cinematic-atmosphere" aria-hidden="true" />
        <div className="cinematic-ui">
          <div className="cinematic-copy" style={{ opacity: heroOpacity }}>
            <p className="cinematic-kicker"><span /> UFirst / The first frame</p>
            <h1 id="cinematic-title">{content.hero.headline} <em>{content.hero.emphasis}</em></h1>
            <p className="cinematic-body">{content.hero.body}</p>
            <div className="cinematic-actions">
              <a className="button button-primary" href="#contact">{content.hero.primaryCta} <span>↗</span></a>
              <button className="cinematic-skip" type="button" onClick={skipCinematic}>Skip to the work ↓</button>
              <button className="cinematic-skip cinematic-pause" type="button" aria-pressed={paused} onClick={() => onPausedChange(!paused)}>{paused ? 'Resume film' : 'Pause film'}</button>
            </div>
          </div>
           <div className="cinematic-scene-label" style={{ opacity: sceneOpacity }} aria-live="polite">
             <span>{activeScene.label}</span>
             <strong>{String(Math.round(progress * 100)).padStart(2, '0')} / 100</strong>
           </div>
          <div className="cinematic-moment" aria-live="polite">
            <span className="cinematic-moment-number">{displayMoment.number} / {displayMoment.component}</span>
            <h2>{displayMoment.title}</h2>
            <p>{displayMoment.body}</p>
            <a href={`#${displayMoment.anchor}`}>Open this chapter <span>↗</span></a>
          </div>
          <nav className="cinematic-route" aria-label="Experience chapters">
            {CINEMATIC_MOMENTS.map((moment) => (
              <a className={moment.scene === activeMoment.scene ? 'cinematic-route-item cinematic-route-item-active' : 'cinematic-route-item'} href={`#${moment.anchor}`} key={moment.number} aria-label={`Go to ${moment.title}`}>
                <span>{moment.number}</span>
              </a>
            ))}
          </nav>
          <div className="cinematic-footer">
            <span>{content.experience.locationLabel}</span>
            <span className="cinematic-line" />
            <span>{content.experience.scrollLabel} ↓</span>
          </div>
          <div className="cinematic-loader" data-ready={loadingProgress >= 100} aria-hidden={loadingProgress >= 100}>
            <span className="cinematic-loader-mark">U</span>
            <span className="cinematic-loader-text">Preparing the first frame</span>
            <span className="cinematic-loader-value">{loadingProgress}%</span>
          </div>
          {!webglAvailable ? <div className="cinematic-fallback-note">A still frame is ready. Continue below to explore UFirst.</div> : null}
        </div>
      </div>
    </section>
  );
}
