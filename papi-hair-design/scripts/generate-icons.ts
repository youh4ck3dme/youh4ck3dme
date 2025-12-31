import { promises as fs } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512, 1024];
const currentFilePath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFilePath), '..');
const iconsDir = resolve(projectRoot, 'src/assets/icons');
const baseSvgPath = resolve(iconsDir, 'icon-base.svg');

async function ensureDirectory(path: string) {
  await fs.mkdir(path, { recursive: true });
}

async function fileExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

async function generate() {
  if (!(await fileExists(baseSvgPath))) {
    throw new Error(`Base SVG not found at ${baseSvgPath}.`);
  }

  await ensureDirectory(iconsDir);

  const svgBuffer = await fs.readFile(baseSvgPath);

  await Promise.all(
    ICON_SIZES.map(async (size) => {
      const fileName = `icon-${size}x${size}.png`;
      const outputPath = resolve(iconsDir, fileName);
      const png = await sharp(svgBuffer)
        .resize(size, size, { fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toBuffer();
      await fs.writeFile(outputPath, png);
      console.log(`Generated ${fileName}`);
    })
  );
}

generate().catch((error) => {
  console.error('[generate-icons] Failed to generate icons:', error);
  process.exitCode = 1;
});
