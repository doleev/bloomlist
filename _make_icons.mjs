// One-shot icon rasterizer. Uses nested SVG (with its own viewBox) so the heart
// auto-centers without me hand-computing a transform stack — sharp's librsvg
// chokes on stacked translate/scale on group + child paths.
import sharp from 'sharp';

// Inner box: 320x320 region centered in 512x512 → margin 96 on all sides
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"  stop-color="#FFA3BE"/>
      <stop offset="100%" stop-color="#EC4080"/>
    </linearGradient>
    <radialGradient id="shine" cx="35%" cy="30%" r="55%">
      <stop offset="0%"  stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg)"/>
  <rect width="512" height="512" fill="url(#shine)"/>
  <svg x="96" y="96" width="320" height="320" viewBox="0 0 24 24">
    <path d="M12 21s-7-4.5-7-10a5 5 0 019-3 5 5 0 019 3c0 5.5-7 10-7 10z" fill="#FFFFFF"/>
  </svg>
</svg>`;

const sizes = [
  { size: 180, file: 'icon-180.png' },
  { size: 192, file: 'icon-192.png' },
  { size: 512, file: 'icon-512.png' },
  { size: 32,  file: 'favicon-32.png' },
];

for (const { size, file } of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(file);
  console.log('wrote', file);
}
