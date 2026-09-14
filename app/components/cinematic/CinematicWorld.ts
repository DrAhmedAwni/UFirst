import {
  AmbientLight,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  LoadingManager,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  TorusGeometry,
} from 'three';
import { localSceneProgress } from './ScrollDirector';
import type { CinematicAssetUrls, CinematicWorld } from './types';

type Surface = Material | Material[];

const RED = 0xf01316;
const TEAL = 0x269ca9;
const CREAM = 0xe8e1d5;
const FLOOR = 0x080b0c;

function roundedBox(width: number, height: number, depth: number, material: Surface, bevel = 0.04) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const radius = Math.min(bevel, halfWidth * 0.42, halfHeight * 0.42);
  const shape = new Shape();
  shape.moveTo(-halfWidth + radius, -halfHeight);
  shape.lineTo(halfWidth - radius, -halfHeight);
  shape.quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius);
  shape.lineTo(halfWidth, halfHeight - radius);
  shape.quadraticCurveTo(halfWidth, halfHeight, halfWidth - radius, halfHeight);
  shape.lineTo(-halfWidth + radius, halfHeight);
  shape.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius);
  shape.lineTo(-halfWidth, -halfHeight + radius);
  shape.quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + radius, -halfHeight);
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 8,
    steps: 1,
  });
  geometry.translate(0, 0, -depth / 2);
  return new Mesh(geometry, material);
}

function addBox(parent: Group, width: number, height: number, depth: number, material: Surface, position: [number, number, number], bevel = 0.04) {
  const mesh = roundedBox(width, height, depth, material, bevel);
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent: Group, radius: number, depth: number, material: Surface, position: [number, number, number], radialSegments = 32, rotateX = 0) {
  const mesh = new Mesh(new CylinderGeometry(radius, radius, depth, radialSegments), material);
  mesh.position.set(...position);
  mesh.rotation.x = rotateX;
  parent.add(mesh);
  return mesh;
}

function addPlane(parent: Group, width: number, height: number, material: Surface, position: [number, number, number], rotationX = 0) {
  const mesh = new Mesh(new PlaneGeometry(width, height), material);
  mesh.position.set(...position);
  mesh.rotation.x = rotationX;
  parent.add(mesh);
  return mesh;
}

