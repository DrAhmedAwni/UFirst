'use client';

import { useEffect, useRef } from 'react';
import {
  AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, CylinderGeometry,
  DirectionalLight, ExtrudeGeometry, Group, Line, LineBasicMaterial, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry,
  Scene, Shape, SRGBColorSpace, TextureLoader, TorusGeometry, WebGLRenderer,
} from 'three';
import { clamp, fittedCameraDistance, modulePose, smooth, type SceneChapter } from './scene-motion';

export default function SystemScene({ assets, paused }: { assets: string[]; paused: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
    window.dispatchEvent(new Event('ufirst-motion'));
  }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-3d-stage]'));
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { return; } // Static posters remain visible when WebGL is unavailable.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
    renderer.outputColorSpace = SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    const scene = new Scene();
    scene.add(new AmbientLight(0xffffff, 1.9));
    const key = new DirectionalLight(0xffffff, 3.4);
    key.position.set(-3, 5, 7);
    const rim = new DirectionalLight(0x61d8e0, 3.2);
    rim.position.set(4, 2, -2);
    scene.add(key, rim);
    const world = new Group();
    scene.add(world);
    const camera = new PerspectiveCamera(38, 1, 0.1, 150);
    const red = new MeshStandardMaterial({ color: 0xf01316, roughness: 0.27, metalness: 0.55 });
    const charcoal = new MeshStandardMaterial({ color: 0x172530, roughness: 0.38, metalness: 0.6 });
    const teal = new MeshStandardMaterial({ color: 0x269ca9, roughness: 0.28, metalness: 0.4 });
    const cream = new MeshStandardMaterial({ color: 0xe8e1d5, roughness: 0.4, metalness: 0.25 });
    const materials = [red, charcoal, teal, cream];
    const box = (parent: Group, w: number, h: number, d: number, material: MeshStandardMaterial, x = 0, y = 0, z = 0) => {
      const mesh = new Mesh(new BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    };
    // Solid bevelled U: real side faces and an open centre, not a flat logo image.
    const shape = new Shape();
    shape.moveTo(-1.05, 1.05); shape.lineTo(-1.05, -0.2);
    shape.bezierCurveTo(-1.05, -1.5, 1.05, -1.5, 1.05, -0.2);
    shape.lineTo(1.05, 1.05); shape.lineTo(0.48, 1.05); shape.lineTo(0.48, -0.18);
    shape.bezierCurveTo(0.48, -0.8, -0.48, -0.8, -0.48, -0.18);
    shape.lineTo(-0.48, 1.05); shape.closePath();
    const core = new Mesh(new ExtrudeGeometry(shape, { depth: 0.45, bevelEnabled: true, bevelThickness: 0.09, bevelSize: 0.08, bevelSegments: 3, steps: 1, curveSegments: 24 }), red);
    world.add(core);
    const rings = [1.65, 1.95].map((radius, index) => {
      const ring = new Mesh(new TorusGeometry(radius, 0.018, 8, 96), index ? cream : teal);
      world.add(ring); return ring;
    });
    let disposed = false, frame = 0, lost = false;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const schedule = () => {
      if (!disposed && !lost && !document.hidden && !frame) frame = requestAnimationFrame(render);
    };
    const loader = new TextureLoader();
    const textures = assets.map((src) => {
      const texture = loader.load(src, (loaded) => { if (disposed) loaded.dispose(); else schedule(); }, undefined, schedule);
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      return texture;
    });
    const surfaceMaterials: MeshBasicMaterial[] = [];
    const screen = (width: number, height: number, textureIndex: number) => {
      const group = new Group();
      box(group, width + 0.12, height + 0.12, 0.22, charcoal);
      const material = new MeshBasicMaterial({ map: textures[textureIndex], color: 0xffffff, toneMapped: false });
      surfaceMaterials.push(material);
      const face = new Mesh(new PlaneGeometry(width, height), material);
      face.position.z = 0.12; group.add(face); return group;
    };
    const browser = screen(2.4, 1.35, 2);
    box(browser, 0.13, 0.45, 0.12, cream, 0, -0.85);
    box(browser, 1, 0.09, 0.6, charcoal, 0, -1.05);
    const board = screen(2.4, 1.35, 0);
    const phone = screen(1, 1.5, 1);
    const filmCamera = new Group();
    box(filmCamera, 1.65, 1.12, 0.85, charcoal);
    box(filmCamera, 0.72, 0.18, 0.28, red, 0, 0.67);
    [0.48, 0.4, 0.34].forEach((radius, index) => {
      const lens = new Mesh(new CylinderGeometry(radius, radius, 0.25, 32), index === 2 ? teal : charcoal);
      lens.rotation.x = Math.PI / 2; lens.position.z = 0.55 + index * 0.23;
      filmCamera.add(lens);
    });
    box(filmCamera, 0.14, 0.14, 0.05, red, 0.62, 0.34, 0.45);
    const growth = new Group();
    [0.45, 0.8, 1.2, 1.75].forEach((height, index) => box(growth, 0.32, height, 0.42, index === 3 ? red : teal, (index - 1.5) * 0.48, height / 2 - 0.8));
    box(growth, 2.1, 0.08, 0.7, cream, 0, -0.86);
    const modules = [browser, board, filmCamera, phone, growth];
    modules.forEach((module) => world.add(module));
    const connections = modules.map(() => {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new BufferAttribute(new Float32Array(6), 3));
      const line = new Line(geometry, new LineBasicMaterial({ color: 0x269ca9, transparent: true, opacity: 0.5 }));
      line.frustumCulled = false; world.add(line); return line;
    });
    const progress = new Map<HTMLElement, number>();
    let viewportWidth = 0, viewportHeight = 0, previousTime = 0;

    function render(now: number) {
      frame = 0;
      if (disposed || lost || document.hidden) return;
      const width = window.innerWidth, height = window.innerHeight;
      if (width !== viewportWidth || height !== viewportHeight) {
        viewportWidth = width; viewportHeight = height; renderer.setSize(width, height, false);
      }
      const dt = Math.min((now - previousTime) / 1000 || 0.016, 0.1);
      previousTime = now;
      renderer.setScissorTest(false); renderer.clear(); renderer.setScissorTest(true);
      let settling = false;
      const still = pausedRef.current || motionPreference.matches;
      for (const stage of stages) {
        const rect = stage.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= height || rect.width <= 0 || rect.height <= 0) continue;
        const chapter = stage.dataset['3dStage'] as SceneChapter;
        let target = clamp((height - rect.top) / (height + rect.height));
        if (chapter === 'system') {
          const driver = stage.closest<HTMLElement>('.system-story');
          if (driver) target = clamp(-driver.getBoundingClientRect().top / Math.max(1, driver.offsetHeight - height));
        } else if (chapter === 'hero') {
          const hero = stage.closest('section');
          if (hero) target = clamp(-hero.getBoundingClientRect().top / hero.clientHeight);
        }
        if (motionPreference.matches) target = 0.55;
        else if (pausedRef.current) target = progress.get(stage) ?? target;
        const current = progress.get(stage) ?? target;
        const value = still ? target : current + (target - current) * (1 - Math.exp(-12 * dt));
        progress.set(stage, value);
        if (Math.abs(target - value) > 0.0002) settling = true;
        const selected = Math.min(4, Math.max(0, Number(stage.dataset.selected) || 0));
        const t = smooth(value);
        world.rotation.set(0.07, chapter === 'process' ? 0 : -0.3 + t * 0.65, 0);
        core.visible = chapter !== 'services' && chapter !== 'process';
        core.rotation.set(-0.12 + t * 0.22, -0.3 + t * 1.1, -0.12 + t * 0.2);
        core.scale.setScalar(chapter === 'hero' ? 1.15 : 0.85 + t * 0.18);
        core.position.set(0, 0, 0.2);
        rings.forEach((ring, index) => {
          ring.visible = core.visible;
          ring.rotation.set(1.05 + index * 0.5 + t * 0.5, 0.25 + t * 0.7, index + t * 1.5);
        });
        modules.forEach((module, index) => {
          const pose = modulePose(chapter, value, index, selected);
          module.position.set(pose.x, pose.y, pose.z); module.scale.setScalar(pose.scale);
          module.rotation.set((t - 0.5) * 0.15, pose.rotation * 1.6, pose.rotation);
          const line = connections[index];
          const points = line.geometry.getAttribute('position') as BufferAttribute;
          const previous = chapter === 'process' && index > 0 ? modules[index - 1].position : core.position;
          points.setXYZ(0, previous.x, previous.y, previous.z - 0.2);
          points.setXYZ(1, pose.x, pose.y, pose.z - 0.2); points.needsUpdate = true;
          line.visible = chapter !== 'services';
          line.material.opacity = chapter === 'system' ? 0.12 + t * 0.5 : 0.3;
        });
        camera.aspect = rect.width / rect.height;
        camera.position.set(0, 0, fittedCameraDistance(camera.aspect) - t * 0.6);
        camera.updateProjectionMatrix();
        renderer.setViewport(rect.left, height - rect.bottom, rect.width, rect.height);
        renderer.setScissor(Math.max(0, rect.left), Math.max(0, height - rect.bottom), Math.min(width, rect.right) - Math.max(0, rect.left), Math.min(height, rect.bottom) - Math.max(0, rect.top));
        renderer.render(scene, camera); stage.classList.add('three-stage-ready');
      }
      if (settling) schedule();
    }
    const resizeObserver = new ResizeObserver(schedule);
    stages.forEach((stage) => resizeObserver.observe(stage));
    const selectionObserver = new MutationObserver(schedule);
    stages.forEach((stage) => selectionObserver.observe(stage, { attributes: true, attributeFilter: ['data-selected'] }));
    const onLost = (event: Event) => { event.preventDefault(); lost = true; stages.forEach((stage) => stage.classList.remove('three-stage-ready')); };
    const onRestored = () => { lost = false; schedule(); };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule); window.addEventListener('ufirst-motion', schedule);
    document.addEventListener('visibilitychange', schedule); document.addEventListener('load', schedule, true);
    motionPreference.addEventListener('change', schedule);
    schedule();
    return () => {
      disposed = true; cancelAnimationFrame(frame);
      resizeObserver.disconnect(); selectionObserver.disconnect();
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.removeEventListener('ufirst-motion', schedule);
      document.removeEventListener('visibilitychange', schedule); document.removeEventListener('load', schedule, true);
      motionPreference.removeEventListener('change', schedule);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      scene.traverse((object) => { if (object instanceof Mesh || object instanceof Line) object.geometry.dispose(); });
      materials.forEach((material) => material.dispose()); surfaceMaterials.forEach((material) => material.dispose());
      connections.forEach((line) => line.material.dispose()); textures.forEach((texture) => texture.dispose());
      renderer.dispose(); renderer.domElement.remove();
      stages.forEach((stage) => stage.classList.remove('three-stage-ready'));
    };
  }, [assets]);

  return <div className="three-world" ref={mountRef} aria-hidden="true" />;
}
