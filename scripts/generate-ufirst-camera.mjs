import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Scene,
  TorusGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((result) => {
      this.result = result;
      this.onloadend?.();
    });
  }
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobile = process.argv.includes('--mobile');
const distant = process.argv.includes('--distant');
const outputPath = path.resolve(__dirname, distant ? '../public/models/ufirst-camera-distant.glb' : mobile ? '../public/models/ufirst-camera-mobile.glb' : '../public/models/ufirst-camera-production.glb');
const materials = [];

const radial = (value) => distant ? Math.max(10, Math.round(value * 0.3)) : mobile ? Math.max(16, Math.round(value * 0.55)) : value;
const detail = (value) => distant ? 1 : mobile ? Math.max(2, value - 1) : value;

function material(color, options = {}) {
  const value = new MeshPhysicalMaterial({
    color,
    metalness: 0.66,
    roughness: 0.34,
    clearcoat: 0.18,
    clearcoatRoughness: 0.24,
    side: DoubleSide,
    ...options,
  });
  materials.push(value);
  return value;
}

function mesh(parent, geometry, materialValue, name, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const value = new Mesh(geometry, materialValue);
  value.name = name;
  value.position.set(...position);
  value.rotation.set(...rotation);
  parent.add(value);
  return value;
}

function rounded(parent, size, position, materialValue, name, radius = 0.12, segments = 3) {
  return mesh(parent, new RoundedBoxGeometry(...size, detail(segments), radius), materialValue, name, position);
}

function box(parent, size, position, materialValue, name, rotation = [0, 0, 0]) {
  return mesh(parent, new BoxGeometry(...size), materialValue, name, position, rotation);
}

function cylinder(parent, radius, depth, position, materialValue, name, radialSegments = 48, rotation = [Math.PI / 2, 0, 0]) {
  return mesh(parent, new CylinderGeometry(radius, radius, depth, radial(radialSegments)), materialValue, name, position, rotation);
}

function verticalCylinder(parent, radius, depth, position, materialValue, name, radialSegments = 32) {
  return mesh(parent, new CylinderGeometry(radius, radius, depth, radial(radialSegments)), materialValue, name, position);
}

function torus(parent, radius, tube, position, materialValue, name, rotation = [0, 0, 0]) {
  return mesh(parent, new TorusGeometry(radius, tube, mobile ? 10 : 18, radial(72)), materialValue, name, position, rotation);
}

function pivot(parent, name, position = [0, 0, 0]) {
  const value = new Group();
  value.name = name;
  value.position.set(...position);
  parent.add(value);
  return value;
}

function screw(parent, position, metal, name, rotation = [Math.PI / 2, 0, 0]) {
  return mesh(parent, new CylinderGeometry(0.07, 0.07, 0.075, 16), metal, name, position, rotation);
}

function dial(parent, position, dark, metal, accent, name) {
  verticalCylinder(parent, 0.34, 0.22, position, dark, `${name} base`, 36);
  torus(parent, 0.34, 0.045, [position[0], position[1] + 0.12, position[2]], accent, `${name} accent`, [Math.PI / 2, 0, 0]);
  const knurls = distant ? 6 : mobile ? 10 : 18;
  for (let index = 0; index < knurls; index += 1) {
    const angle = (index / knurls) * Math.PI * 2;
    box(parent, [0.035, 0.09, 0.09], [position[0] + Math.cos(angle) * 0.31, position[1] + 0.14, position[2] + Math.sin(angle) * 0.31], metal, `${name} knurl ${String(index + 1).padStart(2, '0')}`, [0, angle, 0]);
  }
}