function markShadows(root: Group) {
  root.traverse((object) => {
    if (object instanceof Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

function createUShape(material: Surface) {
  const shape = new Shape();
  shape.moveTo(-1.05, 1.05);
  shape.lineTo(-1.05, -0.2);
  shape.bezierCurveTo(-1.05, -1.5, 1.05, -1.5, 1.05, -0.2);
  shape.lineTo(1.05, 1.05);
  shape.lineTo(0.48, 1.05);
  shape.lineTo(0.48, -0.18);
  shape.bezierCurveTo(0.48, -0.8, -0.48, -0.8, -0.48, -0.18);
  shape.lineTo(-0.48, 1.05);
  shape.closePath();
  return new Mesh(new ExtrudeGeometry(shape, {
    depth: 0.46,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.08,
    bevelThickness: 0.09,
    curveSegments: 24,
    steps: 1,
  }), material);
}

function createLensRing(parent: Group, radius: number, tube: number, z: number, material: Surface) {
  const ring = new Mesh(new TorusGeometry(radius, tube, 12, 64), material);
  ring.position.z = z;
  parent.add(ring);
  return ring;
}

function createScreen(width: number, height: number, depth: number, texture: Texture, frameMaterial: Surface) {
  const group = new Group();
  addBox(group, width + 0.16, height + 0.16, depth, frameMaterial, [0, 0, 0], 0.06);
  const screenMaterial = texture
    ? new MeshBasicMaterial({ map: texture, side: DoubleSide, depthTest: false, toneMapped: false })
    : new MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 0.42, roughness: 0.32, metalness: 0.2 });
  const screen = new Mesh(new PlaneGeometry(width, height), screenMaterial);
  screen.position.z = depth / 2 + 0.09;
  screen.renderOrder = 10;
  group.add(screen);
  return group;
}

function createCinemaCamera(materials: {
  charcoal: Surface;
  metal: Surface;
  red: Surface;
  teal: Surface;
  glass: Surface;
  cream: Surface;
}) {
  const root = new Group();
  root.name = 'UFirst fictional cinema camera';
  root.position.set(2.2, 0, 0);

  addBox(root, 1.65, 1.08, 0.86, materials.charcoal, [0, 0, -0.18], 0.1);
  addBox(root, 1.35, 0.16, 0.75, materials.metal, [0, 0.62, -0.18], 0.04);
  addBox(root, 0.7, 0.14, 0.55, materials.red, [0, 0.72, -0.18], 0.03);
  addBox(root, 0.2, 0.84, 0.07, materials.metal, [-0.86, 0, -0.18], 0.02);

  const cameraBase = new Mesh(new CylinderGeometry(1.45, 1.62, 0.22, 64), materials.metal);
  cameraBase.position.set(0, 0.11, -0.18);
  root.add(cameraBase);
  addCylinder(root, 0.13, 1.05, materials.metal, [0, 0.65, -0.18], 24);
  addBox(root, 0.72, 0.12, 0.62, materials.charcoal, [0, 1.17, -0.18], 0.03);

  const cameraBadge = createUShape(materials.red);
  cameraBadge.name = 'UFirst camera badge';
  cameraBadge.scale.setScalar(0.22);
  cameraBadge.position.set(-0.38, 0.03, 0.28);
  root.add(cameraBadge);

  for (let index = 0; index < 7; index += 1) {
    addBox(root, 0.58, 0.026, 0.035, materials.cream, [-0.63, 0.27 - index * 0.09, 0.28], 0.006);
  }

  const rails = new Group();
  rails.name = 'camera rails';
  [0.34, -0.34].forEach((x) => addCylinder(rails, 0.025, 1.65, materials.metal, [x, -0.38, 0.02], 16, Math.PI / 2));
  root.add(rails);

  const handle = new Group();
  addBox(handle, 0.78, 0.12, 0.16, materials.metal, [0, 0, 0], 0.035);
  addBox(handle, 0.1, 0.42, 0.16, materials.metal, [-0.31, -0.21, 0], 0.025);
  addBox(handle, 0.1, 0.42, 0.16, materials.metal, [0.31, -0.21, 0], 0.025);
  handle.position.set(0, 0.94, -0.16);
  root.add(handle);

  const lens = new Group();
  lens.name = 'lens assembly';
  lens.position.z = 0.34;
  [
    [0.47, 0.24, materials.metal],
    [0.43, 0.18, materials.charcoal],
    [0.39, 0.16, materials.metal],
  ].forEach(([radius, depth, material], index) => {
    addCylinder(lens, radius as number, depth as number, material as Surface, [0, 0, index * 0.22], 48, Math.PI / 2);
  });
  const focusRings = [0.55, 0.77].map((z, index) => createLensRing(lens, index ? 0.405 : 0.445, 0.032, z, index ? materials.red : materials.cream));
  createLensRing(lens, 0.33, 0.02, 0.96, materials.teal);
  const matteBox = new Group();
  addBox(matteBox, 0.76, 0.56, 0.42, materials.charcoal, [0, 0, 0], 0.05);
  addBox(matteBox, 0.82, 0.07, 0.08, materials.metal, [0, 0.23, 0.16], 0.02);
  addBox(matteBox, 0.82, 0.07, 0.08, materials.metal, [0, -0.23, 0.16], 0.02);
  matteBox.position.z = 1.04;
  lens.add(matteBox);

  const frontGlass = new Mesh(new CylinderGeometry(0.31, 0.31, 0.045, 64), materials.glass);
  frontGlass.rotation.x = Math.PI / 2;
  frontGlass.position.z = 1.28;
  lens.add(frontGlass);

  const aperture = new Group();
  aperture.name = 'real aperture blades';
  const bladeShape = new Shape();
  bladeShape.moveTo(0, -0.04);
  bladeShape.lineTo(0.38, -0.15);
  bladeShape.lineTo(0.5, 0.13);
  bladeShape.lineTo(0.12, 0.2);
  bladeShape.closePath();
  for (let index = 0; index < 8; index += 1) {
    const blade = new Mesh(new ExtrudeGeometry(bladeShape, { depth: 0.035, bevelEnabled: false, curveSegments: 4 }), materials.metal);
    blade.rotation.z = index * Math.PI / 4;
    blade.position.z = 1.305;
    aperture.add(blade);
  }
  lens.add(aperture);
  root.add(lens);

  const monitor = new Group();
  addBox(monitor, 0.74, 0.5, 0.1, materials.charcoal, [0, 0, 0], 0.035);
  addBox(monitor, 0.58, 0.34, 0.008, materials.teal, [0, 0, 0.057], 0.01);
  addBox(monitor, 0.08, 0.38, 0.04, materials.metal, [0, -0.38, 0], 0.02);
  monitor.position.set(0.63, 0.62, -0.2);
  monitor.rotation.y = -0.22;
  root.add(monitor);

  const indicator = new Mesh(new SphereGeometry(0.045, 16, 12), new MeshBasicMaterial({ color: RED }));
  indicator.position.set(0.55, 0.29, 0.27);
  root.add(indicator);
  const indicatorLight = new PointLight(RED, 0.7, 2.3, 2);
  indicatorLight.position.copy(indicator.position);
  root.add(indicatorLight);

  markShadows(root);
  return { root, lens, aperture, focusRings, indicator, indicatorLight };
}

function createDoorChamber(materials: { charcoal: Surface; metal: Surface; red: Surface; cream: Surface }) {
  const root = new Group();
  root.name = 'UFirst monumental door chamber';
  root.position.z = -20;

  addBox(root, 22, 0.7, 16, materials.charcoal, [0, 9.7, 0], 0.1);
  addBox(root, 0.8, 9.7, 16, materials.charcoal, [-10.5, 4.85, 0], 0.1);
  addBox(root, 0.8, 9.7, 16, materials.charcoal, [10.5, 4.85, 0], 0.1);
  addPlane(root, 28, 34, new MeshStandardMaterial({ color: 0x111c1f, roughness: 0.58, metalness: 0.16 }), [0, 0, 0], -Math.PI / 2);

  addBox(root, 0.75, 10.2, 1.25, materials.metal, [-6.15, 5.1, 0], 0.08);
  addBox(root, 0.75, 10.2, 1.25, materials.metal, [6.15, 5.1, 0], 0.08);
  addBox(root, 13, 0.8, 1.25, materials.metal, [0, 10.0, 0], 0.08);
  addBox(root, 12.2, 0.45, 0.9, materials.red, [0, 9.55, 0.05], 0.03);

  const leftPivot = new Group();
  leftPivot.name = 'left door hinge pivot';
  leftPivot.position.set(-5.6, 0, 0);
  const leftLeaf = addBox(leftPivot, 5.6, 8.7, 0.76, materials.charcoal, [2.8, 4.35, 0], 0.1);
  addBox(leftPivot, 0.14, 7.2, 0.06, materials.red, [0.45, 4.35, 0.41], 0.02);
  addBox(leftPivot, 3.6, 0.12, 0.08, materials.metal, [2.8, 6.65, 0.42], 0.02);
  addBox(leftPivot, 3.6, 0.12, 0.08, materials.metal, [2.8, 2.05, 0.42], 0.02);
  root.add(leftPivot);

  const rightPivot = new Group();
  rightPivot.name = 'right door hinge pivot';
  rightPivot.position.set(5.6, 0, 0);
  const rightLeaf = addBox(rightPivot, 5.6, 8.7, 0.76, materials.charcoal, [-2.8, 4.35, 0], 0.1);
  addBox(rightPivot, 0.14, 7.2, 0.06, materials.red, [-0.45, 4.35, 0.41], 0.02);
  addBox(rightPivot, 3.6, 0.12, 0.08, materials.metal, [-2.8, 6.65, 0.42], 0.02);
  addBox(rightPivot, 3.6, 0.12, 0.08, materials.metal, [-2.8, 2.05, 0.42], 0.02);
  root.add(rightPivot);

  [leftPivot, rightPivot].forEach((pivot) => {
    [1.3, 4.35, 7.4].forEach((y) => addCylinder(pivot, 0.15, 0.48, materials.cream, [0, y, 0], 24));
  });

  const lightSurface = new MeshBasicMaterial({ color: 0xffd7a2, transparent: true, opacity: 0.02, side: DoubleSide, toneMapped: false });
  const lightLeak = addPlane(root, 10, 8, lightSurface, [0, 4.5, -0.58]);
  const light = new PointLight(0xffd5a0, 0.8, 24, 1.4);
  light.position.set(0, 4.8, -1.6);
  root.add(light);

  const foregroundBlock = addBox(root, 2.4, 3.2, 1.8, materials.charcoal, [-8.5, 1.6, 4.0], 0.12);
  foregroundBlock.rotation.y = 0.08;
  const threshold = addBox(root, 12.2, 0.18, 1.5, materials.cream, [0, 0.12, 0.05], 0.03);
  threshold.castShadow = false;
  markShadows(root);
  return { root, leftPivot, rightPivot, lightLeak, light, leftLeaf, rightLeaf };
}

function createPhone(texture: Texture, materials: { charcoal: Surface; metal: Surface }) {
  const phone = new Group();
  addBox(phone, 0.82, 1.55, 0.14, materials.charcoal, [0, 0, 0], 0.09);
  const screenMaterial = texture
    ? new MeshBasicMaterial({ map: texture, side: DoubleSide, depthTest: false, toneMapped: false })
    : new MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 0.42, roughness: 0.32, metalness: 0.2 });
  const screen = new Mesh(new PlaneGeometry(0.68, 1.35), screenMaterial);
  screen.position.z = 0.14;
  screen.renderOrder = 10;
  phone.add(screen);
  [0.26, -0.22].forEach((x) => addBox(phone, 0.055, 0.025, 0.025, materials.metal, [x, -0.77, 0.03], 0.008));
  return phone;
}

