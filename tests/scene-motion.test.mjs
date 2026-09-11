import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { PerspectiveCamera, Vector3, Euler } from 'three';

const source = readFileSync(new URL('../app/components/scene-motion.ts', import.meta.url), 'utf8');
const compiled = ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
const { modulePose, fittedCameraDistance, smooth } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const chapters = ['hero', 'system', 'services', 'process', 'finale'];

test('all five chapters have reversible scroll motion and finite off-range poses', () => {
  for (const chapter of chapters) {
    const before = modulePose(chapter, 0.3, 0, 0);
    modulePose(chapter, 0.9, 0, 0);
    assert.deepEqual(modulePose(chapter, 0.3, 0, 0), before);
    assert.notDeepEqual(modulePose(chapter, 0, 0, 0), modulePose(chapter, 1, 0, 0));
    for (const value of [-1, 0, 0.5, 1, 2]) {
      assert.ok(Object.values(modulePose(chapter, value, 2, 0)).every(Number.isFinite));
    }
  }
});

test('service selection puts exactly one object in front', () => {
  for (let selected = 0; selected < 5; selected++) {
    const poses = Array.from({ length: 5 }, (_, i) => modulePose('services', 0.5, i, selected));
    assert.equal(poses.filter((p) => p.z > 0).length, 1);
    assert.equal(poses[selected].x, 0);
    assert.ok(poses.every((p, i) => i === selected || p.scale < poses[selected].scale));
  }
});

test('camera keeps module bounding spheres within mobile and desktop viewports', () => {
  for (const aspect of [0.7, 1, 1.5, 2.5, 4]) {
    const camera = new PerspectiveCamera(38, aspect, 0.1, 150);
    for (const chapter of chapters) for (const value of [0, 0.25, 0.5, 0.75, 1]) {
      const t = smooth(value);
      camera.position.z = fittedCameraDistance(aspect) - t * 0.6;
      camera.updateMatrixWorld();
      for (let i = 0; i < 5; i++) {
        const p = modulePose(chapter, value, i, i);
        const radius = 1.65 * p.scale;
        const center = new Vector3(p.x, p.y, p.z).applyEuler(new Euler(0.07, chapter === 'process' ? 0 : -0.3 + t * 0.65, 0));
        for (const dx of [-radius, radius]) for (const dy of [-radius, radius]) {
          const projected = center.clone().add(new Vector3(dx, dy, radius)).project(camera);
          assert.ok(Math.abs(projected.x) < 1 && Math.abs(projected.y) < 1, `${chapter}: clipped object ${i} at aspect ${aspect}`);
        }
      }
    }
  }
});