const body = material(0x171d20, { metalness: 0.78, roughness: 0.3, clearcoat: 0.28 });
const bodyEdge = material(0x5c686c, { metalness: 0.92, roughness: 0.2 });
const darkRubber = material(0x070a0c, { metalness: 0.08, roughness: 0.82 });
const blackMetal = material(0x242c30, { metalness: 0.9, roughness: 0.23 });
const silverMetal = material(0x9aa4a7, { metalness: 0.95, roughness: 0.18 });
const brushedMetal = material(0x687579, { metalness: 0.9, roughness: 0.28 });
const red = material(0xd91020, { metalness: 0.5, roughness: 0.24, emissive: 0x260205, emissiveIntensity: 0.2 });
const glass = material(0x2b596b, { metalness: 0.2, roughness: 0.08, transmission: 0.46, thickness: 0.22, ior: 1.48, emissive: 0x071b24, emissiveIntensity: 0.3, transparent: true, opacity: 0.92 });
const glassDark = material(0x111b20, { metalness: 0.24, roughness: 0.12, transmission: 0.3, thickness: 0.16, ior: 1.46, transparent: true, opacity: 0.9 });
const apertureMetal = material(0x4f5a5e, { metalness: 0.95, roughness: 0.22 });
const board = material(0x102d28, { metalness: 0.38, roughness: 0.5 });
const copper = material(0xb87537, { metalness: 0.88, roughness: 0.2 });
const sensorMaterial = material(0x173b4d, { metalness: 0.32, roughness: 0.18, emissive: 0x082638, emissiveIntensity: 0.32 });
const white = material(0xd5dcda, { metalness: 0.28, roughness: 0.44 });

function buildExterior(group) {
  const bodyShell = pivot(group, 'BodyShellPivot', [0, 0, -5.7]);
  const top = pivot(group, 'TopPlatePivot', [0, 0, -5.7]);
  pivot(group, 'BottomPlatePivot', [0, 0, -5.7]);
  pivot(group, 'GripPivot', [0, 0, -5.7]);
  const display = pivot(group, 'DisplayPivot', [0, 0, -5.15]);
  const battery = pivot(group, 'BatteryDoorPivot', [0, 0, -6.8]);

  rounded(bodyShell, [4.95, 3.25, 0.18], [0, 0, 0], body, 'CameraBody', 0.12);
  rounded(group, [5.55, 0.32, 5.2], [0, 1.9, -5.7], body, 'TopPlate', 0.1);
  rounded(group, [5.55, 0.32, 5.2], [0, -1.9, -5.7], body, 'BottomPlate', 0.1);
  rounded(group, [0.32, 3.55, 5.2], [-2.62, 0, -5.7], body, 'LeftBodyRail', 0.1);
  rounded(group, [0.32, 3.55, 5.2], [2.62, 0, -5.7], body, 'RightBodyRail', 0.1);
  rounded(group, [5.15, 3.5, 0.24], [0, 0, -3.18], bodyEdge, 'FrontChassisPlate', 0.08);
  rounded(group, [5.15, 3.5, 0.24], [0, 0, -8.34], body, 'RearChassisPlate', 0.08);
  rounded(group, [4.7, 3.05, 0.22], [0, 0, -8.5], darkRubber, 'RearGripPanel', 0.18);
  rounded(group, [5.9, 0.38, 1.18], [0, 2.46, -5.72], body, 'TopCarryHandle', 0.13);
  rounded(group, [5.2, 0.14, 0.16], [0, 2.29, -5.72], red, 'UFirstAccentRail', 0.04);
  rounded(group, [0.38, 2.9, 1.55], [2.76, 0, -5.78], darkRubber, 'Grip', 0.18);
  rounded(group, [0.3, 2.38, 0.2], [2.98, 0, -5.78], red, 'GripAccent', 0.05);

  dial(top, [-1.46, 2.17, -5.1], darkRubber, brushedMetal, red, 'RecordDial');
  dial(top, [-0.5, 2.17, -5.1], darkRubber, brushedMetal, bodyEdge, 'ShutterDial');
  verticalCylinder(top, 0.15, 0.18, [0.52, 2.2, -5.1], red, 'Buttons', 28);
  verticalCylinder(top, 0.15, 0.18, [0.84, 2.2, -5.1], bodyEdge, 'SecondaryButton', 24);
  verticalCylinder(top, 0.22, 0.12, [-1.46, 2.33, -5.1], brushedMetal, 'Dials', 32);
  rounded(display, [1.08, 0.08, 0.62], [1.72, 0.02, 0], glassDark, 'Display', 0.04);
  box(display, [0.68, 0.018, 0.02], [1.72, 0.01, 0.02], red, 'DisplayStatusLine');

  rounded(battery, [1.58, 0.14, 1.42], [0, 0, 0], blackMetal, 'BatteryDoor', 0.08);
  rounded(battery, [1.22, 0.08, 1.08], [0, 0, -0.1], darkRubber, 'BatteryDoorInset', 0.07);
  rounded(battery, [0.86, 0.5, 0.74], [0, 0, -0.28], blackMetal, 'Battery', 0.06);
  screw(group, [-2.8, -1.22, -5.08], silverMetal, 'ScrewsAndFasteners');
  for (let index = 0; index < 4; index += 1) {
    screw(group, [-2.8, -1.22 + index * 0.82, -5.08], silverMetal, `ExteriorFastener${String(index + 1).padStart(2, '0')}`);
  }
}

