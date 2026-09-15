import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const asModule = (source) => import(`data:text/javascript;base64,${Buffer.from(ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 })).toString('base64')}`);
const keyframes = await asModule(readFileSync(new URL('../app/components/cinematic/camera-keyframes.ts', import.meta.url), 'utf8'));
const scrollSource = readFileSync(new URL('../app/components/cinematic/ScrollDirector.ts', import.meta.url), 'utf8')
  .replace("import { clamp, smooth } from '../scene-motion';", 'const clamp = (value) => Math.max(0, Math.min(1, value)); const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };');
const scroll = await asModule(scrollSource);

test('cinematic camera keyframes cover the complete journey with separate targets', () => {
  const frames = keyframes.CINEMATIC_KEYFRAMES;
  assert.equal(frames[0].progress, 0);
  assert.equal(frames.at(-1).progress, 1);
  assert.ok(frames.every((frame, index) => index === 0 || frame.progress > frames[index - 1].progress));
  assert.ok(frames.some((frame) => frame.scene === 'system'));
  assert.ok(frames.some((frame) => frame.scene === 'about'));
  assert.ok(frames.some((frame) => frame.scene === 'doors'));
  assert.ok(frames.some((frame) => frame.scene === 'services'));
  assert.ok(frames.some((frame) => frame.scene === 'work'));
  assert.notDeepEqual(frames[0].position, frames[0].target);
  assert.notDeepEqual(frames[3].position, frames[3].target);
});

test('responsive camera compositions are authored for tablet and mobile', () => {
  for (const variant of [keyframes.CINEMATIC_KEYFRAMES_TABLET, keyframes.CINEMATIC_KEYFRAMES_MOBILE]) {
    assert.equal(variant.length, keyframes.CINEMATIC_KEYFRAMES.length);
    assert.equal(variant[0].progress, 0);
    assert.equal(variant.at(-1).progress, 1);
    assert.ok(variant.some((frame) => frame.scene === 'doors'));
    assert.notDeepEqual(variant[0].position, keyframes.CINEMATIC_KEYFRAMES[0].position);
  }
});

test('scroll director ranges are ordered and reversible', () => {
  const ranges = scroll.CINEMATIC_RANGES;
  assert.equal(ranges[0].from, 0);
  assert.equal(ranges.at(-1).to, 1);
  assert.ok(ranges.every((range, index) => index === 0 || range.from >= ranges[index - 1].from));
  assert.equal(scroll.sceneAt(0).scene, 'reveal');
  assert.equal(scroll.sceneAt(0.3).scene, 'doors');
  assert.equal(scroll.sceneAt(0.58).scene, 'work');
  assert.equal(scroll.sceneAt(0.88).scene, 'contact');
  assert.equal(scroll.sceneAt(1).scene, 'exit');
  assert.ok(Math.abs(scroll.localSceneProgress(0.4, 0.2, 0.6) - 0.5) < 0.000001);
  assert.equal(scroll.localSceneProgress(-1, 0.2, 0.6), 0);
  assert.equal(scroll.localSceneProgress(2, 0.2, 0.6), 1);
});
