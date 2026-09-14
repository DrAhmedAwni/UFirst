import {
  AmbientLight,
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  LoadingManager,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  PointLight,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  TorusGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Material, MeshPhysicalMaterialParameters, Object3D } from 'three';
import type { CinematicAssetUrls, CinematicWorld } from './types';

type MeshList = Mesh[];

type JourneyGroups = {
  shell: MeshList;
  lens: MeshList;
  aperture: MeshList;
  shutter: MeshList;
  sensor: MeshList;
  processor: MeshList;
  memory: MeshList;
  exit: MeshList;
};

function createMaterial(materials: Material[], color: number, options: MeshPhysicalMaterialParameters = {}) {
  const material = new MeshPhysicalMaterial({
    color,
    metalness: 0.68,
    roughness: 0.32,
    clearcoat: 0.18,
    clearcoatRoughness: 0.25,
    transparent: true,
    side: DoubleSide,
    ...options,
  });
  materials.push(material);
  return material;
}

function addMesh<T extends Mesh>(parent: Group, mesh: T, name: string, list: MeshList) {
  mesh.name = name;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  parent.add(mesh);
  list.push(mesh);
  return mesh;
}

function addRoundedBox(parent: Group, size: [number, number, number], position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList, radius = 0.12) {
  const mesh = new Mesh(new RoundedBoxGeometry(...size, 3, radius), material);
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addBox(parent: Group, size: [number, number, number], position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList) {
  const mesh = new Mesh(new BoxGeometry(...size), material);
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addCylinder(parent: Group, radius: number, depth: number, position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList, radialSegments = 48) {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, depth, radialSegments), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addVerticalCylinder(parent: Group, radius: number, depth: number, position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList, radialSegments = 32) {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, depth, radialSegments), material);
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addTorus(parent: Group, radius: number, tube: number, position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList) {
  const mesh = new Mesh(new TorusGeometry(radius, tube, 16, 64), material);
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addScrew(parent: Group, position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList) {
  const mesh = new Mesh(new CylinderGeometry(0.075, 0.075, 0.06, 16), material);
  mesh.rotation.x = Math.PI / 2;
  mesh.position.set(...position);
  return addMesh(parent, mesh, name, list);
}

function addKnurledDial(parent: Group, position: [number, number, number], material: MeshPhysicalMaterial, accent: MeshPhysicalMaterial, name: string, list: MeshList) {
  addVerticalCylinder(parent, 0.32, 0.2, position, material, `${name} dial`, list, 32);
  const accentRing = addTorus(parent, 0.32, 0.035, [position[0], position[1] + 0.12, position[2]], accent, `${name} accent`, list);
  accentRing.rotation.x = Math.PI / 2;
  for (let index = 0; index < 12; index += 1) {
    const angle = (index / 12) * Math.PI * 2;
    addBox(parent, [0.035, 0.09, 0.08], [position[0] + Math.cos(angle) * 0.29, position[1] + 0.13, position[2] + Math.sin(angle) * 0.29], accent, `${name} knurl ${index + 1}`, list);
  }
}

function addComponentMarker(parent: Group, position: [number, number, number], material: MeshPhysicalMaterial, name: string, list: MeshList) {
  return addRoundedBox(parent, [0.28, 0.78, 0.045], position, material, name, list, 0.06);
}

function smoothWindow(progress: number, from: number, to: number, feather = 0.08) {
  const start = MathUtils.smoothstep(progress, Math.max(0, from - feather), from);
  const end = 1 - MathUtils.smoothstep(progress, to, Math.min(1, to + feather));
  return MathUtils.clamp(start * end, 0, 1);
}

function setOpacity(meshes: MeshList, opacity: number) {
  meshes.forEach((mesh) => {
    const material = mesh.material as MeshPhysicalMaterial;
    material.opacity = opacity;
    material.depthWrite = opacity > 0.84;
    material.needsUpdate = true;
  });
}

function addLens(group: Group, materials: Material[], groups: JourneyGroups) {
  const housing = createMaterial(materials, 0x252f35, { roughness: 0.2, metalness: 0.86 });
  const edge = createMaterial(materials, 0x87959a, { roughness: 0.2, metalness: 0.92 });
  const glass = createMaterial(materials, 0x315a72, { roughness: 0.08, metalness: 0.32, transmission: 0.28, thickness: 0.18, ior: 1.48, opacity: 0.94, emissive: 0x081723, emissiveIntensity: 0.35 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.24, metalness: 0.55, emissive: 0x260206, emissiveIntensity: 0.35 });

  addCylinder(group, 2.45, 0.52, [0, 0, -0.05], housing, 'Lens hood', groups.lens, 64);
  addTorus(group, 2.3, 0.12, [0, 0, 0.22], edge, 'Lens rim', groups.lens);
  addTorus(group, 2.16, 0.055, [0, 0, 0.38], red, 'UFirst lens accent', groups.lens);
  addCylinder(group, 1.94, 0.1, [0, 0, 0.34], glass, 'Front optical glass', groups.lens, 64);
  addCylinder(group, 1.72, 0.36, [0, 0, -0.5], housing, 'Lens barrel', groups.lens, 64);
  addTorus(group, 1.82, 0.08, [0, 0, -0.34], edge, 'Focus ring', groups.lens);
  addCylinder(group, 1.48, 0.08, [0, 0, -0.82], glass, 'Lens element one', groups.lens, 64);
  addCylinder(group, 1.28, 0.08, [0, 0, -1.12], glass, 'Lens element two', groups.lens, 64);
  addTorus(group, 1.5, 0.06, [0, 0, -1.02], edge, 'Inner lens ring', groups.lens);

  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const marker = addComponentMarker(group, [Math.cos(angle) * 1.9, Math.sin(angle) * 1.9, -0.02], red, `Lens calibration marker ${index + 1}`, groups.lens);
    marker.rotation.z = angle;
  }
}

function addAperture(group: Group, materials: Material[], groups: JourneyGroups) {
  const metal = createMaterial(materials, 0x66757b, { roughness: 0.24, metalness: 0.9 });
  const blade = createMaterial(materials, 0xaab5b8, { roughness: 0.2, metalness: 0.88 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.28, metalness: 0.5, emissive: 0x2d0307, emissiveIntensity: 0.3 });

  addTorus(group, 1.54, 0.08, [0, 0, -1.55], metal, 'Aperture housing', groups.aperture);
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const leaf = addRoundedBox(group, [1.22, 0.18, 0.055], [Math.cos(angle) * 0.46, Math.sin(angle) * 0.46, -1.58], blade, `Aperture blade ${index + 1}`, groups.aperture, 0.06);
    leaf.rotation.z = angle + 0.42;
  }
  addCylinder(group, 0.56, 0.12, [0, 0, -1.64], red, 'Aperture iris', groups.aperture, 48);
  addTorus(group, 0.7, 0.055, [0, 0, -1.72], red, 'Aperture focus ring', groups.aperture);
}