function buildLens(group) {
  const mount = pivot(group, 'LensMountPivot', [0, 0, -2.96]);
  const barrel = pivot(mount, 'LensBarrelPivot', [0, 0, 0]);
  const focus = pivot(barrel, 'FocusRingPivot', [0, 0, 0]);
  rounded(mount, [3.12, 3.12, 0.38], [0, 0, -0.05], blackMetal, 'LensMount', 0.18);
  torus(mount, 1.58, 0.1, [0, 0, 0.19], silverMetal, 'LensMountMetalEdge');
  cylinder(barrel, 2.42, 0.52, [0, 0, 0.02], body, 'LensHousing', 72);
  torus(barrel, 2.27, 0.13, [0, 0, 0.3], silverMetal, 'LensHousingFrontEdge');
  torus(focus, 1.92, 0.13, [0, 0, -0.28], darkRubber, 'FocusRing');
  torus(focus, 1.94, 0.045, [0, 0, -0.13], red, 'LensRedIndex');
  cylinder(barrel, 1.88, 0.36, [0, 0, -0.42], blackMetal, 'LensBarrel', 72);
  for (let index = 0; index < 5; index += 1) torus(barrel, 1.8 - index * 0.05, 0.025, [0, 0, -0.28 - index * 0.12], bodyEdge, `LensBarrelGroove${String(index + 1).padStart(2, '0')}`);
  torus(barrel, 1.74, 0.07, [0, 0, -0.56], brushedMetal, 'LensInnerEdge');
  cylinder(barrel, 2.05, 0.08, [0, 0, 0.35], glass, 'FrontLens', 72);
  cylinder(barrel, 1.62, 0.11, [0, 0, -0.6], glassDark, 'LensGlass01', 72);
  cylinder(barrel, 1.45, 0.1, [0, 0, -0.88], glass, 'LensGlass02', 72);
  cylinder(barrel, 1.24, 0.1, [0, 0, -1.17], glassDark, 'LensGlass03', 72);
  torus(barrel, 1.28, 0.045, [0, 0, -1.22], silverMetal, 'OpticalRetainingRing');
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    verticalCylinder(group, 0.08, 0.16, [Math.cos(angle) * 2.03, Math.sin(angle) * 2.03, 0.02], red, `LensCalibrationMarker${String(index + 1).padStart(2, '0')}`, 18);
  }
}

