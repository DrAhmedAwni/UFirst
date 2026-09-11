'use client';

import { useEffect, useRef } from 'react';
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  Texture,
  TextureLoader,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';

type SystemSceneProps = { progress: number; assets: string[] };

type ModuleDefinition = {
  size: [number, number];
  color: number;
  scatter: [number, number, number];
  connected: [number, number, number];
  growth: [number, number, number];
  rotation: number;
};

const modules: ModuleDefinition[] = [
  { size: [2.7, 1.55], color: 0xf01316, scatter: [-3.6, 1.9, 0], connected: [-2.3, 1.1, 0], growth: [-2.9, 1.8, 0.5], rotation: -0.25 },
  { size: [2.2, 1.3], color: 0xe8e1d5, scatter: [2.8, 2.2, -0.5], connected: [-0.1, 1.05, -0.3], growth: [0, 2.55, -0.4], rotation: 0.18 },
  { size: [2.4, 1.4], color: 0x269ca9, scatter: [-3.5, -1.9, -0.8], connected: [2.1, 0.4, -0.8], growth: [2.9, 1.35, 0.3], rotation: 0.28 },
  { size: [1.8, 2.7], color: 0xf7f6f5, scatter: [3.6, -1.3, -0.2], connected: [0.65, -1.65, -0.1], growth: [1.9, -1.1, 0.1], rotation: -0.12 },
  { size: [2.6, 1.4], color: 0x1c5ea4, scatter: [-0.2, 3.2, -1.2], connected: [2.4, -1.2, -1.2], growth: [0.1, -2.65, -0.6], rotation: -0.2 },
  { size: [2.15, 1.15], color: 0x9b9891, scatter: [-0.5, -3.2, -0.7], connected: [-1.35, -0.95, -0.9], growth: [-2.7, -0.7, 0.2], rotation: 0.14 },
  { size: [1.4, 1.4], color: 0xf01316, scatter: [4.5, 0.3, -1.5], connected: [0.1, 0.05, 0.4], growth: [0, 0.2, 1.2], rotation: 0.05 },
];

function lerpPoint(a: Vector3, b: Vector3, amount: number) {
  return a.clone().lerp(b, amount);
}

function createModule(definition: ModuleDefinition, texture?: Texture) {
  const group = new Group();
  const [width, height] = definition.size;
  const material = new MeshStandardMaterial({ color: texture ? 0xffffff : definition.color, roughness: 0.6, metalness: 0.12, transparent: true, opacity: 0.92 });
  if (texture) {
    material.map = texture;
    material.needsUpdate = true;
  }
  const panel = new Mesh(
    new BoxGeometry(width, height, 0.16),
    material,
  );
  const border = new LineSegments(
    new EdgesGeometry(new BoxGeometry(width, height, 0.16)),
    new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.26 }),
  );
  group.add(panel, border);
  return { group, panel, border };
}

