import { promises as fs } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const BRAND_DEEP = '#0c0c0c';
const BRAND_GOLD = '#d4af37';
const BRAND_GRAY = '#9da3a6';
const BRAND_WHITE = '#ffffff';
const ACCENT = '#00ffd0';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

type BannerSpec = {
  type: 'banner';
  output: string;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  accentLabel?: string;
  gradient?: [string, string];
  accent?: string;
};

type AvatarSpec = {
  type: 'avatar';
  output: string;
  size: number;
  initials: string;
  title: string;
  subtitle?: string;
  gradient?: [string, string];
  accent?: string;
};

type MapSpec = {
  type: 'map';
  output: string;
  width: number;
  height: number;
};

type AssetSpec = BannerSpec | AvatarSpec | MapSpec;

const assets: AssetSpec[] = [
  // Services
  {
    type: 'banner',
    output: 'src/assets/images/services/precision-cut.webp',
    width: 1600,
    height: 1000,
    title: 'Precision Cut',
    subtitle: 'Architected lines & couture finish',
    accentLabel: 'Signature',
  },
  {
    type: 'banner',
    output: 'src/assets/images/services/color-alchemy.webp',
    width: 1600,
    height: 1000,
    title: 'Color Alchemy',
    subtitle: 'Dimensional blending with gloss veil',
    accentLabel: 'Chromatic',
    gradient: [BRAND_DEEP, '#322511'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/services/editorial-styling.webp',
    width: 1600,
    height: 1000,
    title: 'Editorial Styling',
    subtitle: 'Runway textures & photo-set hold',
    accentLabel: 'Runway',
    gradient: [BRAND_DEEP, '#11212a'],
  },
  // Gallery (full + thumbs)
  {
    type: 'banner',
    output: 'src/assets/images/gallery/nebula-blonde.webp',
    width: 1600,
    height: 1060,
    title: 'Nebula Blonde',
    subtitle: 'Cool diffusion lights up the silhouette',
    accentLabel: 'After',
    gradient: [BRAND_DEEP, '#2a2a3f'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/nebula-blonde-thumb.webp',
    width: 600,
    height: 600,
    title: 'Nebula',
    subtitle: 'After',
    gradient: [BRAND_DEEP, '#2a2a3f'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/luminous-copper.webp',
    width: 1600,
    height: 1060,
    title: 'Luminous Copper',
    subtitle: 'Molten shine with halo contour',
    accentLabel: 'Color Story',
    gradient: [BRAND_DEEP, '#3a2012'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/luminous-copper-thumb.webp',
    width: 600,
    height: 600,
    title: 'Copper',
    subtitle: 'Glow',
    gradient: [BRAND_DEEP, '#3a2012'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/editorial-wave.webp',
    width: 1600,
    height: 1060,
    title: 'Editorial Wave',
    subtitle: 'Fluid curve with glass sheen',
    accentLabel: 'Texture',
    gradient: [BRAND_DEEP, '#0f242d'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/editorial-wave-thumb.webp',
    width: 600,
    height: 600,
    title: 'Wave',
    subtitle: 'Texture',
    gradient: [BRAND_DEEP, '#0f242d'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/glass-bob.webp',
    width: 1600,
    height: 1060,
    title: 'Glass Bob',
    subtitle: 'Sharp outline & mirror polish',
    accentLabel: 'Iconic',
    gradient: [BRAND_DEEP, '#1c1c1c'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/glass-bob-thumb.webp',
    width: 600,
    height: 600,
    title: 'Glass',
    subtitle: 'Bob',
    gradient: [BRAND_DEEP, '#1c1c1c'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/velvet-brunette.webp',
    width: 1600,
    height: 1060,
    title: 'Velvet Brunette',
    subtitle: 'Dimensional depth & cashmere feel',
    accentLabel: 'Rich',
    gradient: [BRAND_DEEP, '#1b1410'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/velvet-brunette-thumb.webp',
    width: 600,
    height: 600,
    title: 'Velvet',
    subtitle: 'Depth',
    gradient: [BRAND_DEEP, '#1b1410'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/halo-updo.webp',
    width: 1600,
    height: 1060,
    title: 'Halo Updo',
    subtitle: 'Celestial braids & luminous veil',
    accentLabel: 'Event',
    gradient: [BRAND_DEEP, '#15202d'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/gallery/halo-updo-thumb.webp',
    width: 600,
    height: 600,
    title: 'Halo',
    subtitle: 'Updo',
    gradient: [BRAND_DEEP, '#15202d'],
  },
  // Blog covers
  {
    type: 'banner',
    output: 'src/assets/images/blog/couture-blonde.webp',
    width: 1600,
    height: 900,
    title: 'Couture Blonde',
    subtitle: 'Winter care ritual',
    accentLabel: 'Journal',
    gradient: [BRAND_DEEP, '#2d2f45'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/blog/runway-texture.webp',
    width: 1600,
    height: 900,
    title: 'Runway Texture',
    subtitle: 'Prep essentials',
    accentLabel: 'Backstage',
    gradient: [BRAND_DEEP, '#1b2931'],
  },
  {
    type: 'banner',
    output: 'src/assets/images/blog/scalp-rituals.webp',
    width: 1600,
    height: 900,
    title: 'Scalp Rituals',
    subtitle: 'Holistic detox',
    accentLabel: 'Guide',
    gradient: [BRAND_DEEP, '#1f222b'],
  },
  // Client social proof avatars
  {
    type: 'avatar',
    output: 'src/assets/images/clients/lucia.webp',
    size: 512,
    initials: 'L',
    title: 'Lucia',
    subtitle: 'Balayage',
  },
  {
    type: 'avatar',
    output: 'src/assets/images/clients/tomas.webp',
    size: 512,
    initials: 'T',
    title: 'Tomáš',
    subtitle: 'Cut & Finish',
  },
  // Stylists
  {
    type: 'avatar',
    output: 'src/assets/images/stylists/sofia.webp',
    size: 640,
    initials: 'S',
    title: 'Sofia',
    subtitle: 'Color Director',
  },
  {
    type: 'avatar',
    output: 'src/assets/images/stylists/niko.webp',
    size: 640,
    initials: 'N',
    title: 'Niko',
    subtitle: 'Texture Specialist',
  },
  {
    type: 'avatar',
    output: 'src/assets/images/stylists/lena.webp',
    size: 640,
    initials: 'L',
    title: 'Lena',
    subtitle: 'Editorial Lead',
  },
  // Map fallback
  {
    type: 'map',
    output: 'src/assets/images/map.webp',
    width: 1400,
    height: 900,
  },
];

const currentFile = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFile), '..');

function idFromOutput(output: string, suffix: string) {
  const safe = output.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase();
  return `${safe}-${suffix}`;
}

function buildBannerSvg(spec: BannerSpec) {
  const gradient = spec.gradient ?? [BRAND_DEEP, '#1a1a1a'];
  const accent = spec.accent ?? BRAND_GOLD;
  const gradId = idFromOutput(spec.output, 'gradient');
  const glowId = idFromOutput(spec.output, 'glow');
  const glassId = idFromOutput(spec.output, 'glass');
  const title = escapeXml(spec.title);
  const subtitle = spec.subtitle ? escapeXml(spec.subtitle) : undefined;
  const accentLabel = spec.accentLabel ? escapeXml(spec.accentLabel) : undefined;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-label="${title}${subtitle ? ` – ${subtitle}` : ''}">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient[0]}" />
      <stop offset="100%" stop-color="${gradient[1]}" />
    </linearGradient>
    <radialGradient id="${glowId}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="${glassId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND_WHITE}" stop-opacity="0.18" />
      <stop offset="45%" stop-color="${BRAND_WHITE}" stop-opacity="0.02" />
      <stop offset="100%" stop-color="${BRAND_WHITE}" stop-opacity="0.12" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradId})" />
  <g transform="translate(${spec.width * 0.05} ${spec.height * 0.12})">
    <rect width="${spec.width * 0.9}" height="${spec.height * 0.76}" rx="${Math.round(Math.min(spec.width, spec.height) * 0.05)}" fill="url(#${glowId})" opacity="0.35" />
    <rect width="${spec.width * 0.9}" height="${spec.height * 0.76}" rx="${Math.round(Math.min(spec.width, spec.height) * 0.05)}" fill="url(#${glassId})" stroke="rgba(255,255,255,0.06)" stroke-width="4" />
    <line x1="${spec.width * 0.1}" x2="${spec.width * 0.8}" y1="${spec.height * 0.22}" y2="${spec.height * 0.22}" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.3" />
    <line x1="${spec.width * 0.15}" x2="${spec.width * 0.65}" y1="${spec.height * 0.58}" y2="${spec.height * 0.58}" stroke="${ACCENT}" stroke-width="2" stroke-linecap="round" opacity="0.3" />
  </g>
  <text x="${spec.width * 0.12}" y="${spec.height * 0.42}" fill="${BRAND_WHITE}" font-family="'Playfair Display', 'Times New Roman', serif" font-size="${spec.height * 0.16}" font-weight="600" letter-spacing="2">${title}</text>
  ${subtitle ? `<text x="${spec.width * 0.12}" y="${spec.height * 0.54}" fill="${BRAND_GRAY}" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="${spec.height * 0.06}" letter-spacing="3">${subtitle}</text>` : ''}
  ${accentLabel ? `<g transform="translate(${spec.width * 0.72} ${spec.height * 0.18})">
      <rect width="${spec.width * 0.18}" height="${spec.height * 0.12}" rx="${spec.height * 0.03}" fill="${accent}" opacity="0.85" />
      <text x="${spec.width * 0.09}" y="${spec.height * 0.08}" text-anchor="middle" fill="${BRAND_DEEP}" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-weight="600" font-size="${spec.height * 0.05}">${accentLabel}</text>
    </g>` : ''}
  <circle cx="${spec.width * 0.82}" cy="${spec.height * 0.68}" r="${spec.height * 0.1}" fill="${ACCENT}" opacity="0.18" />
  <circle cx="${spec.width * 0.78}" cy="${spec.height * 0.72}" r="${spec.height * 0.05}" fill="${ACCENT}" opacity="0.28" />
</svg>`;
}

function buildAvatarSvg(spec: AvatarSpec) {
  const gradient = spec.gradient ?? [BRAND_DEEP, BRAND_GOLD];
  const accent = spec.accent ?? ACCENT;
  const gradId = idFromOutput(spec.output, 'gradient');
  const ringId = idFromOutput(spec.output, 'ring');
  const size = spec.size;
  const initials = escapeXml(spec.initials);
  const title = escapeXml(spec.title.toUpperCase());
  const subtitle = spec.subtitle ? escapeXml(spec.subtitle.toUpperCase()) : undefined;
  const aria = escapeXml(`${spec.title}${spec.subtitle ? ` – ${spec.subtitle}` : ''}`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${aria}">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradient[0]}" />
      <stop offset="100%" stop-color="${gradient[1]}" />
    </linearGradient>
    <radialGradient id="${ringId}" cx="50%" cy="50%" r="50%">
      <stop offset="70%" stop-color="${accent}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" rx="${size / 5}" fill="${BRAND_DEEP}" />
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.42}" fill="url(#${gradId})" stroke="${BRAND_WHITE}" stroke-opacity="0.08" stroke-width="4" />
  <circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.46}" fill="url(#${ringId})" />
  <text x="50%" y="54%" text-anchor="middle" fill="${BRAND_WHITE}" font-family="'Playfair Display', 'Times New Roman', serif" font-size="${size * 0.36}" font-weight="600">${initials}</text>
  <text x="50%" y="${size * 0.88}" text-anchor="middle" fill="${BRAND_GRAY}" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="${size * 0.1}" letter-spacing="2">${title}</text>
  ${subtitle ? `<text x="50%" y="${size * 0.97}" text-anchor="middle" fill="${ACCENT}" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="${size * 0.08}" letter-spacing="1">${subtitle}</text>` : ''}
</svg>`;
}

function buildMapSvg(spec: MapSpec) {
  const gradId = idFromOutput(spec.output, 'gradient');
  const gridId = idFromOutput(spec.output, 'grid');
  const pinId = idFromOutput(spec.output, 'pin');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-label="Stylized map to Papi Hair Design">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND_DEEP}" />
      <stop offset="100%" stop-color="#1a2024" />
    </linearGradient>
    <pattern id="${gridId}" patternUnits="userSpaceOnUse" width="80" height="80">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="${BRAND_GRAY}" stroke-opacity="0.15" stroke-width="2" />
    </pattern>
    <radialGradient id="${pinId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#${gradId})" />
  <rect width="100%" height="100%" fill="url(#${gridId})" />
  <g transform="translate(${spec.width * 0.18} ${spec.height * 0.25})">
    <path d="M0 ${spec.height * 0.35} C ${spec.width * 0.18} ${-spec.height * 0.05}, ${spec.width * 0.4} ${spec.height * 0.7}, ${spec.width * 0.62} ${spec.height * 0.1}" stroke="${BRAND_GOLD}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
  </g>
  <g transform="translate(${spec.width * 0.62} ${spec.height * 0.38})">
    <circle cx="0" cy="0" r="${spec.height * 0.12}" fill="url(#${pinId})" />
    <path d="M0 ${-spec.height * 0.08} C ${spec.width * 0.02} ${-spec.height * 0.14}, ${spec.width * 0.05} ${-spec.height * 0.02}, 0 ${spec.height * 0.08}" fill="${BRAND_GOLD}" />
    <circle cx="0" cy="${-spec.height * 0.02}" r="${spec.height * 0.03}" fill="${BRAND_DEEP}" />
  </g>
  <text x="${spec.width * 0.1}" y="${spec.height * 0.85}" fill="${BRAND_WHITE}" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif" font-size="${spec.height * 0.06}" letter-spacing="3">PAPI HAIR DESIGN · BOTTOVA 2, BRATISLAVA</text>
</svg>`;
}

async function ensureDirectory(path: string) {
  await fs.mkdir(path, { recursive: true });
}

async function writeAsset(spec: AssetSpec) {
  const outputPath = resolve(projectRoot, spec.output);
  await ensureDirectory(dirname(outputPath));

  let svg: string;
  if (spec.type === 'banner') {
    svg = buildBannerSvg(spec);
  } else if (spec.type === 'avatar') {
    svg = buildAvatarSvg(spec);
  } else {
    svg = buildMapSvg(spec);
  }

  const image = await sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer();
  await fs.writeFile(outputPath, image);
  console.log(`Generated ${relative(projectRoot, outputPath)}`);
}

async function generateAll() {
  await Promise.all(assets.map((asset) => writeAsset(asset)));
}

generateAll().catch((error) => {
  console.error('[generate-media] Failed to generate assets:', error);
  process.exitCode = 1;
});
