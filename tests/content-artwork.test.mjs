import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const asModule = (code) => import(`data:text/javascript;base64,${Buffer.from(ts.transpile(code, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 })).toString('base64')}`);
const { defaultContent } = await asModule(readFileSync(new URL('../app/content.ts', import.meta.url), 'utf8'));
const storeSource = readFileSync(new URL('../lib/content-store.ts', import.meta.url), 'utf8').replace(/^import .*;\r?\n/gm, '');
const { mergeContent } = await asModule(`const defaultContent = ${JSON.stringify(defaultContent)};\n${storeSource}\nexport { mergeContent };`);

test('old bundled artwork upgrades while saved copy survives', () => {
  const old = structuredClone(defaultContent);
  old.services[0].title = 'Our custom strategy title';
  old.services[0].image.src = '/assets/hero-camera.jpg';
  old.system.browser.src = '/assets/ufirst-3d-browser.png';
  const merged = mergeContent(old);
  assert.equal(merged.services[0].title, 'Our custom strategy title');
  assert.equal(merged.services[0].image.src, defaultContent.services[0].image.src);
  assert.equal(merged.system.browser.src, defaultContent.system.browser.src);
});

test('custom uploaded artwork is never replaced', () => {
  const custom = structuredClone(defaultContent);
  custom.services[0].image.src = '/api/media/ufirst/my-brand.png';
  custom.system.browser.src = '/api/media/ufirst/my-scene.png';
  const merged = mergeContent(custom);
  assert.equal(merged.services[0].image.src, custom.services[0].image.src);
  assert.equal(merged.system.browser.src, custom.system.browser.src);
});
