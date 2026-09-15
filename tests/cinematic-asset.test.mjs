import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const modelPath = new URL('../public/models/ufirst-camera-production.glb', import.meta.url);
const mobileModelPath = new URL('../public/models/ufirst-camera-mobile.glb', import.meta.url);
const distantModelPath = new URL('../public/models/ufirst-camera-distant.glb', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../public/models/asset-manifest.json', import.meta.url), 'utf8'));

function readGlbJson(buffer) {
  assert.equal(buffer.toString('ascii', 0, 4), 'glTF');
  assert.equal(buffer.readUInt32LE(4), 2);
  const chunkLength = buffer.readUInt32LE(12);
  assert.equal(buffer.readUInt32LE(16), 0x4e4f534a);
  return JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength));
}

test('production camera GLB exposes the full exploded journey contract', () => {
  const buffer = readFileSync(modelPath);
  const gltf = readGlbJson(buffer);
  const names = new Set((gltf.nodes ?? []).map((node) => node.name));
  const requiredNames = [
    'CameraRoot',
    'BodyShellPivot',
    'LensMountPivot',
    'LensBarrelPivot',
    'FocusRingPivot',
    'AperturePivot',
    'ShutterPivot',
    'DisplayPivot',
    'BatteryDoorPivot',
    'TopPlatePivot',
    'CameraBody',
    'LensHousing',
    'LensMount',
    'FrontLens',
    'LensGlass01',
    'LensGlass02',
    'LensGlass03',
    'FocusRing',
    'Aperture',
    'Shutter',
    'Sensor',
    'Processor',
    'MainBoard',
    'Display',
    'Battery',
    'Buttons',
    'Dials',
    'Viewfinder',
    'Grip',
    'ScrewsAndFasteners',
  ];
  assert.deepEqual(requiredNames.filter((name) => !names.has(name)), []);
  assert.ok((gltf.meshes ?? []).length > 100);
  const asset = manifest.assets.find((entry) => entry.id === 'camera-production-glb');
  assert.equal(asset.path, 'public/models/ufirst-camera-production.glb');
  assert.equal(asset.status, 'implemented; final art approval pending');
  assert.equal(asset.triangleCount, 81288);
});

test('mobile camera GLB keeps the journey contract inside the low-quality budget', () => {
  const buffer = readFileSync(mobileModelPath);
  const gltf = readGlbJson(buffer);
  const names = new Set((gltf.nodes ?? []).map((node) => node.name));
  assert.ok(names.has('CameraRoot'));
  assert.ok(names.has('01 Lens / attention'));
  assert.ok(names.has('07 Viewfinder / results'));
  assert.ok((gltf.meshes ?? []).length > 100);
  const asset = manifest.assets.find((entry) => entry.id === 'camera-production-mobile-glb');
  assert.equal(asset.path, 'public/models/ufirst-camera-mobile.glb');
  assert.equal(asset.triangleCount, 32364);
});

test('distant camera GLB preserves the silhouette contract at low desktop quality', () => {
  const buffer = readFileSync(distantModelPath);
  const gltf = readGlbJson(buffer);
  const names = new Set((gltf.nodes ?? []).map((node) => node.name));
  assert.ok(names.has('CameraRoot'));
  assert.ok(names.has('00 Camera exterior'));
  assert.ok(names.has('07 Viewfinder / results'));
  assert.ok((gltf.meshes ?? []).length > 100);
  const asset = manifest.assets.find((entry) => entry.id === 'camera-production-distant-glb');
  assert.equal(asset.path, 'public/models/ufirst-camera-distant.glb');
  assert.equal(asset.triangleCount, 23288);
});