function buildAperture(group) {
  const aperture = pivot(group, 'AperturePivot', [0, 0, -1.72]);
  torus(aperture, 1.52, 0.1, [0, 0, 0], apertureMetal, 'Aperture');
  for (let index = 0; index < 8; index += 1) {
    const angle = (index / 8) * Math.PI * 2;
    const blade = rounded(aperture, [1.32, 0.2, 0.07], [Math.cos(angle) * 0.45, Math.sin(angle) * 0.45, 0], silverMetal, `ApertureBlade${String(index + 1).padStart(2, '0')}`, 0.06);
    blade.rotation.z = angle + 0.42;
  }
  cylinder(aperture, 0.52, 0.14, [0, 0, -0.06], blackMetal, 'ApertureOpening', 64);
  torus(aperture, 0.72, 0.055, [0, 0, -0.1], red, 'ApertureTimingRing');
}

function buildShutter(group) {
  const shutter = pivot(group, 'ShutterPivot', [0, 0, -2.62]);
  rounded(shutter, [3.82, 0.16, 0.14], [0, 0.96, 0], silverMetal, 'Shutter', 0.04);
  rounded(shutter, [3.82, 0.16, 0.14], [0, -0.96, 0], silverMetal, 'ShutterCurtainLower', 0.04);
  rounded(shutter, [0.18, 2.08, 0.14], [-1.78, 0, 0], blackMetal, 'ShutterRailLeft', 0.04);
  rounded(shutter, [0.18, 2.08, 0.14], [1.78, 0, 0], blackMetal, 'ShutterRailRight', 0.04);
  torus(shutter, 1.72, 0.06, [0, 0, -0.12], red, 'ShutterTimingRing');
  for (let index = 0; index < 6; index += 1) {
    screw(shutter, [-1.18 + index * 0.47, 1.12, -0.14], silverMetal, `ShutterFastenerUpper${String(index + 1).padStart(2, '0')}`);
    screw(shutter, [-1.18 + index * 0.47, -1.12, -0.14], silverMetal, `ShutterFastenerLower${String(index + 1).padStart(2, '0')}`);
  }
}

function buildSensor(group) {
  const sensor = pivot(group, 'SensorPivot', [0, 0, -4.08]);
  rounded(sensor, [3.88, 2.96, 0.18], [0, 0, 0], blackMetal, 'InternalFrame', 0.1);
  rounded(sensor, [3.12, 2.18, 0.15], [0, 0, -0.12], sensorMaterial, 'Sensor', 0.04);
  torus(sensor, 1.56, 0.065, [0, 0, -0.22], red, 'SensorReadoutRing');
  const sensorRows = distant ? 3 : mobile ? 5 : 7;
  const sensorColumns = distant ? 5 : mobile ? 8 : 10;
  for (let y = 0; y < sensorRows; y += 1) {
    for (let x = 0; x < sensorColumns; x += 1) {
      box(sensor, [0.075, 0.075, 0.025], [-0.84 + x * 0.24, -0.48 + y * 0.24, -0.22], white, `SensorPixel${String(y * sensorColumns + x + 1).padStart(3, '0')}`);
    }
  }
  for (let index = 0; index < 12; index += 1) box(sensor, [0.08, 0.32, 0.04], [-1.34 + index * 0.24, -1.28, -0.2], copper, `SensorContact${String(index + 1).padStart(2, '0')}`);
}

function buildProcessor(group) {
  const processor = pivot(group, 'ProcessorPivot', [0, 0, -5.55]);
  rounded(processor, [4.28, 2.92, 0.16], [0, 0, 0], board, 'MainBoard', 0.08);
  rounded(processor, [1.26, 0.96, 0.22], [-0.72, 0.38, -0.16], blackMetal, 'Processor', 0.08);
  rounded(processor, [0.82, 0.68, 0.18], [0.92, -0.48, -0.16], blackMetal, 'SignalProcessor', 0.06);
  rounded(processor, [0.56, 0.46, 0.15], [1.38, 0.55, -0.15], silverMetal, 'ControlChip', 0.04);
  for (let index = 0; index < 8; index += 1) {
    box(processor, [0.08, 2.02, 0.04], [-1.62 + index * 0.46, 0, -0.12], copper, `BoardTrace${String(index + 1).padStart(2, '0')}`);
  }
  for (let index = 0; index < 6; index += 1) {
    verticalCylinder(processor, 0.09, 0.16, [-1.6 + index * 0.55, 1.0, -0.15], silverMetal, `BoardCapacitor${String(index + 1).padStart(2, '0')}`, 16);
  }
  torus(processor, 0.44, 0.055, [-0.72, 0.38, -0.3], red, 'CreativeSignalRing');
}