function createSoftbox(materials: { charcoal: Surface; cream: Surface; red: Surface }) {
  const softbox = new Group();
  addBox(softbox, 1.4, 0.9, 0.18, materials.charcoal, [0, 0, 0], 0.08);
  addBox(softbox, 1.1, 0.6, 0.03, materials.cream, [0, 0, 0.105], 0.03);
  addBox(softbox, 0.08, 1.15, 0.08, materials.red, [0, -0.92, 0], 0.02);
  softbox.position.set(3.8, 4.0, -33.5);
  softbox.rotation.z = -0.16;
  return softbox;
}

function createGrowthStation(texture: Texture, materials: { charcoal: Surface; teal: Surface; red: Surface; cream: Surface }) {
  const station = createScreen(2.2, 1.45, 0.18, texture, materials.charcoal);
  station.name = 'growth performance display';
  [0.3, 0.62, 0.95, 1.35].forEach((height, index) => addBox(station, 0.2, height, 0.22, index === 3 ? materials.red : materials.teal, [(index - 1.5) * 0.38, height / 2 - 0.52, 0.17], 0.025));
  addBox(station, 1.9, 0.055, 0.28, materials.cream, [0, -0.55, 0.18], 0.02);
  return station;
}

function createStudioWorld(textures: Texture[], materials: { charcoal: Surface; metal: Surface; red: Surface; teal: Surface; cream: Surface }) {
  const root = new Group();
  root.name = 'UFirst connected production studio';
  const floorMaterial = new MeshStandardMaterial({ color: FLOOR, roughness: 0.58, metalness: 0.22 });
  addPlane(root, 24, 60, floorMaterial, [0, 0, -44], -Math.PI / 2);
  [-8.8, 8.8].forEach((x) => {
    [-32, -44, -56].forEach((z) => addBox(root, 0.34, 5.8, 0.34, materials.charcoal, [x, 2.9, z], 0.04));
  });

  const platform = new Mesh(new CylinderGeometry(2.3, 2.45, 0.22, 64), materials.metal);
  platform.position.set(0, 0.14, -31.6);
  root.add(platform);
  const mark = createUShape(materials.red);
  mark.name = 'physical UFirst brand sculpture';
  mark.scale.setScalar(1.18);
  mark.position.set(0, 2.7, -31.6);
  root.add(mark);
  createLensRing(root, 1.75, 0.025, -31.35, materials.teal).rotation.x = Math.PI / 2;

  addBox(root, 7.2, 0.75, 1.9, materials.metal, [-3.5, 1.0, -36.0], 0.08);
  addBox(root, 0.22, 1.0, 1.5, materials.metal, [-6.6, 0.5, -36.0], 0.04);
  addBox(root, 0.22, 1.0, 1.5, materials.metal, [-0.4, 0.5, -36.0], 0.04);

  const strategyBoard = createScreen(2.15, 1.55, 0.18, textures[0], materials.charcoal);
  strategyBoard.position.set(-4.6, 2.35, -38.2);
  strategyBoard.rotation.y = 0.16;
  root.add(strategyBoard);

  const creativeBoard = createScreen(2.45, 1.55, 0.18, textures[1], materials.charcoal);
  creativeBoard.position.set(0, 2.35, -39.8);
  root.add(creativeBoard);

  const serviceCamera = createCinemaCamera(materials as { charcoal: Surface; metal: Surface; red: Surface; teal: Surface; glass: Surface; cream: Surface });
  serviceCamera.root.scale.setScalar(0.34);
  serviceCamera.root.position.set(4.15, 1.5, -41.5);
  serviceCamera.root.rotation.y = -0.24;
  root.add(serviceCamera.root);

  const phone = createPhone(textures[3], materials);
  phone.position.set(-3.9, 1.6, -43.6);
  phone.rotation.y = 0.16;
  root.add(phone);

  const digitalWall = createScreen(2.7, 1.6, 0.2, textures[2], materials.charcoal);
  digitalWall.position.set(0, 3.0, -44.5);
  digitalWall.rotation.y = -0.1;
  root.add(digitalWall);

  const growth = createGrowthStation(textures[4], materials);
  growth.position.set(3.9, 2.2, -46.2);
  growth.rotation.y = -0.18;
  root.add(growth);

  root.add(createSoftbox(materials));
  const productionLight = new PointLight(0xffc98a, 2.2, 8, 2);
  productionLight.position.set(3.2, 3.4, -40.0);
  root.add(productionLight);
  const tealLight = new PointLight(TEAL, 2.1, 10, 2);
  tealLight.position.set(-4.2, 2.3, -44.5);
  root.add(tealLight);

  markShadows(root);
  return { root, mark, serviceCamera: serviceCamera.root, strategyBoard, creativeBoard, phone, growth };
}

