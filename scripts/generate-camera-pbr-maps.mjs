import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetDir = path.resolve(__dirname, '../public/assets/camera');
const albedoPath = path.resolve(__dirname, './source-assets/camera-body-albedo-v1.png');
const size = 716;

const { data, info } = await sharp(albedoPath)
  .resize(size, size, { fit: 'fill' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const luminance = (x, y) => {
  const sampleX = (x + size) % size;
  const sampleY = (y + size) % size;
  const offset = (sampleY * size + sampleX) * info.channels;
  return data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722;
};

const normal = Buffer.alloc(size * size * 4);
const roughness = Buffer.alloc(size * size * 4);

for (let y = 0; y < size; y += 1) {
  for (let x = 0; x < size; x += 1) {
    const pixel = (y * size + x) * 4;
    const dx = luminance(x + 1, y) - luminance(x - 1, y);
    const dy = luminance(x, y + 1) - luminance(x, y - 1);
    const rough = Math.max(0, Math.min(255, 177 + (luminance(x, y) - 42) * 0.34));

    normal[pixel] = Math.max(0, Math.min(255, 128 - dx * 2.8));
    normal[pixel + 1] = Math.max(0, Math.min(255, 128 - dy * 2.8));
    normal[pixel + 2] = 255;
    normal[pixel + 3] = 255;
    roughness[pixel] = rough;
    roughness[pixel + 1] = rough;
    roughness[pixel + 2] = rough;
    roughness[pixel + 3] = 255;
  }
}

await Promise.all([
  sharp(normal, { raw: { width: size, height: size, channels: 4 } })
    .webp({ quality: 82 })
    .toFile(path.join(assetDir, 'camera-body-normal-v1.webp')),
  sharp(roughness, { raw: { width: size, height: size, channels: 4 } })
    .webp({ quality: 82 })
    .toFile(path.join(assetDir, 'camera-body-roughness-v1.webp')),
  sharp(albedoPath)
    .webp({ quality: 82 })
    .toFile(path.join(assetDir, 'camera-body-albedo-v1.webp')),
]);

await fs.writeFile(path.join(assetDir, 'camera-body-pbr-manifest.json'), `${JSON.stringify({
  name: 'UFirst camera body PBR surface set',
  source: 'AI-generated neutral material scan, then derived normal and roughness maps',
  maps: {
    albedo: '/assets/camera/camera-body-albedo-v1.webp',
    normal: '/assets/camera/camera-body-normal-v1.webp',
    roughness: '/assets/camera/camera-body-roughness-v1.webp',
  },
  resolution: `${size}x${size}`,
  colorSpace: 'sRGB albedo; linear normal and roughness at runtime',
}, null, 2)}\n`);

console.log(`Generated camera PBR maps at ${assetDir}`);