function buildMemory(group) {
  const memory = pivot(group, 'MemoryPivot', [0, 0, -6.95]);
  rounded(memory, [3.62, 2.55, 0.32], [0, 0, 0], blackMetal, 'MemoryBay', 0.12);
  rounded(memory, [2.54, 1.52, 0.2], [0, 0, -0.2], board, 'MemoryCard', 0.08);
  for (let index = 0; index < 10; index += 1) box(memory, [0.13, 0.55, 0.04], [-0.78 + index * 0.175, -0.96, -0.33], copper, `MemoryContact${String(index + 1).padStart(2, '0')}`);
  torus(memory, 0.44, 0.055, [0, 0, -0.34], red, 'DataTransferRing');
}

function buildExit(group) {
  const viewfinder = pivot(group, 'ViewfinderPivot', [0, 0, -8.84]);
  rounded(group, [4.18, 3.05, 0.44], [0, 0, -8.84], body, 'RearModule', 0.2);
  rounded(viewfinder, [1.42, 1.14, 0.28], [0, 0.12, -0.18], blackMetal, 'Viewfinder', 0.18);
  torus(viewfinder, 0.86, 0.1, [0, 0.12, -0.35], silverMetal, 'ViewfinderRing');
  cylinder(viewfinder, 0.66, 0.22, [0, 0.12, -0.4], glassDark, 'ViewfinderGlass', 48);
  box(viewfinder, [0.55, 0.14, 0.12], [-1.3, 0.82, -0.38], red, 'OutputSignalLeft');
  box(viewfinder, [0.55, 0.14, 0.12], [1.3, 0.82, -0.38], red, 'OutputSignalRight');
}

function buildScene() {
  const scene = new Scene();
  scene.name = 'UFirst Camera Production Asset';
  const root = new Group();
  root.name = 'CameraRoot';
  scene.add(root);

  const exterior = new Group();
  exterior.name = '00 Camera exterior';
  root.add(exterior);
  buildExterior(exterior);

  const lens = new Group();
  lens.name = '01 Lens / attention';
  root.add(lens);
  buildLens(lens);

  const aperture = new Group();
  aperture.name = '02 Aperture / focus';
  root.add(aperture);
  buildAperture(aperture);

  const shutter = new Group();
  shutter.name = '03 Shutter / production';
  root.add(shutter);
  buildShutter(shutter);

  const sensor = new Group();
  sensor.name = '04 Sensor / insight';
  root.add(sensor);
  buildSensor(sensor);

  const processor = new Group();
  processor.name = '05 Processor / creative';
  root.add(processor);
  buildProcessor(processor);

  const memory = new Group();
  memory.name = '06 Memory / digital';
  root.add(memory);
  buildMemory(memory);

  const exit = new Group();
  exit.name = '07 Viewfinder / results';
  root.add(exit);
  buildExit(exit);

  return scene;
}

const scene = buildScene();
const exporter = new GLTFExporter();
exporter.parse(scene, (result) => {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(result));
  materials.forEach((value) => value.dispose());
  console.log(`Wrote ${outputPath} (${Buffer.byteLength(result)} bytes)`);
}, (error) => {
  console.error(error);
  process.exitCode = 1;
}, { binary: true, trs: true, onlyVisible: true });