function addShutter(group: Group, materials: Material[], groups: JourneyGroups) {
  const metal = createMaterial(materials, 0x9aa5a8, { roughness: 0.18, metalness: 0.92 });
  const dark = createMaterial(materials, 0x263034, { roughness: 0.42, metalness: 0.68 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.25, metalness: 0.55, emissive: 0x240206, emissiveIntensity: 0.28 });

  addBox(group, [3.4, 0.14, 0.12], [0, 0.9, -2.65], metal, 'Shutter upper blade', groups.shutter);
  addBox(group, [3.4, 0.14, 0.12], [0, -0.9, -2.65], metal, 'Shutter lower blade', groups.shutter);
  addBox(group, [0.16, 2.0, 0.13], [-1.58, 0, -2.7], dark, 'Shutter left rail', groups.shutter);
  addBox(group, [0.16, 2.0, 0.13], [1.58, 0, -2.7], dark, 'Shutter right rail', groups.shutter);
  addTorus(group, 1.7, 0.06, [0, 0, -2.78], red, 'Shutter timing ring', groups.shutter);
  for (let index = 0; index < 6; index += 1) {
    const x = -1.1 + index * 0.44;
    addScrew(group, [x, 1.12, -2.82], metal, `Shutter upper screw ${index + 1}`, groups.shutter);
    addScrew(group, [x, -1.12, -2.82], metal, `Shutter lower screw ${index + 1}`, groups.shutter);
  }
}