export default function SystemScene({ progress, assets }: SystemSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      mount.classList.add('scene-fallback-active');
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.1, 10);
    scene.add(new AmbientLight(0xffffff, 2.1));
    const keyLight = new DirectionalLight(0x8bd9e0, 2.2);
    keyLight.position.set(-4, 5, 7);
    scene.add(keyLight);
    const fillLight = new PointLight(0xf01316, 9, 10);
    fillLight.position.set(3, -2, 2);
    scene.add(fillLight);

    const world = new Group();
    scene.add(world);
    const textureLoader = new TextureLoader();
    const textures = assets.map((src) => textureLoader.load(src));
    const builtModules = modules.map((definition, index) => createModule(definition, textures[index % textures.length]));
    builtModules.forEach(({ group }) => world.add(group));

    const core = new Mesh(
      new IcosahedronGeometry(0.72, 2),
      new MeshStandardMaterial({ color: 0x269ca9, emissive: 0x0b4c59, emissiveIntensity: 0.8, roughness: 0.28, metalness: 0.55 }),
    );
    world.add(core);
    const orbit = new Mesh(
      new TorusGeometry(1.02, 0.012, 8, 80),
      new MeshBasicMaterial({ color: 0xe8e1d5, transparent: true, opacity: 0.45 }),
    );
    orbit.rotation.x = Math.PI * 0.46;
    world.add(orbit);

    const connections = modules.map(() => new Line(new BufferGeometry(), new LineBasicMaterial({ color: 0x6bd9e0, transparent: true, opacity: 0.66 })));
    connections.forEach((line) => world.add(line));

    const particleGeometry = new BufferGeometry();
    const particlePositions = new Float32Array(26 * 3);
    for (let index = 0; index < 26; index += 1) {
      particlePositions[index * 3] = (Math.random() - 0.5) * 10;
      particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 7;
      particlePositions[index * 3 + 2] = -1.7 - Math.random() * 1.7;
    }
    particleGeometry.setAttribute('position', new BufferAttribute(particlePositions, 3));
    const particles = new Points(particleGeometry, new PointsMaterial({ color: 0xe8e1d5, size: 0.035, transparent: true, opacity: 0.5 }));
    world.add(particles);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let frame = 0;
    let last = performance.now();
    const render = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      const value = Math.max(0, Math.min(1, progressRef.current));
      const firstPhase = Math.min(value / 0.58, 1);
      const secondPhase = Math.max(0, (value - 0.58) / 0.42);

      builtModules.forEach(({ group, panel, border }, index) => {
        const definition = modules[index];
        const scatter = new Vector3(...definition.scatter);
        const connected = new Vector3(...definition.connected);
        const growth = new Vector3(...definition.growth);
        group.position.copy(lerpPoint(lerpPoint(scatter, connected, firstPhase), growth, secondPhase));
        group.rotation.z = definition.rotation * (1 - firstPhase) + (index % 2 === 0 ? 0.08 : -0.06) * firstPhase + secondPhase * (index % 2 === 0 ? 0.16 : -0.12);
        group.rotation.y = (1 - firstPhase) * (index % 2 === 0 ? -0.28 : 0.22) + secondPhase * 0.12;
        group.scale.setScalar(0.92 + Math.sin((value + index * 0.08) * Math.PI) * 0.04);
        panel.material.opacity = 0.42 + firstPhase * 0.48;
        border.material.opacity = 0.14 + firstPhase * 0.24;
      });

      core.scale.setScalar(0.8 + firstPhase * 0.24 + secondPhase * 0.14);
      core.rotation.x += delta * 0.22;
      core.rotation.y += delta * 0.36;
      orbit.rotation.z -= delta * 0.18;
      orbit.rotation.y = value * 0.6;
      particles.rotation.y += delta * 0.025;
      world.rotation.y = -0.18 + value * 0.42;
      world.rotation.x = 0.06 + Math.sin(value * Math.PI) * 0.08;
      camera.position.x = Math.sin(value * Math.PI) * 0.72;
      camera.position.y = 0.1 + Math.sin(value * Math.PI * 1.2) * 0.35;
      camera.position.z = 10 - value * 1.25;
      camera.lookAt(0, 0, 0);

      connections.forEach((line, index) => {
        const from = index === 0 ? new Vector3(0, 0, 0) : builtModules[index - 1].group.position;
        const to = builtModules[index].group.position;
        line.geometry.dispose();
        line.geometry = new BufferGeometry().setFromPoints([from, to]);
        (line.material as LineBasicMaterial).opacity = firstPhase * 0.68 + secondPhase * 0.22;
      });

      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      connections.forEach((line) => line.geometry.dispose());
      textures.forEach((texture) => texture.dispose());
      builtModules.forEach(({ group, panel, border }) => {
        group.traverse((child) => {
          if (child instanceof Mesh) child.geometry.dispose();
        });
        panel.material.dispose();
        border.geometry.dispose();
        border.material.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [assets]);

  return <div className="scene-mount" ref={mountRef} aria-label="Animated UFirst creative system visualization" role="img"><div className="scene-fallback" aria-hidden="true"><span className="scene-fallback-core">UF</span><span className="scene-fallback-line scene-fallback-line-one" /><span className="scene-fallback-line scene-fallback-line-two" /><span className="scene-fallback-line scene-fallback-line-three" /></div></div>;
}