function createPortfolioWorld(textures: Texture[], materials: { charcoal: Surface; metal: Surface; red: Surface; cream: Surface }) {
  const root = new Group();
  root.name = 'UFirst physical project gallery';
  addPlane(root, 24, 34, new MeshStandardMaterial({ color: 0x101a1c, roughness: 0.56, metalness: 0.2 }), [0, 0, -54], -Math.PI / 2);

  const displays = [
    { position: [-4.0, 2.4, -50.5] as [number, number, number], rotation: 0.12, texture: textures[0] },
    { position: [0, 2.5, -53.2] as [number, number, number], rotation: -0.04, texture: textures[1] },
    { position: [4.0, 2.35, -55.7] as [number, number, number], rotation: -0.12, texture: textures[2] },
  ];
  displays.forEach(({ position, rotation, texture }, index) => {
    const display = createScreen(2.75, 1.65, 0.26, texture, materials.charcoal);
    display.position.set(...position);
    display.rotation.y = rotation;
    root.add(display);
    addBox(root, 0.2, 1.35, 0.2, materials.metal, [position[0], 0.82, position[2]], 0.03);
    addBox(root, 2.5, 0.16, 0.55, materials.cream, [position[0], 0.18, position[2]], 0.03);
    if (index === 1) addBox(root, 0.14, 1.35, 0.06, materials.red, [position[0], 2.4, position[2] + 0.16], 0.02);
  });
  const finalBillboard = createScreen(4.6, 2.2, 0.3, textures[4], materials.metal);
  finalBillboard.position.set(0, 3.3, -59.0);
  root.add(finalBillboard);
  const finalLight = new PointLight(0xffd6a6, 2.5, 10, 2);
  finalLight.position.set(0, 3.8, -58.0);
  root.add(finalLight);
  markShadows(root);
  return { root, displays: root.children.filter((child) => child instanceof Group), finalBillboard };
}