function addSensor(group: Group, materials: Material[], groups: JourneyGroups) {
  const frame = createMaterial(materials, 0x7f8e93, { roughness: 0.18, metalness: 0.92 });
  const sensor = createMaterial(materials, 0x225271, { roughness: 0.14, metalness: 0.28, emissive: 0x0d4d68, emissiveIntensity: 0.55 });
  const contact = createMaterial(materials, 0xc18642, { roughness: 0.25, metalness: 0.86 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.24, metalness: 0.5, emissive: 0x260206, emissiveIntensity: 0.34 });

  addBox(group, [3.7, 2.8, 0.16], [0, 0, -4.1], frame, 'Sensor frame', groups.sensor);
  addBox(group, [3.0, 2.1, 0.16], [0, 0, -4.2], sensor, 'Image sensor', groups.sensor);
  addTorus(group, 1.55, 0.07, [0, 0, -4.34], red, 'Sensor readout ring', groups.sensor);
  for (let index = 0; index < 10; index += 1) {
    const x = -1.18 + index * 0.26;
    addBox(group, [0.08, 0.32, 0.04], [x, -1.21, -4.34], contact, `Sensor contact ${index + 1}`, groups.sensor);
  }
}

function addProcessor(group: Group, materials: Material[], groups: JourneyGroups) {
  const board = createMaterial(materials, 0x124139, { roughness: 0.42, metalness: 0.38 });
  const chip = createMaterial(materials, 0x4d5a5e, { roughness: 0.2, metalness: 0.75 });
  const copper = createMaterial(materials, 0xc0803d, { roughness: 0.2, metalness: 0.84 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.25, metalness: 0.5, emissive: 0x270207, emissiveIntensity: 0.32 });

  addBox(group, [4.1, 2.8, 0.12], [0, 0, -5.62], board, 'Processor board', groups.processor);
  addRoundedBox(group, [1.18, 0.94, 0.18], [-0.75, 0.35, -5.79], chip, 'Creative processor', groups.processor, 0.08);
  addRoundedBox(group, [0.78, 0.66, 0.16], [0.9, -0.48, -5.79], chip, 'Signal processor', groups.processor, 0.06);
  addRoundedBox(group, [0.54, 0.42, 0.14], [1.38, 0.55, -5.79], chip, 'Control chip', groups.processor, 0.04);
  for (let index = 0; index < 7; index += 1) {
    const x = -1.55 + index * 0.5;
    addBox(group, [0.08, 1.92, 0.04], [x, 0, -5.81], copper, `Processor trace ${index + 1}`, groups.processor);
  }
  addTorus(group, 0.42, 0.055, [-0.75, 0.35, -5.92], red, 'Creative signal ring', groups.processor);
}

function addMemory(group: Group, materials: Material[], groups: JourneyGroups) {
  const card = createMaterial(materials, 0x182f28, { roughness: 0.48, metalness: 0.42 });
  const copper = createMaterial(materials, 0xd2934f, { roughness: 0.2, metalness: 0.86 });
  const housing = createMaterial(materials, 0x161c20, { roughness: 0.28, metalness: 0.8 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.26, metalness: 0.5, emissive: 0x260206, emissiveIntensity: 0.3 });

  addRoundedBox(group, [3.5, 2.5, 0.3], [0, 0, -7.06], housing, 'Memory bay', groups.memory, 0.12);
  addRoundedBox(group, [2.45, 1.48, 0.18], [0, 0, -7.28], card, 'Memory card', groups.memory, 0.08);
  for (let index = 0; index < 8; index += 1) {
    addBox(group, [0.13, 0.52, 0.035], [-0.78 + index * 0.22, -0.95, -7.4], copper, `Memory contact ${index + 1}`, groups.memory);
  }
  addTorus(group, 0.44, 0.055, [0, 0, -7.43], red, 'Data transfer ring', groups.memory);
}

