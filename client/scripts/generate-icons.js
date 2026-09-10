const sharp = require('sharp');
const path = require('path');

const ASSETS = path.join(__dirname, '..', 'assets');

// Plate + fork + "log" tally bars, centered in a 1024x1024 canvas
const GLYPH = `
  <circle cx="512" cy="512" r="320" fill="#FFFFFF" />
  <circle cx="512" cy="512" r="244" fill="none" stroke="#E2E8F0" stroke-width="10" />

  <!-- Fork removed — to be redesigned in Figma -->

  <!-- Log tally bars -->
  <rect x="560" y="400" width="130" height="30" rx="15" fill="#6EE7B7" />
  <rect x="560" y="497" width="150" height="30" rx="15" fill="#FDE68A" />
  <rect x="560" y="594" width="110" height="30" rx="15" fill="#FCA5A5" />
`;

const MONO_GLYPH = `
  <circle cx="512" cy="512" r="320" fill="none" stroke="#FFFFFF" stroke-width="16" />
  <!-- Fork removed — to be redesigned in Figma -->
  <rect x="560" y="400" width="130" height="30" rx="15" fill="#FFFFFF" />
  <rect x="560" y="497" width="150" height="30" rx="15" fill="#FFFFFF" />
  <rect x="560" y="594" width="110" height="30" rx="15" fill="#FFFFFF" />
`;

const GRADIENT_DEFS = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C9FE4" />
      <stop offset="100%" stop-color="#C4B5FD" />
    </linearGradient>
  </defs>
`;

function svg(content, { background = 'transparent' } = {}) {
  const bg = background === 'transparent' ? '' : `<rect width="1024" height="1024" fill="${background}" />`;
  return `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    ${GRADIENT_DEFS}
    ${bg}
    ${content}
  </svg>`;
}

async function render(markup, size, outFile) {
  await sharp(Buffer.from(markup))
    .resize(size, size)
    .png()
    .toFile(path.join(ASSETS, outFile));
  console.log('wrote', outFile, `${size}x${size}`);
}

async function main() {
  // Full icon (gradient bg + glyph) — used for icon.png and splash-icon.png
  const fullIcon = svg(GLYPH, { background: 'url(#bg)' });
  await render(fullIcon, 1024, 'icon.png');
  await render(fullIcon, 1024, 'splash-icon.png');

  // Android adaptive icon foreground (glyph only, transparent)
  const foreground = svg(GLYPH, { background: 'transparent' });
  await render(foreground, 512, 'android-icon-foreground.png');

  // Android adaptive icon background (gradient only, no glyph)
  const background = svg('', { background: 'url(#bg)' });
  await render(background, 512, 'android-icon-background.png');

  // Android monochrome icon (white silhouette on transparent, for themed icons)
  const mono = svg(MONO_GLYPH, { background: 'transparent' });
  await render(mono, 432, 'android-icon-monochrome.png');

  // Favicon (small, full design)
  await render(fullIcon, 48, 'favicon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