export function createCinematicWorld(manager: LoadingManager, assets: CinematicAssetUrls, options: { mobile?: boolean } = {}): CinematicWorld {
  const mobile = options.mobile ?? false;
  const loader = new TextureLoader(manager);
  const urls = [assets.brand, assets.creative, assets.production, assets.social, assets.growth, ...assets.projects];
  const textures = urls.map((url) => {
    const texture = loader.load(url);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  });
  const projectTextures = textures.slice(5).length ? textures.slice(5) : textures.slice(0, 3);
  while (projectTextures.length < 3) projectTextures.push(textures[0]);

  const charcoal = new MeshStandardMaterial({ color: 0x304247, roughness: 0.34, metalness: 0.42, emissive: 0x0a1315, emissiveIntensity: 0.24 });
  const metal = new MeshStandardMaterial({ color: 0x87959a, roughness: 0.24, metalness: 0.68, emissive: 0x11181a, emissiveIntensity: 0.08 });
  const red = new MeshStandardMaterial({ color: RED, roughness: 0.3, metalness: 0.36, emissive: 0x4e0506, emissiveIntensity: 0.22 });
  const teal = new MeshStandardMaterial({ color: TEAL, roughness: 0.28, metalness: 0.42, emissive: 0x062e34, emissiveIntensity: 0.28 });
  const cream = new MeshStandardMaterial({ color: CREAM, roughness: 0.38, metalness: 0.25 });
  const glass = new MeshPhysicalMaterial({ color: 0x183a40, roughness: 0.08, metalness: 0.15, transmission: 0.28, thickness: 0.08, transparent: true, opacity: 0.78 });

  const cameraSet = createCinemaCamera({ charcoal, metal, red, teal, glass, cream });
  const cameraFloor = new Mesh(new PlaneGeometry(30, 42), new MeshStandardMaterial({ color: FLOOR, roughness: 0.62, metalness: 0.2 }));
  cameraFloor.rotation.x = -Math.PI / 2;
  cameraFloor.position.set(0, 0, 0);
  cameraSet.root.add(cameraFloor);
  const cameraBackdrop = new Mesh(new PlaneGeometry(30, 24), new MeshStandardMaterial({ color: 0x0d171a, roughness: 0.72, metalness: 0.12 }));
  cameraBackdrop.position.set(0, 8, -12);
  cameraSet.root.add(cameraBackdrop);
  const heroWarmLight = new PointLight(0xffd6ad, 14, 15, 2);
  heroWarmLight.position.set(2.8, 4.8, 5.5);
  cameraSet.root.add(heroWarmLight);
  const heroTealLight = new PointLight(TEAL, 10, 13, 2);
  heroTealLight.position.set(-3.4, 2.2, 3.8);
  cameraSet.root.add(heroTealLight);
  cameraSet.root.scale.setScalar(1.16);

  const doorSet = createDoorChamber({ charcoal, metal, red, cream });
  const studioSet = createStudioWorld(textures, { charcoal, metal, red, teal, cream });
  const portfolioSet = createPortfolioWorld(projectTextures, { charcoal, metal, red, cream });
  const roots = [cameraSet.root, doorSet.root, studioSet.root, portfolioSet.root];
  cameraSet.aperture.children.forEach((blade, index) => { blade.visible = !mobile || index % 2 === 0; });
  if (mobile) studioSet.serviceCamera.scale.multiplyScalar(0.82);

  return {
    roots,
    textures,
    getPrimaryObjects: () => [cameraSet.root, doorSet.root, studioSet.root, portfolioSet.root],
    update(progress, delta) {
      const opening = localSceneProgress(progress, 0.4, 0.54);
      const doorAngle = opening * opening * (3 - 2 * opening) * Math.PI * 0.42;
      doorSet.leftPivot.rotation.y = -doorAngle;
      doorSet.rightPivot.rotation.y = doorAngle;
      doorSet.light.intensity = 0.18 + opening * 4.8;
      (doorSet.lightLeak.material as MeshBasicMaterial).opacity = 0.01 + opening * 0.08;

      const lensProgress = localSceneProgress(progress, 0.14, 0.28);
      cameraSet.focusRings.forEach((ring, index) => { ring.rotation.z += delta * (0.18 + index * 0.08) * (1 + lensProgress); });
      cameraSet.aperture.children.forEach((blade, index) => {
        blade.scale.setScalar(0.62 + lensProgress * 0.65);
        blade.rotation.z = index * Math.PI / 4 + lensProgress * 0.12;
      });
      cameraSet.indicatorLight.intensity = 0.4 + Math.sin(progress * Math.PI * 12) * 0.16;

      studioSet.mark.rotation.y = Math.sin(progress * Math.PI * 1.4) * 0.18;
      studioSet.serviceCamera.rotation.y = -0.24 + Math.sin(progress * Math.PI * 2) * 0.05;
      studioSet.phone.rotation.z = Math.sin(progress * Math.PI * 2) * 0.015;
      studioSet.growth.rotation.y = -0.18 + Math.sin(progress * Math.PI * 1.8) * 0.03;

      cameraSet.root.visible = progress < 0.33;
      doorSet.root.visible = progress >= 0.25 && progress < 0.67;
      studioSet.root.visible = progress >= 0.5 && progress < 0.82;
      portfolioSet.root.visible = progress >= 0.8;
    },
    dispose() {
      roots.forEach((root) => {
        root.traverse((object) => {
          if (object instanceof Mesh) {
            object.geometry.dispose();
            const material = object.material;
            if (Array.isArray(material)) material.forEach((item) => item.dispose());
            else material.dispose();
          }
        });
      });
      textures.forEach((texture) => texture.dispose());
    },
  };
}

export function addCinematicLighting(scene: { add: (...objects: Array<AmbientLight | DirectionalLight>) => void }) {
  const ambient = new AmbientLight(0xffffff, 0.42);
  const key = new DirectionalLight(0xffead1, 3.4);
  key.position.set(5, 8, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 45;
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -4;
  const rim = new DirectionalLight(0x5ed0d9, 3.5);
  rim.position.set(-8, 5, -7);
  scene.add(ambient, key, rim);
}