function addShell(group: Group, materials: Material[], groups: JourneyGroups) {
  const shell = createMaterial(materials, 0x273239, { roughness: 0.24, metalness: 0.88, opacity: 0.92 });
  const edge = createMaterial(materials, 0x6f7c82, { roughness: 0.2, metalness: 0.92, opacity: 0.92 });
  const rubber = createMaterial(materials, 0x0c1012, { roughness: 0.78, metalness: 0.08, opacity: 0.96 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.28, metalness: 0.5, emissive: 0x260206, emissiveIntensity: 0.3, opacity: 0.96 });
  const glass = createMaterial(materials, 0x243b43, { roughness: 0.12, metalness: 0.18, transmission: 0.3, thickness: 0.08, opacity: 0.9, emissive: 0x061216, emissiveIntensity: 0.28 });

  addRoundedBox(group, [5.6, 3.8, 5.2], [0, 0, -5.9], shell, 'Camera body shell', groups.shell, 0.34);
  addRoundedBox(group, [5.5, 0.34, 5.35], [0, 2.08, -5.9], shell, 'Camera top shell', groups.shell, 0.12);
  addRoundedBox(group, [5.5, 0.34, 5.35], [0, -2.08, -5.9], shell, 'Camera bottom shell', groups.shell, 0.12);
  addRoundedBox(group, [0.34, 3.85, 5.35], [-2.58, 0, -5.9], shell, 'Camera left shell', groups.shell, 0.12);
  addRoundedBox(group, [0.34, 3.85, 5.35], [2.58, 0, -5.9], shell, 'Camera right shell', groups.shell, 0.12);
  addRoundedBox(group, [5.5, 0.34, 0.3], [0, 2.08, -8.62], edge, 'Rear top edge', groups.shell, 0.1);
  addRoundedBox(group, [5.5, 0.34, 0.3], [0, -2.08, -8.62], edge, 'Rear bottom edge', groups.shell, 0.1);
  addRoundedBox(group, [0.34, 3.85, 0.3], [-2.58, 0, -8.62], edge, 'Rear left edge', groups.shell, 0.1);
  addRoundedBox(group, [0.34, 3.85, 0.3], [2.58, 0, -8.62], edge, 'Rear right edge', groups.shell, 0.1);
  addRoundedBox(group, [5.5, 0.2, 0.3], [0, 0, -8.82], rubber, 'Rear gasket', groups.shell, 0.06);
  addRoundedBox(group, [5.8, 0.3, 1.2], [0, 2.68, -6.0], shell, 'Camera handle', groups.shell, 0.12);
  addBox(group, [4.25, 0.08, 0.08], [0, 2.5, -6.0], red, 'UFirst red rail', groups.shell);
  addKnurledDial(group, [-1.35, 2.34, -5.1], rubber, red, 'Record', groups.shell);
  addKnurledDial(group, [-0.45, 2.34, -5.1], rubber, edge, 'Shutter speed', groups.shell);
  addVerticalCylinder(group, 0.13, 0.16, [0.56, 2.34, -5.1], red, 'Record button', groups.shell, 24);
  addRoundedBox(group, [1.05, 0.08, 0.6], [1.68, 1.9, -5.1], glass, 'Top status display', groups.shell, 0.03);
  addBox(group, [0.16, 2.4, 0.16], [2.25, 0, -6.3], rubber, 'Side grip', groups.shell);
  addBox(group, [0.12, 0.6, 0.12], [2.78, 0.75, -5.15], red, 'Camera status accent', groups.shell);
  for (let index = 0; index < 4; index += 1) {
    addScrew(group, [-2.72, -1.35 + index * 0.9, -5.2], edge, `Camera shell screw ${index + 1}`, groups.shell);
  }
}

function addExit(group: Group, materials: Material[], groups: JourneyGroups) {
  const housing = createMaterial(materials, 0x2b373d, { roughness: 0.3, metalness: 0.86 });
  const metal = createMaterial(materials, 0x9aa5a8, { roughness: 0.2, metalness: 0.9 });
  const red = createMaterial(materials, 0xf11220, { roughness: 0.26, metalness: 0.5, emissive: 0x260206, emissiveIntensity: 0.34 });

  addRoundedBox(group, [4.0, 3.0, 0.44], [0, 0, -8.94], housing, 'Camera rear module', groups.exit, 0.2);
  addTorus(group, 0.88, 0.1, [0, 0.15, -9.2], metal, 'Viewfinder ring', groups.exit);
  addCylinder(group, 0.68, 0.22, [0, 0.15, -9.24], red, 'Viewfinder light', groups.exit, 48);
  addBox(group, [0.55, 0.12, 0.12], [-1.25, 0.8, -9.24], red, 'Output signal one', groups.exit);
  addBox(group, [0.55, 0.12, 0.12], [1.25, 0.8, -9.24], red, 'Output signal two', groups.exit);
}

export function createCinematicWorld(manager: LoadingManager, assets: CinematicAssetUrls, { mobile }: { mobile: boolean }): CinematicWorld {
  const root = new Group();
  root.name = 'UFirst true camera interior journey';
  const materials: Material[] = [];
  const groups: JourneyGroups = { shell: [], lens: [], aperture: [], shutter: [], sensor: [], processor: [], memory: [], exit: [] };
  const model = new Group();
  model.name = 'Original UFirst cinema camera';
  root.add(model);

  const textureLoader = new TextureLoader(manager);
  const exteriorTexture = textureLoader.load(assets.cameraExterior);
  exteriorTexture.colorSpace = SRGBColorSpace;
  const explodedTexture = textureLoader.load(assets.cameraExploded);
  explodedTexture.colorSpace = SRGBColorSpace;
  const exteriorMaterial = new SpriteMaterial({ map: exteriorTexture, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false });
  const explodedMaterial = new SpriteMaterial({ map: explodedTexture, transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false });
  const exteriorPlate = new Sprite(exteriorMaterial);
  exteriorPlate.name = 'Photorealistic camera exterior plate';
  exteriorPlate.position.set(1.9, 0.2, -2.2);
  exteriorPlate.scale.set(30, 16.875, 1);
  exteriorPlate.renderOrder = 10;
  root.add(exteriorPlate);
  const explodedPlate = new Sprite(explodedMaterial);
  explodedPlate.name = 'Photorealistic camera exploded assembly plate';
  explodedPlate.position.set(0, 0, -5.4);
  explodedPlate.scale.set(18, 10.125, 1);
  explodedPlate.renderOrder = 10;
  root.add(explodedPlate);

  const lensGroup = new Group();
  lensGroup.name = '01 Lens / attention';
  model.add(lensGroup);
  addLens(lensGroup, materials, groups);

  const apertureGroup = new Group();
  apertureGroup.name = '02 Aperture / focus';
  model.add(apertureGroup);
  addAperture(apertureGroup, materials, groups);

  const shutterGroup = new Group();
  shutterGroup.name = '03 Shutter / production';
  model.add(shutterGroup);
  addShutter(shutterGroup, materials, groups);

  const sensorGroup = new Group();
  sensorGroup.name = '04 Sensor / insight';
  model.add(sensorGroup);
  addSensor(sensorGroup, materials, groups);

  const processorGroup = new Group();
  processorGroup.name = '05 Processor / creative';
  model.add(processorGroup);
  addProcessor(processorGroup, materials, groups);

  const memoryGroup = new Group();
  memoryGroup.name = '06 Memory / digital';
  model.add(memoryGroup);
  addMemory(memoryGroup, materials, groups);

  const shellGroup = new Group();
  shellGroup.name = '00 Camera exterior';
  model.add(shellGroup);
  addShell(shellGroup, materials, groups);

  const exitGroup = new Group();
  exitGroup.name = '07 Viewfinder / results';
  model.add(exitGroup);
  addExit(exitGroup, materials, groups);

  const ambient = new AmbientLight(0x9da9ae, mobile ? 2.15 : 1.8);
  ambient.name = 'Soft camera fill';
  root.add(ambient);
  const key = new PointLight(0xfff1dc, mobile ? 130 : 190, 36, 2);
  key.position.set(5, 7, 6);
  root.add(key);
  const redLight = new PointLight(0xe1091a, mobile ? 120 : 180, 32, 2);
  redLight.position.set(-5, 2, -4);
  root.add(redLight);
  const backLight = new PointLight(0x5f9bc0, mobile ? 100 : 150, 28, 2);
  backLight.position.set(2, -4, -10);
  root.add(backLight);

  let elapsed = 0;
  const componentGroups: Array<{ meshes: MeshList; from: number; to: number }> = [
    { meshes: groups.lens, from: 0.02, to: 0.18 },
    { meshes: groups.aperture, from: 0.13, to: 0.3 },
    { meshes: groups.shutter, from: 0.25, to: 0.43 },
    { meshes: groups.sensor, from: 0.37, to: 0.58 },
    { meshes: groups.processor, from: 0.52, to: 0.74 },
    { meshes: groups.memory, from: 0.68, to: 0.88 },
    { meshes: groups.exit, from: 0.82, to: 1 },
  ];

  const update = (progress: number, delta: number) => {
    elapsed += delta;
    const value = MathUtils.clamp(progress, 0, 1);
    const exteriorBlend = 1 - MathUtils.smoothstep(value, 0.055, 0.17);
    const geometryBlend = MathUtils.lerp(0.18, 1, 1 - exteriorBlend);
    model.rotation.y = Math.sin(elapsed * 0.2) * 0.018;
    model.rotation.x = Math.cos(elapsed * 0.16) * 0.012;

    componentGroups.forEach(({ meshes, from, to }, index) => {
      const focus = smoothWindow(value, from, to, 0.1);
      const exteriorLensFocus = index === 0 ? 1 - MathUtils.smoothstep(value, 0.12, 0.24) : 0;
      setOpacity(meshes, MathUtils.lerp(0.08, 1, Math.max(focus, exteriorLensFocus)) * geometryBlend);
    });

    const outside = 1 - MathUtils.smoothstep(value, 0.05, 0.24);
    const returnOutside = MathUtils.smoothstep(value, 0.95, 1);
    setOpacity(groups.shell, MathUtils.clamp(MathUtils.lerp(0.2, 0.95, Math.max(outside, returnOutside)), 0.18, 0.95) * geometryBlend);
    exteriorMaterial.opacity = 0.82 * exteriorBlend;
    explodedMaterial.opacity = 0.72 * MathUtils.smoothstep(value, 0.14, 0.22) * (1 - MathUtils.smoothstep(value, 0.34, 0.44));
    key.intensity = (mobile ? 130 : 190) + Math.sin(elapsed * 0.35) * 8;
    redLight.intensity = (mobile ? 120 : 180) + Math.cos(elapsed * 0.27) * 12;
  };

  const dispose = () => {
    root.traverse((object) => {
      if (object instanceof Mesh) object.geometry.dispose();
    });
    materials.forEach((material) => material.dispose());
    exteriorMaterial.dispose();
    explodedMaterial.dispose();
  };

  return {
    update,
    dispose,
    roots: [root],
    textures: [exteriorTexture, explodedTexture],
    getPrimaryObjects: () => model.children as Object3D[],
  };
}

export function addCinematicLighting() {
  // Lighting is authored inside the physical camera world.
}
